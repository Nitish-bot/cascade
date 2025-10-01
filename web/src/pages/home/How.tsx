import full from '@/assets/full.svg';
import half from '@/assets/half.svg';
import empty from '@/assets/empty.svg';
import Star9 from '@/components/assets/star-9';

function How() {
  return (
    <div className='flex flex-col gap-24 py-8 justify-between items-between w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto relative'>
      <div className='flex justify-between items-center relative z-10'>
        <Star9 className='h-16' />
        <h1 className='text-left text-4xl md:text-6xl font-extrabold text-border'>
          How it works
        </h1>
      </div>

      <div className='flex xl:flex-row flex-col gap-8 lg:gap-16 justify-center lg:mb-24 relative z-10 pb-4 pr-4'>
        <div className='self-start flex-1 bg-secondary-background border-2 border-border rounded-base p-6 shadow-shadow self-center'>
          <div className='relative w-64 xl:w-56 flex items-end justify-center overflow-hidden'>
            <div className='absolute bottom-6 left-0 right-0 h-1 bg-border rounded-full'></div>
            <img
              src={empty}
              className='w-48 lg:w-64 relative z-10 group-hover:scale-105 transition-transform duration-300'
            />
          </div>
          <div className='mt-4 text-center'>
            <h3 className='text-xl font-bold text-foreground mb-2'>
              Introduce your cause
            </h3>
          </div>
        </div>

        <div className='self-end flex-1 bg-secondary-background border-2 border-border rounded-base p-6 shadow-shadow self-center'>
          <div className='relative w-64 xl:w-56 flex items-end justify-center overflow-hidden'>
            <div className='absolute bottom-6 left-0 right-0 h-1 bg-border rounded-full'></div>
            <img
              src={half}
              className='w-48 lg:w-64 relative z-10 group-hover:scale-105 transition-transform duration-300'
            />
          </div>
          <div className='mt-4 text-center'>
            <h3 className='text-xl font-bold text-foreground mb-2'>
              Write your story
            </h3>
          </div>
        </div>

        <div className='self-start flex-1 bg-secondary-background border-2 border-border rounded-base p-6 shadow-shadow self-center'>
          <div className='relative w-64 xl:w-56 flex items-end justify-center overflow-hidden'>
            <div className='absolute bottom-6 left-0 right-0 h-1 bg-border rounded-full'></div>
            <img
              src={full}
              className='w-48 lg:w-64 relative z-10 group-hover:scale-105 transition-transform duration-300'
            />
          </div>
          <div className='mt-4 text-center'>
            <h3 className='text-xl font-bold text-foreground mb-2'>
              Tell it to the world
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default How;
