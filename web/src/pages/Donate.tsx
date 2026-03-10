import Footer from '@/components/sections/Footer';
import Nav from '@/components/sections/Nav';
import Search from '@/pages/donate/Search';
import Results from '@/pages/donate/Results';
import { useContext, useState } from 'react';
import type { Fundraiser } from '@/lib/types';
import { ChainContext } from '@/context/ChainContext';
import { SelectedWalletAccountContext } from '@/context/SelectedWalletAccountContext';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { connect } from 'solana-kite';

function DonateContent() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);

  const { chain, solanaExplorerClusterName } = useContext(ChainContext);
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
  const connection = connect(solanaExplorerClusterName);

  // Only create signer if wallet is connected
  const signer = selectedWalletAccount
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useWalletAccountTransactionSendingSigner(selectedWalletAccount, chain)
    : null;

  return (
    <>
      <Nav />
      <Search />
      <Results
        fundraisers={fundraisers}
        setFundraisers={setFundraisers}
        connection={connection}
        donor={signer}
      />
      <Footer />
    </>
  );
}

function Donate() {
  return <DonateContent />;
}

export default Donate;
