import db from '@/appwrite/databases';
import { ID } from '@/appwrite/config';
import { uploadImage } from '@/appwrite/storage';

import { type Fundraiser, type FormData } from '@/lib/types';

import { BN } from 'bn.js';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { type Program } from '@coral-xyz/anchor';
import { type Cascade } from 'target/types/cascade';

async function submitRaiser(
  program: Program<Cascade>,
  organiserPubkey: PublicKey,
  data: FormData,
) {
  try {
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
      organiserPublicKey: organiserPubkey.toBase58(),
      country: data.country,
      deadline: data.deadline,
      goal: goal,
      title: data.title,
      story: data.story,
      imageID: fileId,
      completed: false,
    } as Fundraiser;

    const rustGoal = new BN(Math.floor(goal * LAMPORTS_PER_SOL));
    const rustDate = new BN(Math.floor(data.deadline.getTime() / 1000));

    const [campaignCounter] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign_counter')],
      program.programId,
    );
    const rawAccountInfo =
      await program.provider.connection.getAccountInfo(campaignCounter);

    // This tests whether we get a null account info or not
    console.log('campaignCounter', campaignCounter.toBase58());
    console.log('Raw Account Info:', rawAccountInfo);

    const counterAccount =
      await program.account.campaignCounter.fetchNullable(campaignCounter);
    const count = new BN(counterAccount ? counterAccount.count : -1);

    console.log('count', count.toString());

    if (count.eq(new BN(-1))) {
      throw new Error('Program not initialized');
    }

    const countBuffer = count.toArrayLike(Buffer, 'le', 8);

    const [campaign] = PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), organiserPubkey.toBuffer(), countBuffer],
      program.programId,
    );

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), organiserPubkey.toBuffer(), countBuffer],
      program.programId,
    );

    const [config] = PublicKey.findProgramAddressSync(
      [Buffer.from('config')],
      program.programId,
    );

    const accounts = {
      organiser: organiserPubkey,
      campaign,
      vault,
      config,
      campaignCounter,
    };

    await program.methods
      .createCampaign(rustGoal, rowId, rustDate)
      .accounts({ ...accounts })
      .signers([])
      .rpc();

    await db.fundraisers.createRow(rowData, [], rowId);

    const res = db.fundraisers.readRow(rowId, []);
    console.log('result', await res);
  } catch (e) {
    console.log('error from submitraiser ', e);
  }
}

export default submitRaiser;
