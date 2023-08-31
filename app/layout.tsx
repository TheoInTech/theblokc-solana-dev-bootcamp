import { Toaster } from "@/app/components/Toast";
import "@solana/wallet-adapter-react-ui/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./Footer";
import "./globals.css";
import { WalletConnectProvider } from "./providers/WalletConnectProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Solana Confessions",
    template: "%s | Solana Confessions",
  },
  description: "Certification project for The BLOKC Solana Developer Bootcamp",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/assets/logo.svg",
    apple: "/assets/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectProvider>
          <main className="flex flex-col justify-center items-center">
            {children}
            <Footer />
          </main>
          <Toaster />
        </WalletConnectProvider>
      </body>
    </html>
  );
}
