"use client";

import { PROGRAM_PUBKEY } from "@/lib/constants";
import profileIdl from "@/lib/idl";
import { getFilteredAuthor } from "@/lib/utils/getFilteredAuthor";
import * as anchor from "@project-serum/anchor";
import { utf8 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import {
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { SystemProgram } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

export const useProgram = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const anchorWallet = useAnchorWallet();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [userConfessions, setUserConfessions] = useState<
    anchor.ProgramAccount[]
  >([]);
  const [allConfessions, setAllConfessions] = useState<anchor.ProgramAccount[]>(
    []
  );
  const [lastConfession, setLastConfession] = useState<number>(0);

  const program = useMemo(() => {
    if (anchorWallet) {
      const provider = new anchor.AnchorProvider(
        connection,
        anchorWallet,
        anchor.AnchorProvider.defaultOptions()
      );
      return new anchor.Program(profileIdl as any, PROGRAM_PUBKEY, provider);
    }
  }, [connection, anchorWallet]);

  useEffect(() => {
    const findProfileAccounts = async () => {
      if (isInitialized && program && publicKey && !isTransactionPending) {
        try {
          setIsLoading(true);
          const [profilePda, _profileBump] = await findProgramAddressSync(
            [utf8.encode("USER_STATE"), publicKey.toBuffer()],
            program.programId
          );
          const profileAccount: any = await program.account.userProfile.fetch(
            profilePda
          );

          if (profileAccount) {
            setLastConfession(profileAccount.lastConfession);
            setIsInitialized(true);

            const confessionAccount: anchor.ProgramAccount[] =
              await program.account.confessionAccount.all([
                getFilteredAuthor(publicKey.toString()),
              ]);
            setUserConfessions(confessionAccount);
          } else {
            setIsInitialized(false);
          }
        } catch (error) {
          console.error(error);
          setIsInitialized(false);
          setUserConfessions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    const getAllConfessions = async () => {
      // console.log("program", program);
      // console.log("publicKey", publicKey);
      // console.log("isTransactionPending", isTransactionPending);
      // console.log(
      //   "should go through",
      //   program && publicKey && !isTransactionPending
      // );
      if (program && publicKey && !isTransactionPending) {
        try {
          // console.log(
          //   "ASDHAIOSHFOIAHFIOAHSIOFHAISFHAOISHFIOAHFIOHAFHAI",
          //   await program.account
          // );
          setIsLoading(true);
          const confessions = await program.account.confessionAccount.all([]);

          setAllConfessions(confessions);
        } catch (error) {
          console.log(error);
          setIsInitialized(false);
          setAllConfessions([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    findProfileAccounts();
    getAllConfessions();
  }, [publicKey, program, isTransactionPending, isInitialized]);

  const resetStates = () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(false);
    setIsTransactionPending(false);
  };

  const initializeUser = async () => {
    resetStates();
    if (program && publicKey) {
      try {
        const isAlreadyInitialized = await program.account.userProfile.all([
          getFilteredAuthor(publicKey.toString()),
        ]);

        console.log("isAlreadyInitialized", isAlreadyInitialized);

        setIsTransactionPending(true);
        const [profilePda, profileBump] = findProgramAddressSync(
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

        console.log("tx", tx);
        setIsInitialized(true);
      } catch (error: any) {
        console.error(error);
        setErrorMessage(error);
      } finally {
        setIsTransactionPending(false);
      }
    }
  };

  const addConfession = async (confession: string) => {
    resetStates();
    if (program && publicKey) {
      if (!confession) {
        setErrorMessage("Please enter a confession.");
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

        await program.methods
          .addConfession(confession)
          .accounts({
            userProfile: profilePda,
            confessionAccount: confessionPda,
            authority: publicKey,
            systemProgram: SystemProgram.programId,
          })
          .rpc();
        setSuccessMessage("Successfully added a confession.");
      } catch (error: any) {
        console.log(error);
        setErrorMessage(error);
      } finally {
        setIsTransactionPending(false);
      }
    }
  };

  return {
    errorMessage,
    successMessage,
    isTransactionPending,
    isLoading,
    isInitialized,
    allConfessions,
    userConfessions,

    addConfession,
    initializeUser,
    program,
  };
};
