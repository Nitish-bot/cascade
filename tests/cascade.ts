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

  it("creates a campaign", async () => {
    const organiser = web3.Keypair.generate();

    const airdropSignature = await provider.connection.requestAirdrop(
      organiser.publicKey,
      2 * web3.LAMPORTS_PER_SOL // Requesting 2 SOL to be safe
    );

    const latestBlockhash = await provider.connection.getLatestBlockhash();

    // Await confirmation for the airdrop transaction
    await provider.connection.confirmTransaction({
      blockhash: latestBlockhash.blockhash,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      signature: airdropSignature,
    });

    console.log("Airdrop confirmed!");

    const goal = new anchor.BN(web3.LAMPORTS_PER_SOL / 10);
    const meta = "xyz.link";

    const campaignCounter = await program.account.campaignCounter.fetch(ccPda);
    
    const campaignPda = await web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign"),
        organiser.publicKey.toBuffer(),
        campaignCounter.count.toArrayLike(Buffer, "le", 8),
      ],
      program.programId,
    )

    const vaultPda = await web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("vault"),
        organiser.publicKey.toBuffer(),
        campaignCounter.count.toArrayLike(Buffer, "le", 8),
      ],
      program.programId,
    )

    const tx = await program.methods
      .createCampaign(goal, meta)
      .accounts({
        organiser: organiser.publicKey,
        campaign: campaignPda,
        vault: vaultPda,
        campaignCounter: ccPda,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([organiser])
      .rpc();
    
    console.log("Campaign created with tx:", tx);
  })
});
