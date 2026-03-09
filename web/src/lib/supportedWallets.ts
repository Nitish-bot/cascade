import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';
import type { UiWallet } from '@wallet-standard/react';

export default function getSupportedWallets(
  wallets: readonly UiWallet[],
  chain: `solana:${string}` = 'solana:devnet',
) {
  const supported: UiWallet[] = [];

  for (const wallet of wallets) {
    if (
      wallet.features.includes(StandardConnect) &&
      wallet.features.includes(StandardDisconnect) &&
      wallet.chains.includes(chain)
    ) {
      supported.push(wallet);
    }
  }

  return supported;
}
