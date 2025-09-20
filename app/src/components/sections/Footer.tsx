import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo-black.svg';
import github from '@/assets/github.svg';
import x from '@/assets/x.svg';

function Footer() {
  return (
    <footer className='bg-main border-t-4 border-border overflow-hidden'>
      <div className='relative z-10 max-w-6xl mx-auto px-8 pt-16 pb-4'>
        <div className='flex flex-wrap gap-6 mb-12 justify-between'>
          <div className='flex flex-col justify-between max-w-[600px] lg:max-w-[700px] text-left p-6'>
            <div className='mb-6'>
              <img src={logo} alt='Cascade Logo' className='h-8 mb-6' />
              <p className='text-foreground text-lg leading-snug tracking-wide font-semibold'>
                Transparent and secure funding for all.
              </p>
            </div>
            <div className='flex gap-4 mt-4'>
              <Button size='icon'>
                <img src={github} alt='GitHub' className='h-6 w-6' />
              </Button>
              <Button size='icon'>
                <img src={x} alt='X' className='h-6 w-6' />
              </Button>
            </div>
          </div>

          <div className='flex md:flex-wrap gap-6'>
            <div className='flex-none w-full text-left p-6'>
              <h4 className='text-xl font-bold text-foreground mb-6'>
                Legal Schmeagal
              </h4>
              <nav className='space-y-3'>
                <Link
                  to='/raise'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  Privacy Policy
                </Link>
                <Link
                  to='/about'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  Terms of Service
                </Link>
                <Link
                  to='/how-it-works'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                </Link>
              </nav>
            </div>
          </div>

          <div className='flex md:flex-wrap gap-6'>
            <div className='flex-none w-full text-left p-6'>
              <h4 className='text-xl font-bold text-foreground mb-6'>
                Navigation
              </h4>
              <nav className='space-y-3'>
                <Link
                  to='/how-it-works'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  Home
                </Link>
                <Link
                  to='/donate'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  How it works
                </Link>
                <Link
                  to='/raise'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  Features
                </Link>
                <Link
                  to='/about'
                  className='block text-foreground hover:text-background transition-colors duration-200 text-lg font-semibold relative group'
                >
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full'></span>
                  FAQs
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom section - also a grid-like element */}
        <div className='p-3'>
          <div className='flex flex-col justify-center items-center gap-4 text-foreground text-lg font-semibold px-4 py-1'>
            <span>© 2024 Cascade. All rights reserved</span>
            <span>Made with ❤️ in India.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
