import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '@/assets/logo-black.svg';
import wallet from '@/assets/wallet.svg';
import { ConnectWalletMenu } from '@/components/solana/ConnectWalletMenu';
import { Menu, X } from 'lucide-react';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header
      className='fixed z-50 top-[2%] mx-auto left-4 right-4
        sm:left-8 sm:right-8
        md:left-16 md:right-16
        lg:left-32 lg:right-32
        2xl:left-64 2xl:right-64'
    >
      {/* ── Main bar ── */}
      <div className='flex justify-between items-center bg-main rounded-[1rem] border-2 p-4'>
        {/* Logo */}
        <div>
          <Link to='/' onClick={closeMenu}>
            <img src={logo} alt='Cascade logo' className='h-6 md:h-7' />
          </Link>
        </div>

        {/* Desktop nav links */}
        <nav className='hidden md:flex items-center space-x-4 tracking-wide'>
          <Link to='/donate' className='p-2 relative group'>
            Donate
            <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-main-foreground transition-all duration-300 group-hover:w-full' />
          </Link>
          <Link to='/raise' className='p-2 relative group'>
            Raise
            <span className='absolute bottom-0 right-0 w-0 h-0.5 bg-main-foreground transition-all duration-300 group-hover:w-full' />
          </Link>
        </nav>

        {/* Desktop wallet button */}
        <div className='hidden md:inline font-black button-holder'>
          <ConnectWalletMenu>
            <img src={wallet} alt='Wallet' className='inline h-5 mr-1' />
            <p className='mt-1'>Connect Wallet</p>
          </ConnectWalletMenu>
        </div>

        {/* Mobile hamburger / close button */}
        <button
          className='md:hidden flex items-center justify-center border-2 rounded-md p-1 cursor-pointer'
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label='Toggle navigation menu'
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? (
            <X className='h-4 w-4' />
          ) : (
            <Menu className='h-4 w-4' />
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {isMenuOpen && (
        <div
          className='md:hidden mt-2 bg-main rounded-[1rem] border-2 px-6 py-4
            flex flex-col gap-1
            animate-in fade-in slide-in-from-top-2 duration-200'
        >
          <nav className='flex flex-col tracking-wide divide-y divide-border/20'>
            <Link
              to='/donate'
              className='py-3 px-2 font-semibold text-center hover:opacity-70 transition-opacity'
              onClick={closeMenu}
            >
              Donate
            </Link>
            <Link
              to='/raise'
              className='py-3 px-2 font-semibold text-center hover:opacity-70 transition-opacity'
              onClick={closeMenu}
            >
              Raise
            </Link>
          </nav>

          <div className='mt-3 flex justify-center font-black button-holder'>
            <ConnectWalletMenu>
              <img src={wallet} alt='Wallet' className='inline h-5 mr-1' />
              <p className='mt-1'>Connect Wallet</p>
            </ConnectWalletMenu>
          </div>
        </div>
      )}
    </header>
  );
}

export default Nav;
