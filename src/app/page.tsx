"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/chat/Header";

export default function Home() {
  const pathname = usePathname();

  const navigation = [
    {
      name: "Nauka",
      href: "/learn",
      description: "Ucz się matematyki krok po kroku",
      icon: "📚",
    },
    {
      name: "Rozwiąż zadanie",
      href: "/solve",
      description: "AI pomoże Ci rozwiązać zadanie krok po kroku",
      icon: "✏️",
    },
    {
      name: "Statystyki",
      href: "/stats",
      description: "Śledź swój postęp w nauce",
      icon: "👤",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <Header />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "p-6 rounded-xl border transition-all hover:shadow-lg hover:scale-105",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card hover:bg-accent"
                )}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
                <p className="text-sm opacity-80">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
