"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  ConnectionProviderProps,
  WalletProvider,
  WalletProviderProps,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { ReactNode, useMemo } from "react";

export const WalletConnectProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Devnet)
      return process.env.NEXT_PUBLIC_RPC_HTTPS;

    clusterApiUrl(network);
  }, [network]) as unknown as ConnectionProviderProps["endpoint"];

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    []
  ) as unknown as WalletProviderProps["wallets"];

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
