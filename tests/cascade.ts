import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Cascade } from "../target/types/cascade";

describe("cascade", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.cascade as Program<Cascade>;
  const wallet = provider.wallet.payer;
  
  // Derive the PDA for the campaign counter (cc)
  const seeds = [Buffer.from("campaign_counter")];
  const [ccPda, _] = web3.PublicKey.findProgramAddressSync(
    seeds,
    program.programId,
  );

  let sharedState: SharedCampaignState;

  before("Init Campaign Counter", async () => {
    await provider.connection.requestAirdrop(wallet.publicKey, 2 * web3.LAMPORTS_PER_SOL);
    
    const campaignCounter = await provider.connection.getAccountInfo(ccPda);

    // Initialize the campaign counter if it doesn't exist
    if (!campaignCounter) {
      console.log("Campaign counter does not exist, initializing...");
      const tx = await program.methods
        .initialize()
        .accounts({
          signer: wallet.publicKey,
          campaignCounter: ccPda,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([wallet])
        .rpc();
      console.log("Campaign counter initialized with tx:", tx);
    } else {
      console.log("Campaign counter already exists");
    }
  })

  beforeEach("Create a new dummy campaign", async () => {
    sharedState = await createCampaign(provider, program, ccPda);
  })

  it("creates a campaign", async () => {
    console.log("Campaign created with ID:", sharedState.campaignId.toString());
  })

  it("donates to a campaign", async() => {
    await donateToCampaign(provider, program, sharedState);
  })

  it("withdraws funds from a campaign", async () => {
    let amount = new anchor.BN(web3.LAMPORTS_PER_SOL / 10); // 0.1 SOL
    await donateToCampaign(provider, program, sharedState, amount);

    const tx = await program.methods
      .withdraw(amount) // Withdraw 0.1 SOL
      .accounts({
        organiser: sharedState.organiser.publicKey,
        campaign: sharedState.campaign,
        vault: sharedState.vault,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([sharedState.organiser])
      .rpc();
  })
});

async function createAndFundAccount(provider: anchor.AnchorProvider, amount: number): Promise<web3.Keypair> {
    let account = web3.Keypair.generate();
    const airdropSignature = await provider.connection.requestAirdrop(
      account.publicKey,
      amount * web3.LAMPORTS_PER_SOL // Requesting 2 SOL to be safe
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
  ccPda: web3.PublicKey): Promise<SharedCampaignState> {
  const organiser = await createAndFundAccount(provider, 1);

  const goal = new anchor.BN(web3.LAMPORTS_PER_SOL);
  const meta = "xyz.link";

  const campaignCounter = await program.account.campaignCounter.fetch(ccPda);
  const campaignId = campaignCounter.count;
    
  const { campaign, vault } = await getCampaignAndVault(
    program,
    organiser.publicKey,
    campaignId
  );

  const tx = await program.methods
    .createCampaign(goal, meta)
    .accounts({
      organiser: organiser.publicKey,
      campaign,
      vault,
      campaignCounter: ccPda,
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
  amount: anchor.BN = new anchor.BN(web3.LAMPORTS_PER_SOL / 100) // Default to 0.01 SOL
): Promise<void> {
    const donor = await createAndFundAccount(provider, 1);

    const tx = await program.methods
      .donate(amount)
      .accounts({
        donor: donor.publicKey,
        campaign: sharedState.campaign,
        vault: sharedState.vault,
        organiser: sharedState.organiser.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([donor])
      .rpc();
    
    console.log("Donation transaction signature:", tx);
}

type SharedCampaignState = {
  organiser: web3.Keypair,
  campaignId: anchor.BN,
  campaign: web3.PublicKey,
  vault: web3.PublicKey,
  goal: anchor.BN,
  meta: string,
}