import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { Cascade } from "../target/types/cascade";

import { SharedCampaignState, createAndFundAccount, createCampaign, donateToCampaign } from "./utils";
import { expect } from "chai";

describe("cascade", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.cascade as Program<Cascade>;
  const wallet = provider.wallet.payer;

  // Derive the PDA for the campaign counter (cc)
  const ccSeeds = [Buffer.from("campaign_counter")];
  const [ccPda, _ccBump] = web3.PublicKey.findProgramAddressSync(
    ccSeeds,
    program.programId,
  );

  // Derive the PDA for the treasury account
  const configSeeds = [Buffer.from("config")];
  const [configPda, _cBump] = web3.PublicKey.findProgramAddressSync(
    configSeeds,
    program.programId,
  );

  let sharedState: SharedCampaignState;

  before("Init Campaign Counter", async () => {
    await provider.connection.requestAirdrop(wallet.publicKey, web3.LAMPORTS_PER_SOL);
    
    const campaignCounter = await provider.connection.getAccountInfo(ccPda);
    const treasury = await createAndFundAccount(provider);

    // Initialize the campaign counter if it doesn't exist
    if (!campaignCounter) {
      const tx = await program.methods
        .initialize()
        .accounts({
          signer: wallet.publicKey,
          campaignCounter: ccPda,
          config: configPda,
          treasury: treasury.publicKey,
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
    sharedState = await createCampaign(provider, program, ccPda, configPda);
    console.log("Campaign created with ID:", sharedState.campaignId.toString());
  })

  it("does not create a campaign with deadline less than a day", async () => {
    let deadline = new anchor.BN(Date.now() / 1000 + 60 * 60);
    
    try {
      sharedState = await createCampaign(provider, program, ccPda, configPda, deadline);
      expect.fail("Expected deadline too soon error");
    } catch (e) {
      expect(e.message).to.include("Deadline must be at least 1 day in the future");
    }
  })
  
  it("donates to a campaign", async() => {
    sharedState = await createCampaign(provider, program, ccPda, configPda);
    await donateToCampaign(provider, program, sharedState, configPda);
  })

  it("withdraws funds from a campaign", async () => {
    sharedState = await createCampaign(provider, program, ccPda, configPda);
    await donateToCampaign(provider, program, sharedState, configPda);

    let vault = sharedState.vault;
    let vaultBalance = new anchor.BN(await provider.connection.getBalance(vault));
    let rent_exempt = await provider.connection.getMinimumBalanceForRentExemption(vault.toBytes().length);
    let fee = vaultBalance.muln(0.02); // 2% platform fee
  
    const tx = await program.methods
    .withdraw(vaultBalance.subn(rent_exempt).sub(fee))
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