// components
import { ConnectWallet } from "@/app/components/ConnectWallet";
// import { Particles } from "@/app/components/Particles";
// assets
import Logo from "public/assets/logo-with-text.svg";
// custom components
import AddConfession from "./AddConfession";
import AllConfessions from "./AllConfessions";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full h-full flex-col overflow-hidden">
      {/* <Particles /> */}

      <div className="w-full h-full p-8 flex flex-col items-center justify-center">
        <Logo className="w-32 h-32" />
        <ConnectWallet />

        <div className="mt-8 w-full md:w-[60%] flex flex-col gap-4 items-center justify-center">
          <AddConfession />
          <AllConfessions />
        </div>
      </div>
    </div>
  );
}
