import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { plPL } from "@clerk/localizations";
import { BookOpen, Calculator, BarChart3, Home } from "lucide-react";
// import Image from "next/image";
// import logo from "@/media/logo.svg";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MathProdigy",
  description: "MathProdigy - Twój nauczyciel matematyki",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={plPL}>
      <html lang="pl">
        <body className={`${inter.className} antialiased`}>
          {/* Navbar */}
          <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                {/* Logo i nazwa */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white p-1.5 rounded-md">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  {/* <Image height={32} src={logo} alt="Logo" /> */}
                  <span className="max-sm:hidden font-bold text-xl text-slate-900">
                    MathProdigy
                  </span>
                </Link>

                {/* Nawigacja dla zalogowanych */}
                <SignedIn>
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6">
                    <Link
                      href="/dashboard"
                      className="flex items-center text-slate-700 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Panel główny
                    </Link>
                    <Link
                      href="/learn"
                      className="flex items-center text-slate-700 hover:text-blue-600 transition-colors font-medium"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Nauka
                    </Link>
                    <Link
                      href="/solve"
                      className="flex items-center text-slate-700 hover:text-purple-600 transition-colors font-medium"
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Rozwiąż zadanie
                    </Link>
                    <Link
                      href="/stats"
                      className="flex items-center text-slate-700 hover:text-green-600 transition-colors font-medium"
                    >
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Statystyki
                    </Link>
                  </div>
                </SignedIn>

                {/* Przyciski logowania/rejestracji lub profil */}
                <div className="flex items-center space-x-4">
                  <SignedOut>
                    <div className="hidden sm:flex items-center space-x-3">
                      <Button variant="outline" asChild size="sm">
                        <SignInButton>Zaloguj się</SignInButton>
                      </Button>
                      <Button asChild size="sm">
                        <SignUpButton>Zarejestruj się</SignUpButton>
                      </Button>
                    </div>
                    <div className="sm:hidden">
                      <Button variant="outline" asChild size="icon">
                        <SignInButton>
                          <span className="sr-only">Zaloguj się</span>
                        </SignInButton>
                      </Button>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="md:hidden flex items-center space-x-3">
                      <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                          <Home className="h-5 w-5" />
                          <span className="sr-only">Panel główny</span>
                        </Button>
                      </Link>
                      <Link href="/learn">
                        <Button variant="ghost" size="icon">
                          <BookOpen className="h-5 w-5" />
                          <span className="sr-only">Nauka</span>
                        </Button>
                      </Link>
                      <Link href="/solve">
                        <Button variant="ghost" size="icon">
                          <Calculator className="h-5 w-5" />
                          <span className="sr-only">Rozwiąż zadanie</span>
                        </Button>
                      </Link>
                      <Link href="/stats">
                        <Button variant="ghost" size="icon">
                          <BarChart3 className="h-5 w-5" />
                          <span className="sr-only">Statystyki</span>
                        </Button>
                      </Link>
                    </div>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9",
                        },
                      }}
                    />
                  </SignedIn>
                </div>
              </div>
            </div>
          </nav>

          {/* Główna zawartość */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
