import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DeveloperProvider } from "@/hooks/useDeveloper";
import DevToggle from "@/components/UI/DevToggle";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Naman Kanwar | AI & Full-Stack Developer",
  description:
    "Portfolio of Naman Kanwar — AI Systems, Data Science, Cybersecurity, and Full-Stack Engineering. NSUT Dwarka, Class of 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-[#030712] text-gray-100 antialiased`}
        suppressHydrationWarning
      >
        <DeveloperProvider>
          {children}
          <DevToggle />
        </DeveloperProvider>
      </body>
    </html>
  );
}
