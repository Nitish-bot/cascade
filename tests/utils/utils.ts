import { Address, assertAccountExists, KeyPairSigner, lamports, MaybeAccount, Signature } from "@solana/kit";
import { Connection } from "solana-kite";

import * as cascade from "../../client/cascade";

function bigintToUint8ArrayLE(x: bigint, byteLength = 8): Uint8Array {
  const buf = new Uint8Array(byteLength);
  const view = new DataView(buf.buffer);
  view.setBigUint64(0, x, true); 
  return buf;
}

export async function createCampaign(
  connection: Connection,
  organiser: KeyPairSigner,
  counter: MaybeAccount<cascade.CampaignCounter, string>,
  counterPda: Address,
  configPda: Address,
  deadline?: bigint,
): Promise<{ campaignPda: Address; vaultPda: Address; }> {
  assertAccountExists(counter);
  const count = counter.data.count;

  const campaignSeeds = [
    Buffer.from("campaign"),
    organiser.address,
    bigintToUint8ArrayLE(count),
  ];

  const vaultSeeds = [
    Buffer.from("vault"),
    organiser.address,
    bigintToUint8ArrayLE(count),
  ];

  const { pda: campaignPda } = await connection.getPDAAndBump(
    cascade.CASCADE_PROGRAM_ADDRESS,
    campaignSeeds,
  );

  const { pda: vaultPda } = await connection.getPDAAndBump(
    cascade.CASCADE_PROGRAM_ADDRESS,
    vaultSeeds,
  );

  const secondsInDay = 24 * 60 * 60;
  const ix = cascade.getCreateCampaignInstruction({
    organiser: organiser,
    campaign: campaignPda,
    vault: vaultPda,
    campaignCounter: counterPda,
    config: configPda,

    goal: BigInt(1_000_000_000), // 1 SOL
    metadata: "xyz.link",
    deadline: deadline ?? BigInt(Math.floor(Date.now() / 1000) + 7 * secondsInDay),
  });

  await connection.sendTransactionFromInstructions({
    feePayer: organiser,
    instructions: [ix],
  })

  return { campaignPda, vaultPda, };
}

export async function donateToCampaign(
  connection: Connection,
  donor: KeyPairSigner,
  campaignPda: Address,
  vaultPda: Address,
  configPda: Address,
  treasury: Address,
  organiser: Address,
) {
  const ix = cascade.getDonateInstruction({
    donor: donor,
    campaign: campaignPda,
    vault: vaultPda,
    config: configPda,
    treasury: treasury,
    organiser: organiser,
    
    amount: lamports(100_000_000n),
  })

  const tx = await connection.sendTransactionFromInstructions({
    feePayer: donor,
    instructions: [ix],
  });
}