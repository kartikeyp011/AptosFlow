import type { Metadata } from "next";
import type { ReactNode } from "react";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  applicationName: "Smart-Pay Token Platform",
  title: "Smart-Pay - Advanced Token Payment Platform",
  description: "Mint, transfer, split, and manage token payments with real-world asset integration",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
