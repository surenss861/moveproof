import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { GSAPScrollProvider } from "@/components/GSAPScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MoveProof — Deposit defense for renters",
  description:
    "Tamper-evident Evidence Packs for security deposit disputes across the US & Canada. Ontario module live.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-slate-900 text-slate-100 font-sans app-safe">
        <AuthProvider>
          <GSAPScrollProvider>{children}</GSAPScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
