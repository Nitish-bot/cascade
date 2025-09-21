import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import { useMemo } from 'react';

const DEVNET = 'https://api.devnet.solana.com/';

function WalletAdapter({ children }: { children: React.ReactNode }) {
    const endpoint = DEVNET;
    const wallets = useMemo(() => [], []);
    
    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

export default WalletAdapter;