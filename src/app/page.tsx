"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calculator,
  BarChart3,
  Brain,
  Lightbulb,
  Rocket,
  UserPlus,
  LogIn,
  Code,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import previewImage from "@/media/preview.jpg";
export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Przekieruj zalogowanych użytkowników do panelu wyboru
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  const features = [
    {
      title: "Nauka matematyki",
      description:
        "Ucz się matematyki krok po kroku z pomocą sztucznej inteligencji",
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      color: "blue",
    },
    {
      title: "Rozwiązywanie zadań",
      description:
        "AI pomoże Ci rozwiązać zadanie matematyczne i wyjaśni każdy krok",
      icon: <Calculator className="h-10 w-10 text-purple-500" />,
      color: "purple",
    },
    {
      title: "Śledzenie postępów",
      description: "Monitoruj swoje postępy i analizuj wyniki nauki",
      icon: <BarChart3 className="h-10 w-10 text-green-500" />,
      color: "green",
    },
  ];

  const benefits = [
    {
      title: "Spersonalizowana nauka",
      description: "Dostosowane lekcje do Twoich potrzeb i tempa nauki",
      icon: <Brain className="h-6 w-6 text-blue-500" />,
    },
    {
      title: "Natychmiastowa pomoc",
      description: "Otrzymuj pomoc w rozwiązywaniu zadań w czasie rzeczywistym",
      icon: <Lightbulb className="h-6 w-6 text-amber-500" />,
    },
    {
      title: "Szybki postęp",
      description: "Osiągaj lepsze wyniki dzięki zaawansowanym metodom nauki",
      icon: <Rocket className="h-6 w-6 text-purple-500" />,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Wybierz temat",
      description:
        "Wybierz interesujący Cię dział matematyki lub konkretne zagadnienie",
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
    },
    {
      step: 2,
      title: "Zadaj pytanie",
      description:
        "Opisz problem, z którym się zmagasz lub poproś o wyjaśnienie tematu",
      icon: <Zap className="h-8 w-8 text-amber-500" />,
    },
    {
      step: 3,
      title: "Otrzymaj rozwiązanie",
      description:
        "AI wygeneruje szczegółowe rozwiązanie z wyjaśnieniem każdego kroku",
      icon: <Code className="h-8 w-8 text-blue-500" />,
    },
  ];

  return (
    <SignedOut>
      <div className="min-h-[calc(100vh-65px)] bg-gradient-to-b from-white to-blue-50">
        {/* Hero Section - Asymetryczny układ */}
        <section className="relative overflow-hidden pt-16 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50 z-0"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-sm mb-2">
                  Hackathon TechQuest 2025
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                  Ucz się matematyki{" "}
                  <span className="text-blue-600">szybciej i efektywniej</span>{" "}
                  z pomocą AI
                </h1>
                <p className="text-xl text-slate-600">
                  MathProdigy to innowacyjna platforma edukacyjna, która
                  wykorzystuje sztuczną inteligencję, aby pomóc Ci zrozumieć
                  matematykę i rozwiązywać zadania krok po kroku.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Link href="/sign-up">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Zarejestruj się za darmo
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/sign-in">
                      <LogIn className="mr-2 h-5 w-5" />
                      Zaloguj się
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-200 rounded-full opacity-20"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-200 rounded-full opacity-20"></div>
                <div className="relative rounded-xl overflow-hidden shadow-2xl transform rotate-1">
                  <Image
                    src={previewImage}
                    alt="MathProdigy w akcji"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/600x400/e2e8f0/475569?text=MathProdigy";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Karty z różnymi stylami */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500"></div>
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Co oferujemy?
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Nasza platforma łączy najnowsze technologie AI z najlepszymi
                praktykami edukacyjnymi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`shadow-lg border-t-4 border-t-${feature.color}-500 hover:shadow-xl transition-all transform hover:-translate-y-1`}
                >
                  <CardHeader className="rounded-t-lg">
                    <CardTitle className="flex items-center gap-4">
                      {feature.icon}
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <p className="text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Nowa sekcja z krokami */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Jak to działa?</h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Trzy proste kroki do lepszego zrozumienia matematyki
              </p>
            </div>

            <div className="relative">
              {/* Linia łącząca kroki */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-blue-500 hidden md:block"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {howItWorks.map((item, index) => (
                  <div key={index} className="relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 h-full flex flex-col items-center text-center">
                      <div className="bg-slate-800 rounded-full w-12 h-12 flex items-center justify-center mb-4 border-2 border-blue-500">
                        <span className="text-xl font-bold">{item.step}</span>
                      </div>
                      {item.icon}
                      <h3 className="text-xl font-bold mt-4 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-blue-100">{item.description}</p>

                      {index < howItWorks.length - 1 && (
                        <ArrowRight className="h-8 w-8 text-blue-400 mt-4 hidden md:block mx-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section - Asymetryczny układ */}
        <section className="py-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-200 rounded-full opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-200 rounded-full opacity-30"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-8 md:mb-0 md:pr-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  Dlaczego warto korzystać z MathProdigy?
                </h2>
                <p className="text-xl text-slate-600">
                  Nasza platforma została zaprojektowana, aby maksymalnie
                  ułatwić naukę matematyki i zapewnić Ci najlepsze doświadczenie
                  edukacyjne.
                </p>
                <div className="mt-8">
                  <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/sign-up">Rozpocznij naukę</Link>
                  </Button>
                </div>
              </div>

              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-slate-200"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Z gradientem i efektem */}
        <section className="py-16 pb-[210px] relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-10 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-6">
                Gotowy, aby rozpocząć swoją przygodę z matematyką?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Dołącz do MathProdigy już dziś i odkryj, jak łatwa może być
                nauka matematyki z pomocą sztucznej inteligencji.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Link href="/sign-up">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Rozpocznij za darmo
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-slate-800 -translate-y-[33%] rounded-2xl p-8 shadow-xl -mt-20 border border-slate-700 relative z-10">
              <div className="text-center">
                <h3 className="text-white text-xl font-semibold mb-6">
                  MathProdigy
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-blue-300 font-medium">Majcher Kacper</p>
                  </div>
                  <div className="text-center">
                    <p className="text-purple-300 font-medium">
                      Danicki Marcin
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-300 font-medium">
                      Kowalski Kacper
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-300 font-medium">Kiełt Mateusz</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-300 font-medium">Krzanowski Filip</p>
                  </div>
                </div>

                <div className="flex justify-center space-x-6 mb-6">
                  <Link
                    href="/learn"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    Nauka
                  </Link>
                  <Link
                    href="/solve"
                    className="text-white hover:text-purple-300 transition-colors"
                  >
                    Rozwiązywanie zadań
                  </Link>
                  <Link
                    href="/stats"
                    className="text-white hover:text-green-300 transition-colors"
                  >
                    Statystyki
                  </Link>
                </div>

                <div className="border-t border-slate-700 pt-6 mt-6">
                  <p className="text-slate-500 mt-2 flex items-center justify-center">
                    Made with <span className="text-red-500 mx-1">❤</span> for
                    TechQuest Leżajsk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SignedOut>
  );
}
