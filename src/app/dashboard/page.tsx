"use client";
import { Card } from "@/components/ui/card";
import { BookOpen, Calculator, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { isSignedIn, isLoaded, user } = useUser();
  const router = useRouter();

  // Przekieruj niezalogowanych użytkowników na stronę główną
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  const options = [
    {
      title: "Nauka",
      description:
        "Ucz się matematyki krok po kroku z pomocą sztucznej inteligencji",
      icon: <BookOpen className="h-16 w-16 text-blue-500" />,
      href: "/learn",
      color: "blue",
    },
    {
      title: "Rozwiąż zadanie",
      description:
        "AI pomoże Ci rozwiązać zadanie matematyczne i wyjaśni każdy krok",
      icon: <Calculator className="h-16 w-16 text-purple-500" />,
      href: "/solve",
      color: "purple",
    },
    {
      title: "Statystyki",
      description: "Monitoruj swoje postępy i analizuj wyniki nauki",
      icon: <BarChart3 className="h-16 w-16 text-green-500" />,
      href: "/stats",
      color: "green",
    },
  ];

  if (!isLoaded || !isSignedIn) {
    return null; // Nie renderuj nic podczas ładowania lub jeśli użytkownik nie jest zalogowany
  }

  return (
    <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-white to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Witaj, {user?.firstName || "Użytkowniku"}!
            </h1>
            <p className="text-xl text-slate-600">Co chcesz dzisiaj zrobić?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {options.map((option) => (
              <Link
                key={option.title}
                href={option.href}
                className="block h-full"
              >
                <Card
                  className={`h-full flex flex-col items-center text-center p-8 shadow-lg border-t-4 border-t-${option.color}-500 hover:shadow-xl transition-all transform hover:-translate-y-2 cursor-pointer`}
                >
                  <div className="mb-6">{option.icon}</div>
                  <h2 className="text-2xl font-bold mb-4">{option.title}</h2>
                  <p className="text-slate-600">{option.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
