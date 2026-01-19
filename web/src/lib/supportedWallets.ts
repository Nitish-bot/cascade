import { StandardConnect, StandardDisconnect } from "@wallet-standard/core";
import type { UiWallet } from "@wallet-standard/react";

export default function supportedWallets(wallets: UiWallet[]) {
  const supportedWallets = [];
  const chain = process.env.CHAIN || "solana:devnet";

  for (const wallet of wallets) {
    if (wallet.features.includes(StandardConnect)
      && wallet.features.includes(StandardDisconnect)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      && wallet.chains.includes(chain as any)) {
      supportedWallets.push(wallet);
    }
  }

  return supportedWallets;
}