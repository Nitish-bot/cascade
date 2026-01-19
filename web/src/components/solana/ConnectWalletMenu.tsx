import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { StandardConnect, StandardDisconnect } from "@wallet-standard/core";
import type { UiWallet } from "@wallet-standard/react";
import { uiWalletAccountBelongsToUiWallet, useWallets } from "@wallet-standard/react";
import { useContext, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { SelectedWalletAccountContext } from "@/context/SelectedWalletAccountContext";
import { ConnectWalletMenuItem } from "@/components/solana/ConnectWalletMenuItem";
import { ErrorDialog } from "@/components/solana/ErrorDialog";
import { WalletAccountIcon } from "@/components/solana/WalletAccountIcon";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function ConnectWalletMenu({ children }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const wallets = useWallets();
  const [selectedWalletAccount, setSelectedWalletAccount] = useContext(SelectedWalletAccountContext);
  const [error, setError] = useState(NO_ERROR);
  const [forceClose, setForceClose] = useState(false);
  function renderItem(wallet: UiWallet) {
    return (
      <ConnectWalletMenuItem
        onAccountSelect={(account) => {
          setSelectedWalletAccount(account);
          setForceClose(true);
        }}
        onDisconnect={(wallet) => {
          if (selectedWalletAccount && uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)) {
            setSelectedWalletAccount(undefined);
          }
        }}
        onError={setError}
        wallet={wallet}
        key={wallet.name}
      />
    );
  }
  const supportedWallets = [];
  for (const wallet of wallets) {
    if (wallet.features.includes(StandardConnect) 
      && wallet.features.includes(StandardDisconnect)
      && wallet.chains.includes('solana:devnet')) {
      supportedWallets.push(wallet);
    }
  }
  return (
    <div className="relative">
      <DropdownMenu open={forceClose ? false : undefined} onOpenChange={setForceClose.bind(null, false)}>
        <DropdownMenuTrigger asChild>
          <Button
            size='sm'
            variant='noShadow'
            className='hover:bg-[var(--main-dark)]'
          >
            {selectedWalletAccount ? (
              <>
                <WalletAccountIcon account={selectedWalletAccount} width="18" height="18" />
                {selectedWalletAccount.address.slice(0, 8)}
              </>
            ) : (
              children
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {supportedWallets.length === 0 ? (
            <Alert color="orange">
              <ExclamationTriangleIcon />
              <AlertTitle>No Wallets Found</AlertTitle>
              <AlertDescription>This browser has no wallets installed that support solana devnet.</AlertDescription>
            </Alert>
          ) : (
            <>
              {supportedWallets.map(renderItem)}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error !== NO_ERROR ? <ErrorDialog error={error} onClose={() => setError(NO_ERROR)} /> : null}
    </div>
  );
}
