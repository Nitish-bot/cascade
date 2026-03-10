import full from '@/assets/full.svg';
import half from '@/assets/half.svg';
import empty from '@/assets/empty.svg';
import Star9 from '@/components/assets/star-9';

const steps = [
  { src: empty, label: 'Introduce your cause', align: 'self-start' },
  { src: half, label: 'Write your story', align: 'self-end' },
  { src: full, label: 'Tell it to the world', align: 'self-start' },
];

function How() {
  return (
    <div className='flex flex-col gap-16 md:gap-24 py-8 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto px-4 sm:px-6 md:px-0 relative'>
      {/* ── Heading row ── */}
      <div className='flex justify-between items-center relative z-10'>
        <Star9 className='h-12 sm:h-16 flex-shrink-0' />
        <h1 className='text-left text-4xl md:text-6xl font-extrabold text-border ml-4'>
          How it works
        </h1>
      </div>

      {/* ── Step cards ──
           mobile/tablet : vertical stack, all centre-aligned
           xl+           : horizontal row with alternating top/bottom alignment
      */}
      <div className='flex xl:flex-row flex-col gap-8 lg:gap-12 justify-center lg:mb-24 relative z-10 pb-4'>
        {steps.map(({ src, label, align }) => (
          <div
            key={label}
            className={`
              flex-1
              xl:${align}
              bg-secondary-background border-2 border-border rounded-base
              p-6
              shadow-shadow
              flex flex-col items-center
            `}
          >
            {/* Illustration container */}
            <div className='relative w-full max-w-[14rem] mx-auto flex items-end justify-center overflow-hidden'>
              <div className='absolute bottom-6 left-0 right-0 h-1 bg-border rounded-full' />
              <img
                src={src}
                alt={label}
                className='w-full max-w-[12rem] sm:max-w-[14rem] relative z-10 transition-transform duration-300'
              />
            </div>

            {/* Label */}
            <div className='mt-4 text-center'>
              <h3 className='text-lg sm:text-xl font-bold text-foreground'>
                {label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default How;
