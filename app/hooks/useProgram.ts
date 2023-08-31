"use client";

import { useToast } from "@/app/components/Toast/useToast";
import {
  PROGRAM_INTERFACE,
  PROGRAM_PUBKEY,
  commitmentLevel,
} from "@/lib/constants";
import { SolanaConfessions } from "@/lib/types/solana-confessions.types";
import { getFilteredAuthor } from "@/lib/utils/getFilteredAuthor";
import { AnchorProvider, Program, ProgramAccount } from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import {
  AnchorWallet,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useEffect, useState } from "react";

export const useProgram: any = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet() as AnchorWallet;
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [userConfessions, setUserConfessions] = useState<ProgramAccount[]>([]);
  const [allConfessions, setAllConfessions] = useState<ProgramAccount[]>([]);
  const [lastConfession, setLastConfession] = useState<number>(0);

  const provider = new AnchorProvider(connection, anchorWallet, {
    preflightCommitment: commitmentLevel,
  });

  const program = new Program(
    PROGRAM_INTERFACE,
    PROGRAM_PUBKEY,
    provider
  ) as Program<SolanaConfessions>;

  const getAllConfessions = async () => {
    try {
      setIsLoading(true);
      const confessions: any = await program!.account.confessionAccount.all();

      setAllConfessions(confessions);
    } catch (error) {
      console.error(error);

      toast({
        variant: "destructive",
        title: "Error",
        description:
          "There's an error getting all confessions. Please try to refresh the page.",
      });

      setAllConfessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const findProfileAccounts = async () => {
    try {
      setIsLoading(true);
      const [profilePda, _profileBump] = await findProgramAddressSync(
        [utf8.encode("USER_STATE"), publicKey!.toBuffer()],
        program!.programId
      );

      const profileAccount: any = await program!.account.userProfile.fetch(
        profilePda
      );

      if (profileAccount) {
        toast({
          variant: "default",
          title: "You are already signed in, you may now confess...",
        });
        setLastConfession(profileAccount.lastConfession);
        setIsInitialized(true);

        const confessionAccount: any =
          await program!.account.confessionAccount.all([
            getFilteredAuthor(publicKey!.toString()),
          ]);

        setUserConfessions(confessionAccount);
      }
    } catch (error) {
      console.error(error);
      setUserConfessions([]);

      if (!isInitialized) await initializeUser();
    } finally {
      setIsLoading(false);
    }
  };

  const initializeUser = async () => {
    if (program && publicKey && !isInitialized) {
      try {
        setIsTransactionPending(true);
        const [profilePda, _profileBump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );

        const tx = await program.methods
          .initializeUser()
          .accounts({
            userProfile: profilePda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        setIsInitialized(true);
      } catch (error: any) {
        console.error("initializeUser error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            error?.message ??
            "There's an error signing in. Please try to refresh the page.",
        });
      } finally {
        setIsTransactionPending(false);
      }
    }
  };

  const addConfession = async (confession: string) => {
    setIsTransactionPending(false);
    if (program && publicKey) {
      if (!confession) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please enter a confession.",
        });
        return;
      }

      try {
        setIsTransactionPending(true);
        const [profilePda, _profileBump] = findProgramAddressSync(
          [utf8.encode("USER_STATE"), publicKey.toBuffer()],
          program.programId
        );
        const [confessionPda, _confessionBump] = findProgramAddressSync(
          [
            utf8.encode("CONFESSION_STATE"),
            publicKey.toBuffer(),
            Uint8Array.from([lastConfession]),
          ],
          program.programId
        );

        const tx = await program.methods
          .addConfession(confession)
          .accounts({
            userProfile: profilePda,
            confessionAccount: confessionPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();

        toast({
          variant: "default",
          title:
            "Your confession is now forever in the blockchain, anonymously.",
        });
        setIsTransactionPending(false);

        await getAllConfessions();
        await findProfileAccounts();

        return { success: tx };
      } catch (error: any) {
        console.error(error);
        toast({
          variant: "destructive",
          title:
            "There's an error saving your confession. Please try to refresh the page.",
        });
        setIsTransactionPending(false);

        return { error };
      }
    }
  };

  useEffect(() => {
    if (!isInitialized && program && publicKey && !isTransactionPending) {
      findProfileAccounts();
      getAllConfessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey, program, isTransactionPending]);

  return {
    isTransactionPending,
    isLoading,
    isInitialized,
    allConfessions,
    userConfessions,

    addConfession,
    initializeUser,
    getAllConfessions,
    findProfileAccounts,
    program,
  };
};
