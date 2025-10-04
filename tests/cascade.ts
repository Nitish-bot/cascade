// Inbuilt testing libs without mocha or chai
import { before, beforeEach, describe, it } from "node:test";
import assert from "node:assert";

// Codama generated client
import * as cascade from "../client/cascade";
import { CASCADE_PROGRAM_ADDRESS } from "../client/cascade";

import { connect, Connection } from "solana-kite";
import { Address, KeyPairSigner, lamports, MaybeAccount } from "@solana/kit";

import { createCampaign, donateToCampaign } from "./utils";

const log = console.log;
const stringify = (obj: any) => {
  const bigIntReplacer = (key: string, value: any) => 
    typeof value === "bigint" ? value.toString() : value;
  return JSON.stringify(obj, bigIntReplacer, 2);
}

describe("cascade", () => {
  let alice: KeyPairSigner;
  let bob: KeyPairSigner;
  let wallet: KeyPairSigner;
  let connection: Connection;
  
  let getCounters: () => Promise<MaybeAccount<cascade.CampaignCounter, string>[]>;
  let counter: MaybeAccount<cascade.CampaignCounter, string>;

  const counterSeeds = [Buffer.from("campaign_counter")];
  const configSeeds = [Buffer.from("config")];
  
  let counterPda: Address;
  let configPda: Address;


  before(async () => {
    connection = connect();

    wallet = await connection.loadWalletFromFile();
    [alice, bob] = await connection.createWallets(2);

    counterPda = (await connection.getPDAAndBump(
      CASCADE_PROGRAM_ADDRESS,
      counterSeeds
    )).pda;

    configPda = (await connection.getPDAAndBump(
      CASCADE_PROGRAM_ADDRESS,
      configSeeds
    )).pda;

    getCounters = connection.getAccountsFactory(
      CASCADE_PROGRAM_ADDRESS,
      cascade.CAMPAIGN_COUNTER_DISCRIMINATOR,
      cascade.getCampaignCounterDecoder(),
    );
    const counter_list = await getCounters();

    const initialized = counter_list.length === 1 && counter_list[0].exists;

    if (!initialized) {
      const ix =  cascade.getInitializeInstruction({
        signer: wallet,
        campaignCounter: counterPda,
        config: configPda,
        treasury: wallet.address,
      })

      const tx = await connection.sendTransactionFromInstructions({
        feePayer: wallet,
        instructions: [ix],
      });

      log("Program initialized with tx:", tx);
    } else {
      log("Campaign counter already exists");
    }
  });

  beforeEach(async() => {
    connection.airdropIfRequired(
      alice.address,
      lamports(1_000_000_000n),
      lamports(500_000_000n)
    );

    connection.airdropIfRequired(
      bob.address,
      lamports(1_000_000_000n),
      lamports(500_000_000n)
    );

    connection.airdropIfRequired(
      wallet.address,
      lamports(1_000_000_000n),
      lamports(500_000_000n)
    );

    counter = (await getCounters())[0];
  })

  it("creates a campaign", async () => {
    await createCampaign(
      connection,
      alice,
      counter,
      counterPda,
      configPda,
    );
  });

  it("does not create a campaign with deadline less than a day", async () => {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 12 * 60 * 60);

    await assert.rejects(
      createCampaign(
        connection,
        alice,
        counter,
        counterPda,
        configPda,
        deadline,
      ),
    )
  });

  it("donates to a campaign", async () => {
    const { campaignPda, vaultPda } = await createCampaign(
      connection,
      alice,
      (await getCounters())[0],
      counterPda,
      configPda,
    );
    
    await donateToCampaign(
      connection,
      bob,
      campaignPda,
      vaultPda,
      configPda,
      wallet.address,
      alice.address,
    );

    const balance = await connection.getLamportBalance(vaultPda, "confirmed");
    assert(balance > 97_000_000n, "Donation not received in vault");
  });

  it("withdraws funds from a campaign", async () => {
    const { campaignPda, vaultPda } = await createCampaign(
      connection,
      alice,
      (await getCounters())[0],
      counterPda,
      configPda,
    );

    await donateToCampaign(
      connection,
      bob,
      campaignPda,
      vaultPda,
      configPda,
      wallet.address,
      alice.address,
    );

    const aliceBalanceBefore = await connection.getLamportBalance(alice.address, "confirmed");
    const vaultBalance = await connection.getLamportBalance(vaultPda, "confirmed");
    
    const rentExempt =
      await connection.rpc.getMinimumBalanceForRentExemption(
        // This is because the vault is just a 
        // SystemAccount with no data
        BigInt(0),
      ).send();

    const tx = cascade.getWithdrawInstruction({
      organiser: alice,
      campaign: campaignPda,
      vault: vaultPda,

      amount: vaultBalance - rentExempt,
    });

    await connection.sendTransactionFromInstructions({
      feePayer: alice,
      instructions: [tx],
    });
    
    const aliceBalanceAfter = await connection.getLamportBalance(alice.address, "confirmed");
    assert(
      aliceBalanceAfter >= aliceBalanceBefore + vaultBalance - rentExempt - 10_000n,
      "Withdrawal not received in organiser account"
    );    
  });
});
