import { Link } from 'react-router-dom';
import logo from '@/assets/logo-black.svg';
import hamburger from '@/assets/hamburger.svg';
import wallet from '@/assets/wallet.svg';
import { ConnectWalletMenu } from '@/components/solana/ConnectWalletMenu';

function Nav() {
  return (
    <header
      className='fixed z-50 top-[2%] mx-auto left-8 right-8
        md:left-16 md:right-16 lg:left-32 lg:right-32
        2xl:left-64 2xl:right-64
        flex justify-between items-center bg-main 
        rounded-[1rem] border-2 p-4'
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
      <div
        className='hidden md:inline font-black button-holder'
      >
        <ConnectWalletMenu>
          <img src={wallet} alt='Wallet' className='inline h-5 mr-1' />
          <p className='mt-1'>Connect Wallet</p>
        </ConnectWalletMenu>
      </div>

      <div className='md:hidden block border-2 rounded-md p-1'>
        <img src={hamburger} alt='Menu' className='h-4' />
      </div>
    </header>
  );
}

export default Nav;
