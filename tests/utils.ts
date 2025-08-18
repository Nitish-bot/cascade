import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Cascade } from "../target/types/cascade";

export { createAndFundAccount, getCampaignAndVault, createCampaign, donateToCampaign, SharedCampaignState };

type SharedCampaignState = {
  organiser: web3.Keypair,
  campaignId: anchor.BN,
  campaign: web3.PublicKey,
  vault: web3.PublicKey,
  goal: anchor.BN,
  meta: string,
}

async function createAndFundAccount(
  provider: anchor.AnchorProvider,
  amount: anchor.BN = new anchor.BN(web3.LAMPORTS_PER_SOL),
): Promise<web3.Keypair> {
    let account = web3.Keypair.generate();
    const airdropSignature = await provider.connection.requestAirdrop(
      account.publicKey,
      amount.toNumber(),
    );

    const latestBlockhash = await provider.connection.getLatestBlockhash();

    // Await confirmation for the airdrop transaction
    await provider.connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    return account;
}

async function getCampaignAndVault(
  program: Program<Cascade>,
  organiser: web3.PublicKey,
  campaignId: anchor.BN
): Promise<{ campaign: web3.PublicKey; vault: web3.PublicKey }> {
  let [campaign, _cBump] = await web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("campaign"),
      organiser.toBuffer(),
      campaignId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  const [vault, _vBump] = await web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("vault"),
      organiser.toBuffer(),
      campaignId.toArrayLike(Buffer, "le", 8),
    ],
    program.programId
  );

  return { campaign: campaign, vault: vault };
}

// Creates a dummy capaign with 1 Sol goal
async function createCampaign(
  provider: anchor.AnchorProvider,
  program: Program<Cascade>,
  ccPda: web3.PublicKey,
  configPda: web3.PublicKey,
  deadline: anchor.BN = new anchor.BN(Date.now() / 1000 + 7 * 24 * 60 * 60)): Promise<SharedCampaignState> {
  let amount = new anchor.BN(web3.LAMPORTS_PER_SOL);
  const organiser = await createAndFundAccount(provider, amount);  

  const campaignCounter = await program.account.campaignCounter.fetch(ccPda);
  const campaignId = campaignCounter.count;
    
  const { campaign, vault } = await getCampaignAndVault(
    program,
    organiser.publicKey,
    campaignId
  );

  const goal = new anchor.BN(web3.LAMPORTS_PER_SOL);
  const meta = "xyz.link";

  const tx = await program.methods
    .createCampaign(goal, meta, deadline)
    .accounts({
      organiser: organiser.publicKey,
      campaign,
      vault,
      campaignCounter: ccPda,
      config: configPda,
      systemProgram: web3.SystemProgram.programId,
    })
    .signers([organiser])
    .rpc();
  
  let campaignState: SharedCampaignState = {
    organiser: organiser,
    campaignId: campaignId,
    campaign: campaign,
    vault: vault,
    goal: goal,
    meta: meta,
  };

  return campaignState;
}

async function donateToCampaign(
  provider: anchor.AnchorProvider,
  program: Program<Cascade>,
  sharedState: SharedCampaignState,
  config: web3.PublicKey,
  amount: anchor.BN = new anchor.BN(web3.LAMPORTS_PER_SOL / 10) // Default to 0.1 SOL
): Promise<void> {
    const donor = await createAndFundAccount(provider, amount);
    const treasury = (await program.account.config.fetch(config)).treasuryPubkey;

    const tx = await program.methods
      .donate(amount)
      .accounts({
        donor: donor.publicKey,
        campaign: sharedState.campaign,
        vault: sharedState.vault,
        config: config,
        treasury: treasury,
        organiser: sharedState.organiser.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([donor])
      .rpc();
    
    console.log("Donation transaction signature:", tx);
}
