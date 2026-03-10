import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import hero from '@/assets/hero.svg';

const hero_para = `Leverage the Solana blockchain to raise funds for your causes, without intermediaries.`;

function Hero() {
  return (
    <main className='hero p-4 min-h-[100vh] w-full bg-grid'>
      <div className='text-left flex flex-col items-center w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
        {/* ── Headline + CTA row ── */}
        <div
          className='flex flex-col md:flex-row w-full justify-between items-center
                        mt-[10vh] pt-8 pb-4 md:py-16 gap-6 md:gap-4'
        >
          {/* Headline */}
          <h1
            className='text-[2.75rem] sm:text-[3.25rem] md:text-[3.5rem]
                         leading-tight font-extrabold text-center md:text-left'
          >
            R(A)ISE
            <br />
            <span className='relative inline-block text-border'>
              <span
                className='px-2 py-1 bg-main'
                style={{ position: 'relative', zIndex: 1 }}
              >
                TOGETHER
              </span>
            </span>
          </h1>

          {/* Description + CTA */}
          <div
            className='flex flex-col items-center md:items-end gap-4
                          w-full md:max-w-[32vw] lg:max-w-[24vw]
                          text-center md:text-right'
          >
            <p className='font-semibold text-sm sm:text-base leading-snug'>
              {hero_para}
            </p>
            <Link to='/raise'>
              <Button
                size='lg'
                className='text-base sm:text-lg font-bold px-4 cursor-pointer w-full sm:w-auto'
              >
                <span className='mt-1'>Create a fundraiser</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* ── Hero illustration ── */}
        <div className='flex justify-center mt-6 md:mt-[6vh] xl:mt-[2vh]'>
          <img
            src={hero}
            alt='Cascade hero illustration'
            className='w-[85vw] sm:w-[70vw] md:w-[64vw] lg:w-[48vw] xl:w-[36vw]'
          />
        </div>
      </div>
    </main>
  );
}

export default Hero;
