import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo-black.svg';
import hamburger from '@/assets/hamburger.svg';
import wallet from '@/assets/wallet.svg';

function Nav() {
    return (
      <header className="absolute z-50 top-[2%] inset-x-0 left-1/2 -translate-x-1/2 flex justify-between items-center bg-main 
          rounded-[1rem] border-2 p-4 items-center min-w-lg md:min-w-2xl lg:min-w-3xl xl:min-w-5xl mx-auto">
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" className="md:h-7 h-6" />
          </Link>
        </div>

        <nav className="hidden md:block space-x-4">
          <Link to="/donate" className="font-semibold hover:bg-yellow-500 p-2">
            {/* <img src={donate} alt="Donate" className="inline h-5 mr-1 mb-1" /> */}
            Donate
          </Link>
          <Link to="/raise" className="font-semibold p-2">
            Raise
          </Link>
        </nav>

        <div className="hidden md:inline pb-1 font-black">
          <Link to="/login">
            <Button size="sm">
              <img src={wallet} alt="Wallet" className="inline h-5 mr-1" />
              Connect Wallet
            </Button>
          </Link>
        </div>

        <div className="md:hidden block border-2 rounded-md p-1">
          <img src={hamburger} alt="Menu" className="h-4" />
        </div>
      </header>
    )
}

export default Nav