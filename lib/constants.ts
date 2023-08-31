import idl from "@/lib/idl";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

/* Constants for RPC Connection the Solana Blockchain */
export const commitmentLevel = "processed";
export const endpoint =
  process.env.NEXT_PUBLIC_ALCHEMY_HTTPS || clusterApiUrl("devnet");
export const connection = new Connection(endpoint, commitmentLevel);

/* Constants for the Deployed "Solana Confessions" Program */
export const PROGRAM_PUBKEY = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!
);
export const PROGRAM_INTERFACE = JSON.parse(JSON.stringify(idl));
