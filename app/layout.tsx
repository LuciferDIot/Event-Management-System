import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import { cn } from "@/lib/utils";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Event Sync",
  description: "Event Sync is a platform for event management.",
  icons: {
    icon: "/assets/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          poppins.variable,
          "flex flex-col justify-between w-full h-full min-h-screen"
        )}
      >
        <Header />
        {children}
        <Footer />
        <ToastContainer position="bottom-center" />
      </body>
    </html>
  );
}
