// Inbuilt testing libs without mocha or chai
import { before, beforeEach, describe, it } from "node:test";
import assert from "node:assert";

// Codama generated client
import * as cascade from "../web/client/cascade";
import { CASCADE_PROGRAM_ADDRESS } from "../web/client/cascade";

import { connect, Connection } from "solana-kite";
import { Address, KeyPairSigner, lamports, MaybeAccount } from "@solana/kit";

import { createCampaign, donateToCampaign } from "./utils";

const log = console.log;
const stringify = (obj: any) => {
  const bigIntReplacer = (key: string, value: any) =>
    typeof value === "bigint" ? value.toString() : value;
  return JSON.stringify(obj, bigIntReplacer, 2);
};

describe("cascade", () => {
  let alice: KeyPairSigner;
  let bob: KeyPairSigner;
  let wallet: KeyPairSigner;
  let connection: Connection;

  let getCounters: () => Promise<
    MaybeAccount<cascade.CampaignCounter, string>[]
  >;
  let counter: MaybeAccount<cascade.CampaignCounter, string>;

  const counterSeeds = [Buffer.from("campaign_counter")];
  const configSeeds = [Buffer.from("config")];

  let counterPda: Address;
  let configPda: Address;

  before(async () => {
    connection = connect('helius-devnet');

    wallet = await connection.loadWalletFromFile();
    
    // Create keypairs without auto-airdrop, then fund from main wallet
    [alice, bob] = await connection.createWallets(2, {
      airdropAmount: lamports(0n),
    });
    
    // Fund alice and bob from the main wallet
    const transferToAlice = await connection.transferLamports({
      source: wallet,
      destination: alice.address,
      amount: lamports(50_000_000n), // 0.1 SOL
    });
    const transferToBob = await connection.transferLamports({
      source: wallet,
      destination: bob.address,
      amount: lamports(50_000_000n), // 0.1 SOL
    });
    log("Funded alice:", transferToAlice);
    log("Funded bob:", transferToBob);

    counterPda = (
      await connection.getPDAAndBump(CASCADE_PROGRAM_ADDRESS, counterSeeds)
    ).pda;

    configPda = (
      await connection.getPDAAndBump(CASCADE_PROGRAM_ADDRESS, configSeeds)
    ).pda;

    getCounters = connection.getAccountsFactory(
      CASCADE_PROGRAM_ADDRESS,
      cascade.CAMPAIGN_COUNTER_DISCRIMINATOR,
      cascade.getCampaignCounterDecoder(),
    );
    const counter_list = await getCounters();

    const initialized = counter_list.length === 1 && counter_list[0].exists;

    if (!initialized) {
      const ix = cascade.getInitializeInstruction({
        signer: wallet,
        campaignCounter: counterPda,
        config: configPda,
        treasury: wallet.address,
      });

      const tx = await connection.sendTransactionFromInstructions({
        feePayer: wallet,
        instructions: [ix],
      });

      log("Program initialized with tx:", tx);
    } else {
      log("Campaign counter already exists");
    }
  });

  beforeEach(async () => {
    // Wallets are funded in before(), no airdrops needed with Helius
    counter = (await getCounters())[0];
  });

  it("creates a campaign", async () => {
    await createCampaign(connection, alice, counter, counterPda, configPda);
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
    );
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
    assert(balance > 19_000_000n, "Donation not received in vault");
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

    const aliceBalanceBefore = await connection.getLamportBalance(
      alice.address,
      "confirmed",
    );

    const tx = cascade.getWithdrawInstruction({
      organiser: alice,
      campaign: campaignPda,
      vault: vaultPda,
      config: configPda,

      amount: 1_000_000n,
    });

    await connection.sendTransactionFromInstructions({
      feePayer: alice,
      instructions: [tx],
    });

    const aliceBalanceAfter = await connection.getLamportBalance(
      alice.address,
      "confirmed",
    );
    assert(
      aliceBalanceAfter >=
        aliceBalanceBefore + 1_000_000n - 10_000n,
      "Withdrawal not received in organiser account",
    );
  });
});
