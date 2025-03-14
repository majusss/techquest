"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { getMathResponse } from "../actions/actions";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<
    Array<{ question: string; answer: string }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    try {
      const result = await getMathResponse(question);

      if (result.success) {
        setHistory([...history, { question, answer: result.answer }]);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Przepraszamy, wystąpił błąd. Spróbuj ponownie później.");
    } finally {
      setIsLoading(false);
      setQuestion("");
    }
  };

  const exampleTopics = [
    "Algebra",
    "Geometria",
    "Trygonometria",
    "Rachunek różniczkowy",
    "Statystyka",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <main className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold">MateMaster AI</CardTitle>
            <CardDescription>
              Twój osobisty asystent do nauki matematyki
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Panel główny */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Wpisz swoje pytanie matematyczne..."
                    className="min-h-[128px]"
                    disabled={isLoading}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Przetwarzanie..." : "Zapytaj MateMaster AI"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Historia pytań */}
            <div className="space-y-4">
              {history.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">Pytanie:</CardTitle>
                    <CardDescription>{item.question}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="font-medium">Odpowiedź:</div>
                    <div className="mt-2 whitespace-pre-wrap text-muted-foreground">
                      {item.answer}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Panel boczny */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Popularne tematy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exampleTopics.map((topic, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() =>
                        setQuestion(
                          `Wytłumacz mi podstawy ${topic.toLowerCase()}`
                        )
                      }
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wskazówki</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Zadawaj konkretne pytania</li>
                  <li>Możesz używać symboli matematycznych</li>
                  <li>Dołącz kontekst do swojego pytania</li>
                  <li>Pytaj o wyjaśnienie krok po kroku</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
