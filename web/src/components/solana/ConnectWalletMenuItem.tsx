import {
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import type { UiWallet, UiWalletAccount } from "@wallet-standard/react";
import { uiWalletAccountsAreSame, useConnect, useDisconnect } from "@wallet-standard/react";
import { useCallback, useContext } from "react";

import { SelectedWalletAccountContext } from "@/context/SelectedWalletAccountContext";
import { WalletMenuItemContent } from "@/components/solana/WalletMenuItemContent";

type Props = Readonly<{
  onAccountSelect(account: UiWalletAccount | undefined): void;
  onDisconnect(wallet: UiWallet): void;
  onError(error: unknown): void;
  wallet: UiWallet;
}>;

export function ConnectWalletMenuItem({ onAccountSelect, onDisconnect, onError, wallet }: Props) {
  const [isConnecting, connect] = useConnect(wallet);
  const [isDisconnecting, disconnect] = useDisconnect(wallet);
  const isPending = isConnecting || isDisconnecting;
  const isConnected = wallet.accounts.length > 0;
  const [selectedWalletAccount] = useContext(SelectedWalletAccountContext);
  const handleConnectClick = useCallback(async () => {
    try {
      const existingAccounts = [...wallet.accounts];
      const nextAccounts = await connect();
      // Try to choose the first never-before-seen account.
      for (const nextAccount of nextAccounts) {
        if (!existingAccounts.some((existingAccount) => uiWalletAccountsAreSame(nextAccount, existingAccount))) {
          onAccountSelect(nextAccount);
          return;
        }
      }
      // Failing that, choose the first account in the list.
      if (nextAccounts[0]) {
        onAccountSelect(nextAccounts[0]);
      }
    } catch (error) {
      onError(error);
    }
  }, [connect, onAccountSelect, onError, wallet.accounts]);
  return (
    <DropdownMenuSub open={!isConnected ? false : undefined}>
      <DropdownMenuSubTrigger
        disabled={isPending}
        onClick={!isConnected ? handleConnectClick : undefined}
      >
        <WalletMenuItemContent wallet={wallet} />
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DropdownMenuLabel>Accounts</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={selectedWalletAccount?.address}>
          {wallet.accounts.map((account) => (
            <DropdownMenuRadioItem
              key={account.address}
              value={account.address}
              onSelect={() => {
                onAccountSelect(account);
              }}
            >
              {account.address.slice(0, 8)}&hellip;
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async (event) => {
            event.preventDefault();
            await handleConnectClick();
          }}
        >
          Connect More
        </DropdownMenuItem>
        <DropdownMenuItem
          color="red"
          onSelect={async (event) => {
            event.preventDefault();
            try {
              await disconnect();
              onDisconnect(wallet);
            } catch (error) {
              onError(error);
            }
          }}
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}
