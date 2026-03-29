import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll/page";

export const metadata: Metadata = {
  title: "Madrasa Website",
  description: "Islamic Education Center",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {" "}
          {/* সবার উপরে AuthProvider দিন */}
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />

              <SmoothScroll>
                <main className="grow">{children}</main>
              </SmoothScroll>
              <Footer />
              <Toaster position="top-right" richColors />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
