"use client";

import { useEffect, useState } from "react";
// next
import Link from "next/link";
// hooks
import { useProgram } from "@/app/hooks/useProgram";
import { useWallet } from "@solana/wallet-adapter-react";
// utils
import { shortenAddress } from "@/lib/utils/shortenAddress";
// components
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/Tabs";
import { ArrowUp, Loader2 } from "lucide-react";

interface IAccount {
  authority: string;
  confession: string;
}
interface IConfession {
  publicKey: string;
  account: IAccount;
}

const AllConfessions = () => {
  const { allConfessions, userConfessions, isLoading } = useProgram();
  const { publicKey } = useWallet();

  const [displayedAllConfessions, setDisplayedAllConfessions] =
    useState(allConfessions);
  const [displayedUserConfessions, setDisplayedUserConfessions] =
    useState(userConfessions);

  useEffect(() => {
    setDisplayedAllConfessions(allConfessions);
  }, [allConfessions]);

  useEffect(() => {
    setDisplayedUserConfessions(userConfessions);
  }, [userConfessions]);

  return (
    <div className="rounded-lg p-8 overflow-scroll flex flex-col gap-4 border border-border bg-muted/30 w-full h-[22rem] xl:h-[30rem] text-primary">
      {!publicKey ? (
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <ArrowUp className="w-8 h-8 animate-bounce" />
          <p className="text-xl">
            Please sign in first using your Phantom wallet
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex w-full h-full items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="flex justify-start py-6 text-primary">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="own">Own</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <div className="flex flex-col gap-4 py-4">
              {displayedAllConfessions.length > 0 ? (
                <>
                  <span className="text-sm self-end">
                    Found {displayedAllConfessions.length} confession/s
                  </span>
                  {displayedAllConfessions.map(
                    (con: IConfession, i: number) => {
                      const { publicKey, account } = con;
                      const { authority, confession } = account;
                      const strAuthority = authority.toString();
                      const strPublicKey = publicKey.toString();

                      return (
                        <div
                          key={`${strAuthority}-${confession}-${i}`}
                          className="w-full border border-border p-4 rounded-lg"
                        >
                          <div className="flex flex-col gap-8 justify-between">
                            <p className="text-xl">{confession}</p>

                            <div className="flex gap-4 self-end">
                              <Link
                                href={`https://explorer.solana.com/address/${strAuthority}?cluster=devnet`}
                                className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                              >
                                by: {shortenAddress(strAuthority)}
                              </Link>
                              <div className="w-[1px] bg-border"></div>
                              <Link
                                href={`https://explorer.solana.com/address/${strPublicKey}?cluster=devnet`}
                                className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                              >
                                pub: {shortenAddress(strPublicKey)}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <p className="text-xl">No confessions yet. Be the first.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="own">
            <div className="flex flex-col gap-4 py-4">
              {displayedUserConfessions.length > 0 ? (
                <>
                  <span className="text-sm self-end">
                    Found {displayedUserConfessions.length} confession/s
                  </span>
                  {displayedUserConfessions.map(
                    (con: IConfession, i: number) => {
                      const { publicKey, account } = con;
                      const { authority, confession } = account;
                      const strAuthority = authority.toString();
                      const strPublicKey = publicKey.toString();

                      return (
                        <div
                          key={`${strAuthority}-${confession}-${i}`}
                          className="w-full border border-border p-4 rounded-lg"
                        >
                          <div className="flex flex-col gap-8 justify-between">
                            <p className="text-xl">{confession}</p>

                            <div className="flex gap-4 self-end">
                              <Link
                                href={`https://explorer.solana.com/address/${strAuthority}?cluster=devnet`}
                                className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                              >
                                by: {shortenAddress(strAuthority)}
                              </Link>
                              <div className="w-[1px] bg-border"></div>
                              <Link
                                href={`https://explorer.solana.com/address/${strPublicKey}?cluster=devnet`}
                                className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                              >
                                pub: {shortenAddress(strPublicKey)}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </>
              ) : (
                <div className="flex w-full items-center justify-center">
                  <p className="text-xl">
                    No confessions yet. Write your first.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AllConfessions;
