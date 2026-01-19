import db from '@/appwrite/databases';
import { ID } from '@/appwrite/config';
import { uploadImage } from '@/appwrite/storage';

import { type Fundraiser, type FormData } from '@/lib/types';

import * as cascade from '../../../../client/cascade';
import { type Connection } from 'solana-kite';
import { assertAccountExists, type Address, type SignatureBytes, type Transaction, type TransactionSendingSignerConfig } from '@solana/kit';

const LAMPORTS_PER_SOL = 1_000_000_000n;

function bigintToUint8ArrayLE(x: bigint, byteLength = 8): Uint8Array {
  const buf = new Uint8Array(byteLength);
  const view = new DataView(buf.buffer);
  view.setBigUint64(0, x, true); 
  return buf;
}

const encoder = new TextEncoder();

type Signer = Readonly<{
  address: Address<string>;
  signAndSendTransactions(transactions: readonly Transaction[], config?: TransactionSendingSignerConfig): Promise<readonly SignatureBytes[]>;
}>

async function submitRaiser(
  connection: Connection,
  organiser: Signer,
  data: FormData,
) {
  try {
    const getCounters = connection.getAccountsFactory(
      cascade.CASCADE_PROGRAM_ADDRESS,
      cascade.CAMPAIGN_COUNTER_DISCRIMINATOR,
      cascade.getCampaignCounterDecoder(),
    );

    const fileId = ID.unique();
    const rowId = ID.unique();

    const image = data.image?.item(0);
    if (!image) {
      throw new Error('No image provided');
    }

    await uploadImage(image, fileId);

    const goal = parseFloat(data.goal);
    if (isNaN(goal)) {
      throw new Error('Invalid goal amount');
    }

    const rowData = {
      beneficiaryName: data.name,
      beneficiaryEmail: data.email,
      organiserPublicKey: organiser.address.toString(),
      country: data.country,
      deadline: data.deadline,
      goal: goal,
      title: data.title,
      story: data.story,
      imageID: fileId,
      completed: false,
      progress: 0,
    } as Fundraiser;

    const rustGoal = BigInt(goal) * LAMPORTS_PER_SOL;
    const rustDate = BigInt(Math.floor(data.deadline.getTime() / 1000));

    const { pda: configPda } = await connection.getPDAAndBump(
      cascade.CASCADE_PROGRAM_ADDRESS,
      [encoder.encode('config')],
    );
    
    const { pda: counterPda } = await connection.getPDAAndBump(
      cascade.CASCADE_PROGRAM_ADDRESS,
      [encoder.encode('campaign_counter')],
    );

    // LOOK HERE IF COUNTER IS WRONG 
    // TURN COMMITTMENT TO CONFRIMED
    const counter = (await getCounters())[0];
    assertAccountExists(counter);
    const count = counter.data.count;

    console.log('count', count.toString());

    // WE NEED MORE SANITY CHECKS LIKE WHAT IF 
    // getCounters RETURNS 0 ACCOUNTS
    const countBuffer = bigintToUint8ArrayLE(count);

    const campaignSeeds = [
      encoder.encode("campaign"),
      organiser.address.toString(),
      countBuffer,
    ];
  
    const vaultSeeds = [
      encoder.encode("vault"),
      organiser.address.toString(),
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
    
    const ix = cascade.getCreateCampaignInstruction({
      organiser: organiser,
      campaign: campaignPda,
      vault: vaultPda,
      config: configPda,
      campaignCounter: counterPda,
      
      goal: rustGoal,
      metadata: rowId,
      deadline: rustDate,
    })

    const tx = await connection.sendTransactionFromInstructionsWithWalletApp({
      instructions: [ix],
      feePayer: organiser,
    })
    console.log('Transaction', tx);
    
    await db.fundraisers.createRow(rowData, [], rowId);
    const res = db.fundraisers.readRow(rowId, []);
    console.log('result', await res);
  } catch (e) {
    console.log('error from submitraiser ', e);
  }
}

export default submitRaiser;
