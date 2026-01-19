import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UiWallet } from "@wallet-standard/react";
import React from "react";

type Props = Readonly<{
  children?: React.ReactNode;
  wallet: UiWallet;
}>;

export function WalletMenuItemContent({ children, wallet }: Props) {
  return (
    <div className="flex align-center gap-2" >
      <Avatar
        style={{ height: 18, width: 18 }}
      >
        <AvatarImage
          src={wallet.icon}
          alt={wallet.name}
        />
        <AvatarFallback>
          <p>
            {wallet.name.slice(0, 1)}
          </p>
        </AvatarFallback>
      </Avatar>
      <p>{children ?? wallet.name}</p>
    </div>
  );
}
