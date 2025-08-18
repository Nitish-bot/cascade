import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Cascade } from "../target/types/cascade";

import { SharedCampaignState, createCampaign, donateToCampaign } from "./utils";

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
    await provider.connection.requestAirdrop(wallet.publicKey, web3.LAMPORTS_PER_SOL);
    
    const campaignCounter = await provider.connection.getAccountInfo(ccPda);

    // Initialize the campaign counter if it doesn't exist
    if (!campaignCounter) {
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
    // Each test gets a fresh campaign state
    sharedState = await createCampaign(provider, program, ccPda);
  })

  it("creates a campaign", async () => {
    // This test is already covered in the beforeEach hook
    console.log("Campaign created with ID:", sharedState.campaignId.toString());
  })

  it("donates to a campaign", async() => {
    await donateToCampaign(provider, program, sharedState);
  })

  it("withdraws funds from a campaign", async () => {
    let amount = new anchor.BN(web3.LAMPORTS_PER_SOL / 10); // 0.1 SOL
    await donateToCampaign(provider, program, sharedState, amount);

    let rent_exempt = await provider.connection.getMinimumBalanceForRentExemption(sharedState.vault.toBytes().length);
    const tx = await program.methods
    .withdraw(amount.subn(rent_exempt))
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