import { Button } from "@/app/components/Button";
import { ConnectWallet } from "@/app/components/ConnectWallet";
import { Particles } from "@/app/components/Particles";
import Logo from "public/assets/logo-with-text.svg";
import AllConfessions from "./AllConfessions";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full h-full flex-col overflow-hidden">
      <Particles />

      <div className="w-full h-full p-8 flex flex-col items-center justify-center">
        <Logo className="w-32 h-32" />
        <ConnectWallet />

        <div className="mt-8 w-full md:w-[60%] flex flex-col gap-4 items-center justify-center">
          <Button className="self-end">Confess.</Button>
          <AllConfessions />
        </div>
      </div>
    </main>
  );
}
