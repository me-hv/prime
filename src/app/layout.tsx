import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { NavigationProvider } from "@/components/navigation/NavigationProvider";
import { Sidebar } from "@/components/navigation/Sidebar";
import { MobileNav } from "@/components/navigation/MobileNav";
import { GlobalQuickCaptureModal } from "@/components/navigation/GlobalQuickCaptureModal";
import { getProfile } from "@/actions/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PRIME — Personal Artist Operating System",
  description:
    "A personal creative development system for songwriters, rappers, music producers, and writers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let profile;
  try {
    profile = await getProfile();
  } catch {
    profile = {
      artistName: "HARRY / PRIME",
      currentFocus: "BUILD MY MUSIC CAREER",
    };
  }

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-prime-bg text-prime-text selection:bg-prime-gold/30 selection:text-prime-text">
        <ToastProvider>
          <NavigationProvider>
            <div className="min-h-screen flex flex-col md:flex-row">
              {/* Desktop Sidebar */}
              <Sidebar
                artistName={profile.artistName}
                currentFocus={profile.currentFocus}
              />

              {/* Mobile Navigation */}
              <MobileNav artistName={profile.artistName} />

              {/* Main App Content Viewport */}
              <main className="flex-1 md:pl-64 lg:pl-72 pb-20 md:pb-8 flex flex-col min-w-0 min-h-screen">
                <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                  {children}
                </div>
              </main>

              {/* Global Quick Capture Modal */}
              <GlobalQuickCaptureModal />
            </div>
          </NavigationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
