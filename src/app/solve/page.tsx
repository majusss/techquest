"use client";
import { useChat } from "ai/react";
import "katex/dist/katex.min.css";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

interface ChatHistory {
  id: string;
  category: string;
  messages: any[];
  createdAt: string;
}

export default function SolvePage() {
  const [history, setHistory] = useState<ChatHistory[]>([]);
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    body: {
      category: "solve",
    },
    onFinish: async (message) => {
      // Zapisz historię po zakończeniu konwersacji
      await fetch("/api/chat/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "solve",
          messages: [...messages, message],
        }),
      });
    },
  });

  useEffect(() => {
    // Pobierz historię przy ładowaniu strony
    fetch("/api/chat/history?category=solve")
      .then((res) => res.json())
      .then(setHistory)
      .catch(console.error);
  }, []);

  const loadHistory = async (historyId: string) => {
    const selectedHistory = history.find((h) => h.id === historyId);
    if (selectedHistory) {
      // Wyczyść obecne wiadomości i załaduj wybraną historię
      selectedHistory.messages.forEach((msg) => {
        append({
          role: msg.role,
          content: msg.content,
        });
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rozwiąż zadanie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Opisz zadanie, które chcesz rozwiązać, a AI pomoże Ci je
                rozwiązać krok po kroku.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {history.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => loadHistory(item.id)}
                  >
                    {new Date(item.createdAt).toLocaleString()}
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
              <p className="text-sm text-muted-foreground mb-2">
                Aby otrzymać najlepszą pomoc:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Opisz zadanie jak najdokładniej</li>
                <li>Podaj wszystkie dane, które masz</li>
                <li>Zaznacz, jeśli potrzebujesz szczegółowych wyjaśnień</li>
                <li>Możesz prosić o dodatkowe przykłady</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {messages.length === 0 ? (
            <div className="p-8 text-center rounded-lg border bg-card">
              <div className="text-4xl mb-4">✏️</div>
              <h2 className="text-2xl font-bold mb-2">Rozwiąż zadanie z AI</h2>
              <p className="text-muted-foreground mb-4">
                Opisz zadanie, które chcesz rozwiązać, a AI pomoże Ci je
                rozwiązać krok po kroku.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>AI pomoże Ci:</p>
                <ul className="list-none list-inside mt-2">
                  <li>Przeanalizować zadanie</li>
                  <li>Wskazać odpowiednie wzory</li>
                  <li>Rozwiązać je krok po kroku</li>
                  <li>Wyjaśnić każdy etap rozwiązania</li>
                </ul>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}

          <div className="p-4">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              placeholder="Opisz zadanie, które chcesz rozwiązać..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
