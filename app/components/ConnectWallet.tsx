"use client";

import { Button } from "@/app/components/Button";
import { useProgram } from "@/app/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect } from "react";
import { ClientOnly } from "remix-utils";

export const ConnectWallet = () => {
  const { connected } = useWallet();
  const { initializeUser, isInitialized } = useProgram();

  const style = {
    background: "transparent",
    borderRadius: "8px",
    border: "1px solid #f5f5f5",
    fontSize: "0.75rem",
    padding: "12px",
    height: 40,
  };

  useEffect(() => {
    if (connected && !isInitialized) initializeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

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
