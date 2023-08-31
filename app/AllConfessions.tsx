"use client";

// next
import Link from "next/link";
// hooks
import { useProgram } from "@/app/hooks/useProgram";
// utils
import { shortenAddress } from "@/lib/utils/shortenAddress";

const dummyConfessions = [
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession: "I love my wife",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession:
      "I love my wife. This is a pretty long confession. I know i know. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession: "I love my wife",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession:
      "I love my wife. This is a pretty long confession. I know i know. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession: "I love my wife",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession:
      "I love my wife. This is a pretty long confession. I know i know. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession: "I love my wife",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession:
      "I love my wife. This is a pretty long confession. I know i know. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession: "I love my wife",
  },
  {
    author: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    tx: "AqtqBLXk4NGppf5qBWgC6PSLrqEqdB2ECzWh4hVJ2qQN",
    confession:
      "I love my wife. This is a pretty long confession. I know i know. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
];

const AllConfessions = () => {
  const { isLoading, program, isInitialized, allConfessions, userConfessions } =
    useProgram();

  return (
    <div className="rounded-lg p-8 overflow-scroll flex flex-col items-center justify-center gap-4 bg-muted/30 w-full h-[22rem] text-primary backdrop-blur-sm">
      {allConfessions.length > 0 ? (
        <>
          {/* Change to actual all confessions */}
          {dummyConfessions.map(({ confession, author, tx }, i) => (
            <div
              key={`${author}-${confession}-${i}`}
              className="w-full border border-border p-4 rounded-lg"
            >
              <div className="flex flex-col gap-8 justify-between">
                <p className="text-xl">{confession}</p>

                <div className="flex gap-4 self-end">
                  <Link
                    href={`https://explorer.solana.com/address/${author}?cluster=devnet`}
                    className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                  >
                    by: {shortenAddress(author)}
                  </Link>
                  <div className="w-[1px] bg-border"></div>
                  <Link
                    href={`https://explorer.solana.com/address/${tx}?cluster=devnet`}
                    className="text-sm text-purple-400 hover:underline hover:underline-offset-4"
                  >
                    tx: {shortenAddress(tx)}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex w-full items-center justify-center">
          <p className="text-xl">No confessions yet. Be the first.</p>
        </div>
      )}
    </div>
  );
};

export default AllConfessions;
