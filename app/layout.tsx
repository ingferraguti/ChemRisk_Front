import "./globals.css";
import type { Metadata } from "next";
import { QueryProvider } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "ChemRisk",
  description: "ChemRisk MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
