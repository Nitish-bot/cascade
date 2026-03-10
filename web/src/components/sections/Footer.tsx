import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo-black.svg';
import github from '@/assets/github.svg';
import x from '@/assets/x.svg';

function Footer() {
  return (
    <footer className='bg-main border-t-4 border-border'>
      <div className='relative z-10 px-4 sm:px-8 pt-12 sm:pt-16 pb-4 w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-5xl mx-auto'>
        {/* ── Top columns ── */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 sm:mb-12'>
          {/* Brand column */}
          <div className='flex flex-col gap-6 sm:col-span-2 lg:col-span-1'>
            <img src={logo} alt='Cascade Logo' className='h-7 sm:h-8 w-auto' />
            <p className='text-foreground text-base sm:text-lg leading-snug tracking-wide font-semibold max-w-xs'>
              Transparent and secure funding for all.
            </p>
            <div className='flex gap-3'>
              <a
                href='https://github.com/Nitish-bot/cascade'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button size='icon'>
                  <img
                    src={github}
                    alt='GitHub'
                    className='h-5 w-5 sm:h-6 sm:w-6'
                  />
                </Button>
              </a>
              <a
                href='https://x.com/nitish_boht'
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button size='icon'>
                  <img src={x} alt='X' className='h-5 w-5 sm:h-6 sm:w-6' />
                </Button>
              </a>
            </div>
          </div>

          {/* Legal column */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg sm:text-xl font-bold text-foreground'>
              Legal Schmeagal
            </h4>
            <nav className='flex flex-col gap-3'>
              <Link
                to='/raise'
                className='text-foreground hover:text-background transition-colors duration-200 text-base sm:text-lg font-semibold relative group w-fit'
              >
                Privacy Policy
                <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full' />
              </Link>
              <Link
                to='/about'
                className='text-foreground hover:text-background transition-colors duration-200 text-base sm:text-lg font-semibold relative group w-fit'
              >
                Terms of Service
                <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full' />
              </Link>
            </nav>
          </div>

          {/* Navigation column */}
          <div className='flex flex-col gap-4'>
            <h4 className='text-lg sm:text-xl font-bold text-foreground'>
              Navigation
            </h4>
            <nav className='flex flex-col gap-3'>
              {[
                { label: 'Home', to: '/' },
                { label: 'How it works', to: '/donate' },
                { label: 'Features', to: '/raise' },
                { label: 'FAQs', to: '/about' },
              ].map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className='text-foreground hover:text-background transition-colors duration-200 text-base sm:text-lg font-semibold relative group w-fit'
                >
                  {label}
                  <span className='absolute left-0 bottom-0 w-0 h-0.5 bg-background transition-all duration-300 group-hover:w-full' />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className='border-t border-border/30 pt-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 text-foreground text-sm sm:text-base font-semibold text-center'>
          <span>
            © {new Date().getFullYear()} Cascade. All rights reserved
          </span>
          <span className='hidden sm:inline text-border/40'>•</span>
          <span>Made with ❤️ in India.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
