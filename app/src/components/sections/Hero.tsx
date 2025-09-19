import hero from '@/assets/hero.svg';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

const hero_para = `
Leverage the solana blockchain technology to raise funds 
for your causes, without intermediaries.
`;

function Hero() {
  return (
    <main className='hero p-4 min-h-[100vh] w-full bg-grid'>
      <div className='text-left flex flex-col items-center w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
        <div className='flex w-full justify-between items-center mx-4 mt-[8vh] py-16'>
          <h1 className='text-[2.75rem] md:text-[3.5rem] leading-tight font-extrabold'>
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
          <div className='flex flex-col items-end gap-4 max-w-[32vw] lg:max-w-[24vw] text-right'>
            <p className='font-semibold'>{hero_para}</p>
            <Link to="/raise" className='flex items-center'>
              <Button size={'lg'} className='text-lg font-bold px-4 cursor-pointer'>
                <span className='mt-1'>Create a fundraiser</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className='flex justify-center mt-[6vh] xl:mt-[2vh]'>
          <img src={hero} className='w-[64vw] lg:w-[48vw] xl:w-[36vw]'></img>
        </div>
      </div>
    </main>
  );
}

export default Hero;
