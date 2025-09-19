import middlemen from '@/assets/middlemen.svg';
import transparency from '@/assets/transparency.svg';
import fast from '@/assets/fast.svg';
import censorship from '@/assets/censorship.svg';
import lowfee from '@/assets/lowfee.svg';

import Star9 from '@/components/assets/star-9';

import { Button } from '@/components/ui/button';

const contents = [
  {
    title: 'No Middlemen',
    description:
      'Funds move directly between supporters and causes - no overseers and approvers.',
    icon: middlemen,
  },
  {
    title: 'Transparent by Design',
    description:
      'Every contribution is visible on the blockchain, so you always know where money flows.',
    icon: transparency,
  },
  {
    title: 'Fast and Reliable',
    description:
      "Solana's lightning-quick processing ensures support reaches causes in seconds, not days.",
    icon: fast,
  },
  {
    title: 'Censorship Resistant',
    // "description": "Campaigns can't be silenced or frozen, giving every cause a fair chance to be heard.",
    icon: censorship,
  },
  {
    title: 'Mininmal Fees',
    description:
      'We only charge a tiny fee to keep the platform running, ensuring that the causes get the most of your support.',
    icon: lowfee,
  },
];

const cards = contents.map((content, index) => {
  const grid_number = `box-${index + 1}`;
  {
    /* /// !USEFUL!  -  The grid area style right here is the indentifier for css */
  }
  return (
    <Button
      style={{ gridArea: grid_number }}
      className={
        grid_number +
        ' box whitespace-normal p-4 border-[var(--light-border)] hover:border-border transition-all duration-200'
      }
      size='freeform'
      variant={'reverse'}
      key={index}
    >
      <div className='text-left flex h-full justify-between items-center m-3'>
        <div className='card-text self-center'>
          <h1 className='text-2xl font-bold leading-none tracking-wide break-words mb-3'>
            {content.title}
          </h1>
          <p className='text-lg text-gray-800 leading-snug break-words'>
            {content.description}
          </p>
        </div>
        <img
          src={content.icon}
          alt={content.title + ' icon'}
          className='card-icon h-24 opacity-85 self-center'
        />
      </div>
    </Button>
  );
});

function Why() {
  return (
    <div className='why min-h-[100vh] relative'>
      <Star9 className='absolute w-[32vh] left-0 top-0 -translate-x-1/2 -translate-y-1/2' />

      <div className='relative z-10 text-center pt-16 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
        <h2 className='text-4xl md:text-6xl font-extrabold text-border mb-6'>
          Why{' '}
          <span className='text-border underline decoration-main'>CASCADE</span>
          <span> ?</span>
        </h2>
      </div>

      <div className='flex justify-center items-center w-full pt-8'>
        <div
          id='features-grid-container'
          className='grid grid-cols-[200px_200px_200px] grid-rows-[200px_200px_200px] gap-8'
        >
          {cards}
        </div>
      </div>
    </div>
  );
}

export default Why;
