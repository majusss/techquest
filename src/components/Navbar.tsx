"use client";

import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { BookOpen, Calculator, BarChart3, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getTextColor = (path: string) => {
    if (!isActive(path)) return "text-slate-700 hover:text-slate-900";

    switch (path) {
      case "/dashboard":
        return "text-indigo-600";
      case "/learn":
        return "text-blue-600";
      case "/solve":
        return "text-purple-600";
      case "/stats":
        return "text-green-600";
      default:
        return "text-slate-700";
    }
  };

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="max-sm:hidden font-bold text-xl text-slate-900">
              MathProdigy
            </span>
          </Link>

          <SignedIn>
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-6">
              <Link
                href="/dashboard"
                className={`flex items-center transition-colors font-medium ${getTextColor("/dashboard")}`}
              >
                <Home className="mr-2 h-4 w-4" />
                Panel główny
              </Link>
              <Link
                href="/learn"
                className={`flex items-center transition-colors font-medium ${getTextColor("/learn")}`}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Nauka
              </Link>
              <Link
                href="/solve"
                className={`flex items-center transition-colors font-medium ${getTextColor("/solve")}`}
              >
                <Calculator className="mr-2 h-4 w-4" />
                Rozwiąż zadanie
              </Link>
              <Link
                href="/stats"
                className={`flex items-center transition-colors font-medium ${getTextColor("/stats")}`}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Statystyki
              </Link>
            </div>
          </SignedIn>

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
                <Button variant="outline" asChild>
                  <SignInButton>
                    <span className="sr-only">Zaloguj się</span>
                  </SignInButton>
                </Button>
              </div>
            </SignedOut>
            <SignedIn>
              <div className="md:hidden flex items-center space-x-3">
                <Link href="/dashboard">
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    size="icon"
                    className={isActive("/dashboard") ? "bg-indigo-600" : ""}
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Panel główny</span>
                  </Button>
                </Link>
                <Link href="/learn">
                  <Button
                    variant={isActive("/learn") ? "default" : "ghost"}
                    size="icon"
                    className={isActive("/learn") ? "bg-blue-600" : ""}
                  >
                    <BookOpen className="h-5 w-5" />
                    <span className="sr-only">Nauka</span>
                  </Button>
                </Link>
                <Link href="/solve">
                  <Button
                    variant={isActive("/solve") ? "default" : "ghost"}
                    size="icon"
                    className={isActive("/solve") ? "bg-purple-600" : ""}
                  >
                    <Calculator className="h-5 w-5" />
                    <span className="sr-only">Rozwiąż zadanie</span>
                  </Button>
                </Link>
                <Link href="/stats">
                  <Button
                    variant={isActive("/stats") ? "default" : "ghost"}
                    size="icon"
                    className={isActive("/stats") ? "bg-green-600" : ""}
                  >
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
  );
}
