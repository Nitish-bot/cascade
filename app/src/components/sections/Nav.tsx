import { Link } from 'react-router-dom';
import logo from '@/assets/logo-black.svg';
import hamburger from '@/assets/hamburger.svg';
// import wallet from '@/assets/wallet.svg';

import { useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Nav() {
  const [hover, setHover] = useState(false);

  return (
    <header
      className='absolute z-50 top-[2%] inset-x-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-main 
          rounded-[1rem] border-2 p-4 items-center min-w-lg md:min-w-2xl lg:min-w-3xl xl:min-w-5xl mx-auto'
    >
      <div>
        <Link to='/'>
          <img src={logo} alt='Logo' className='md:h-7 h-6' />
        </Link>
      </div>

      <nav className='hidden md:block space-x-4 tracking-wide'>
        <Link to='/donate' className='p-2 relative group'>
          {/* <img src={donate} alt="Donate" className="inline h-5 mr-1 mb-1" /> */}
          Donate
          <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-main-foreground transition-all duration-300 group-hover:w-full'></span>
        </Link>
        <Link to='/raise' className='p-2 relative group'>
          Raise
          <span className='absolute bottom-0 right-0 w-0 h-0.5 bg-main-foreground transition-all duration-300 group-hover:w-full'></span>
        </Link>
      </nav>

      {/* All this tomfoolery is to give the button a hover effect */}
      <div className='hidden md:inline font-black button-holder'
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <WalletMultiButton
         style={{
            backgroundColor: hover ? 'var(--background)' : 'var(--main)',
            border: '2px solid var(--border)',
            borderRadius: '10px',
            padding: '1rem 1rem 0.85rem 1rem',
            fontFamily: 'inherit',
            fontWeight: 500,
            lineHeight: '.25rem',
            height: 'auto',
            color: 'var(--border)',
            transition: 'all 0.3s ease'
        }}
        >
          {/* <img src={wallet} alt='Wallet' className='inline h-5 mr-1' />
          <span className='mt-1'>Connect Wallet</span> */}
        </WalletMultiButton>
      </div>

      <div className='md:hidden block border-2 rounded-md p-1'>
        <img src={hamburger} alt='Menu' className='h-4' />
      </div>
    </header>
  );
}

export default Nav;
