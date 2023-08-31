"use client";

import { Button } from "@/app/components/Button";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ClientOnly } from "remix-utils";

export const ConnectWallet = () => {
  const style = {
    background: "transparent",
    borderRadius: "8px",
    border: "1px solid #f5f5f5",
    fontSize: "0.75rem",
    padding: "12px",
    height: 40,
  };

  return (
    <ClientOnly
      fallback={
        <Button variant="outline" disabled>
          Loading...
        </Button>
      }
    >
      {() => <WalletMultiButton style={style} />}
    </ClientOnly>
  );
};
