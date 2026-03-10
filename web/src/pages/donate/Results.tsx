import { useEffect } from 'react';

import { Query } from '@/appwrite/config';
import db from '@/appwrite/databases';
import { getImageUrl } from '@/appwrite/storage';

import type { Fundraiser } from '@/lib/types';
import Cause from '@/pages/donate/Cause';
import { type DonateParams } from './donateHandler';
import { type Connection } from 'solana-kite';

type Props = {
  fundraisers: Fundraiser[];
  setFundraisers: (fundraisers: Fundraiser[]) => void;
  connection: Connection;
  donor: DonateParams['donor'] | null;
};

function Results({ fundraisers, setFundraisers, connection, donor }: Props) {
  const init = async () => {
    const res = await db.fundraisers.listRows([Query.limit(5)]);
    setFundraisers(res.rows);
  };
  
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!donor) {
    return (
      <section className='w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-16 mb-4'>
        <div className='min-h-screen flex flex-col items-center justify-center'>
          <p className='text-lg font-semibold mb-4'>Please connect a wallet to donate.</p>
          {/* Optionally add a wallet connect button here */}
        </div>
      </section>
    );
  }

  const handleDonationComplete = (fundraiserId: string, newProgress: number) => {
    setFundraisers(
      fundraisers.map((f) =>
        f.$id === fundraiserId ? { ...f, progress: newProgress } : f,
      ),
    );
  };

  return (
    <section className='w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-16 mb-4'>
      {fundraisers.length > 0 ? (
        fundraisers.map((fundraiser) => {
          const imgSrc = getImageUrl(fundraiser.imageID);

          return (
            <Cause
              key={fundraiser.$id}
              id={fundraiser.$id}
              title={fundraiser.title}
              description={fundraiser.story}
              goal={fundraiser.goal}
              completed={fundraiser.progress}
              imgUrl={imgSrc}
              organiserPublicKey={fundraiser.organiserPublicKey}
              connection={connection}
              donor={donor}
              onDonationComplete={(newProgress) =>
                handleDonationComplete(fundraiser.$id, newProgress)
              }
            />
          );
        })
      ) : ( <></> )}
    </section>
  );
}

export default Results;
