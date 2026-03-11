import middlemen from '@/assets/middlemen.svg';
import transparency from '@/assets/transparency.svg';
import fast from '@/assets/fast.svg';
import censorship from '@/assets/censorship.svg';
import lowfee from '@/assets/lowfee.svg';

import { Button } from '@/components/ui/button';
import Star13 from '@/components/assets/star-13';

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
    description:
      "Campaigns can't be silenced or frozen, giving every cause a fair chance to be heard.",
    icon: censorship,
  },
  {
    title: 'Minimal Fees',
    description:
      'We only charge a tiny fee to keep the platform running, ensuring that the causes get the most of your support.',
    icon: lowfee,
  },
];

const cards = contents.map((content, index) => {
  const grid_number = `box-${index + 1}`;
  return (
    <Button
      className={[
        grid_number,
        'box whitespace-normal p-4',
        'min-h-[160px]',
        'border-[var(--light-border)] hover:border-border',
        'transition-all duration-200',
      ].join(' ')}
      size='freeform'
      variant='reverse'
      key={index}
    >
      <div className='text-left flex justify-between items-center m-2 gap-3'>
        <div className='card-text self-center min-w-0'>
          <h1 className='text-xl xl:text-2xl font-bold leading-snug tracking-wide break-words mb-2'>
            {content.title}
          </h1>
          <p className='text-sm xl:text-lg text-gray-800 leading-snug break-words'>
            {content.description}
          </p>
        </div>
        <img
          src={content.icon}
          alt={content.title + ' icon'}
          className='card-icon h-16 xl:h-24 opacity-85 self-center flex-shrink-0'
        />
      </div>
    </Button>
  );
});

function Why() {
  return (
    <div className='why min-h-[100vh] relative my-8'>
      <Star13 className='absolute w-[32vh] left-0 top-0 -translate-x-1/2 -translate-y-1/2' />

      {/* ── Section heading ── */}
      <div className='relative z-10 text-center pt-16 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-4'>
        <h2 className='text-4xl md:text-6xl font-extrabold text-border'>
          Why{' '}
          <span className='text-border underline decoration-main decoration-6'>
            CASCADE
          </span>
          <span> ?</span>
        </h2>
      </div>

      {/* ── Feature grid ──
          mobile  : 1 column, content-height rows
          sm/md/lg: 2 columns, content-height rows
          xl+     : 3 × 200 px bento with named grid-template-areas (set in App.css)
      ── */}
      <div className='flex justify-center items-center w-full pt-8 px-4 sm:px-8 xl:px-0'>
        <div id='features-grid-container' className='grid w-full'>
          {cards}
        </div>
      </div>
    </div>
  );
}

export default Why;
