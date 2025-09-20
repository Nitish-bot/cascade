import Nav from '@/components/sections/Nav';
import Hero from '@/components/sections/Hero';
import Why from '@/components/sections/Why';
import How from '@/components/sections/How';
import FAQs from '@/components/sections/FAQs';
import Footer from '@/components/sections/Footer';

import { useMemo } from 'react';

import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

// import { connect } from 'solana-kite';

const DEVNET = 'https://api.devnet.solana.com/';
// const MAINNET = "https://api.mainnet-beta.solana.com/";

function Home() {
  const endpoint = DEVNET;
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
          <Nav />
          <Hero />
          <Why />
          <How />
          <FAQs />
          <Footer />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default Home;
