import { useEffect } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import { Query } from '@/appwrite/config';
import db from '@/appwrite/databases';

import imgSrc from '@/assets/censorship.svg';

const Cause = (
  title: string,
  description: string,
  goal: number,
  completed: number,
  imgUrl: string,
) => {
  return (
    <Card className='shadow-0 my-12' key={title}>
      <CardContent className='flex justify-between gap-12 xl:gap-24'>
        <img src={imgUrl} className='h-40 xl:h-60'></img>
        <div className='flex flex-col justify-between items-end text-right'>
          <CardTitle className='text-lg leading-tight tracking-wide'>
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
          <div className='align-end flex gap-4 items-centers justify-center w-full mt-8'>
            <div className='flex flex-col items-start w-full items-center gap-2 mt-1'>
              <Progress value={30} />
              <span>
                {completed} SOL of {goal} SOL
              </span>
            </div>
            <Button size={'default'} variant={'noShadow'}>
              Donate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

type Props = {
  fundraisers: any[];
  setFundraisers: (fundraisers: any[]) => void;
};

function Results({ fundraisers, setFundraisers }: Props) {
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const res = await db.fundraisers.listRows([Query.limit(5)]);

    setFundraisers(res.rows);
  };

  return (
    <section className='w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-16 mb-4'>
      {fundraisers.map((fundraiser) =>
        Cause(
          fundraiser.title,
          fundraiser.story,
          fundraiser.goal,
          fundraiser.completed,
          imgSrc,
        ),
      )}
    </section>
  );
}

export default Results;
