import { PublicKey } from "@solana/web3.js";

export const PROGRAM_PUBKEY = new PublicKey(
  process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID!
);
