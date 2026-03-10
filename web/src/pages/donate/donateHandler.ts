import * as cascade from 'client/cascade';
import { type Connection } from 'solana-kite';
import {
  assertAccountExists,
  type Address,
  type SignatureBytes,
  type Transaction,
  type TransactionSendingSignerConfig,
} from '@solana/kit';

import db from '@/appwrite/databases';

const encoder = new TextEncoder();

function bigintToUint8ArrayLE(x: bigint, byteLength = 8): Uint8Array {
  const buf = new Uint8Array(byteLength);
  const view = new DataView(buf.buffer);
  view.setBigUint64(0, x, true);
  return buf;
}

type Signer = Readonly<{
  address: Address<string>;
  signAndSendTransactions(
    transactions: readonly Transaction[],
    config?: TransactionSendingSignerConfig,
  ): Promise<readonly SignatureBytes[]>;
}>;

export type DonateParams = {
  connection: Connection;
  donor: Signer;
  organiserAddress: Address;
  amount: number;
  fundraiserId: string; // This is the Appwrite $id, which matches on-chain metadata
  currentProgress: number;
};

/**
 * Find a campaign by its metadata (which is the Appwrite rowId)
 */
async function findCampaignByMetadata(
  connection: Connection,
  fundraiserId: string,
): Promise<{ campaign: cascade.Campaign; campaignId: bigint } | null> {
  const getCampaigns = connection.getAccountsFactory(
    cascade.CASCADE_PROGRAM_ADDRESS,
    cascade.CAMPAIGN_DISCRIMINATOR,
    cascade.getCampaignDecoder(),
  );

  const campaigns = await getCampaigns();

  for (const campaign of campaigns) {
    if (campaign.exists && campaign.data.metadata === fundraiserId) {
      return { campaign: campaign.data, campaignId: campaign.data.id };
    }
  }

  return null;
}

async function donate({
  connection,
  donor,
  organiserAddress,
  amount,
  fundraiserId,
  currentProgress,
}: DonateParams) {
  // Find the campaign by matching metadata to fundraiserId
  const campaignInfo = await findCampaignByMetadata(connection, fundraiserId);
  if (!campaignInfo) {
    throw new Error('Campaign not found on-chain. It may not have been created yet.');
  }

  const { campaignId } = campaignInfo;
  const amountLamports = BigInt(Math.floor(amount * 1e9));
  const countBuffer = bigintToUint8ArrayLE(campaignId);

  const { pda: configPda } = await connection.getPDAAndBump(
    cascade.CASCADE_PROGRAM_ADDRESS,
    [encoder.encode('config')],
  );

  const campaignSeeds = [
    encoder.encode('campaign'),
    organiserAddress.toString(),
    countBuffer,
  ];

  const vaultSeeds = [
    encoder.encode('vault'),
    organiserAddress.toString(),
    countBuffer,
  ];

  const { pda: campaignPda } = await connection.getPDAAndBump(
    cascade.CASCADE_PROGRAM_ADDRESS,
    campaignSeeds,
  );

  const { pda: vaultPda } = await connection.getPDAAndBump(
    cascade.CASCADE_PROGRAM_ADDRESS,
    vaultSeeds,
  );

  // Fetch config to get treasury address
  const getConfigs = connection.getAccountsFactory(
    cascade.CASCADE_PROGRAM_ADDRESS,
    cascade.CONFIG_DISCRIMINATOR,
    cascade.getConfigDecoder(),
  );

  const configs = await getConfigs();
  if (configs.length === 0) {
    throw new Error('Config not initialized');
  }
  const config = configs[0];
  assertAccountExists(config);

  const ix = await cascade.getDonateInstructionAsync({
    donor: donor,
    campaign: campaignPda,
    vault: vaultPda,
    config: configPda,
    treasury: config.data.treasuryPubkey,
    organiser: organiserAddress,
    amount: amountLamports,
  });

  await connection.sendTransactionFromInstructionsWithWalletApp({
    instructions: [ix],
    feePayer: donor,
  });

  // Fetch the existing row, update progress, and save
  const existingRow = await db.fundraisers.readRow(fundraiserId, []);
  const newProgress = currentProgress + amount;
  const updatedRow = { ...existingRow, progress: newProgress };
  await db.fundraisers.updateRow(updatedRow, [], fundraiserId);

  return { success: true, newProgress };
}

export default donate;
