// app/layout.tsx
"use client";

import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import SmoothScroll from "@/components/SmoothScroll/page";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // যেসব পেজে ফুটার দেখাবে না
  const noFooterRoutes = ["/student", "/admin", "/teacher"];
  const isDashboard = noFooterRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  return (
    <html lang="bn" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <SmoothScroll>
                <main className="grow">{children}</main>
              </SmoothScroll>
              {!isDashboard && <Footer />}
              <Toaster position="top-right" richColors />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
