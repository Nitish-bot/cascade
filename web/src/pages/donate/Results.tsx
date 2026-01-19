import { useEffect } from 'react';

import { Query } from '@/appwrite/config';
import db from '@/appwrite/databases';
import { getImageUrl } from '@/appwrite/storage';

import type { Fundraiser } from '@/lib/types';
import Cause from '@/pages/donate/Cause';

type Props = {
  fundraisers: Fundraiser[];
  setFundraisers: (fundraisers: Fundraiser[]) => void;
};

function Results({ fundraisers, setFundraisers }: Props) {
  useEffect(() => {
    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const init = async () => {
    const res = await db.fundraisers.listRows([Query.limit(5)]);
    setFundraisers(res.rows);
  };

  return (
    <section className='w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-16 mb-4'>
      {fundraisers.length > 0 
        ? fundraisers.map((fundraiser) => {
          const imgSrc = getImageUrl(fundraiser.imageID);

          return Cause(
            fundraiser.$id,
            fundraiser.title,
            fundraiser.story,
            fundraiser.goal,
            fundraiser.progress,
            imgSrc,
          );
      }) 
      : Cause(
        "null",
        "loading..",
        "",
        420,
        69,
      ) }
    </section>
  );
}

export default Results;
