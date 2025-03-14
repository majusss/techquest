"use client";

import { useChat } from "@ai-sdk/react";
import "katex/dist/katex.min.css";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { appendMessage, getChat, deleteChat } from "@/app/actions/chat";

interface ChatHistory {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "system" | "data" | "assistant";
  createdAt: Date;
  updatedAt: Date;
  chatId: string;
}

const topics = [
  "Algebra",
  "Geometria",
  "Trygonometria",
  "Funkcje",
  "Równania",
  "Nierówności",
  "Statystyka",
  "Prawdopodobieństwo",
  "Logika",
  "Zbiory",
];

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const { messages, input, handleInputChange, append, setMessages, status } =
    useChat({
      body: {
        category: selectedTopic,
      },
      onFinish: async (message) => {
        if (selectedTopic) {
          try {
            const data = await appendMessage(selectedTopic, {
              role: "assistant" as const,
              content: message.content,
            });
            setCurrentChat(data);
          } catch (error) {
            console.error("Error saving chat:", error);
          }
        }
      },
    });

  useEffect(() => {
    if (selectedTopic) {
      setIsHistoryLoading(true);
      getChat(selectedTopic)
        .then((data) => {
          if (data) {
            setCurrentChat(data);
            setMessages(data.messages);
          } else {
            setCurrentChat(null);
            setMessages([]);
          }
        })
        .catch(console.error)
        .finally(() => setIsHistoryLoading(false));
    } else {
      setCurrentChat(null);
      setMessages([]);
    }
  }, [selectedTopic, setMessages]);

  const clearChat = async () => {
    if (selectedTopic && currentChat) {
      try {
        setIsLoading(true);
        await deleteChat(currentChat.id);
        setCurrentChat(null);
        setMessages([]);
      } catch (error) {
        console.error("Błąd podczas czyszczenia chatu:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartLearning = () => {
    if (selectedTopic) {
      const userMessage = `Chcę nauczyć się ${selectedTopic}. Proszę o wyjaśnienie krok po kroku z przykładami.`;
      append({
        role: "user",
        content: userMessage,
      });
    }
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setMessages([]);
  };

  const handleSubmitWithHistory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (input.trim() && selectedTopic) {
      const userMessage = { role: "user" as const, content: input.trim() };
      append({
        role: "user",
        content: input.trim(),
      });
      appendMessage(selectedTopic, userMessage);
    }
  };

  const hasMessages = messages.length > 0;
  const isGenerating = status === "streaming";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wybierz temat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {topics.map((topic) => (
                  <Button
                    key={topic}
                    variant={selectedTopic === topic ? "default" : "outline"}
                    onClick={() => handleTopicSelect(topic)}
                    disabled={isGenerating || isHistoryLoading}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
              {selectedTopic &&
                !hasMessages &&
                !isGenerating &&
                !isHistoryLoading && (
                  <Button className="w-full mt-4" onClick={handleStartLearning}>
                    Rozpocznij naukę
                  </Button>
                )}
            </CardContent>
          </Card>

          {selectedTopic && currentChat && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Chat - {selectedTopic}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  disabled={isLoading || isGenerating || isHistoryLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Ostatnia aktywność: {currentChat.createdAt.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Wskazówki</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Aby efektywnie się uczyć:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                <li>Zadawaj pytania gdy coś nie jest jasne</li>
                <li>Proś o dodatkowe przykłady</li>
                <li>Rozwiązuj zadania praktyczne</li>
                <li>Powtarzaj materiał regularnie</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          {isHistoryLoading ? (
            <div className="p-8 text-center rounded-lg border bg-card">
              <div className="text-4xl mb-4">⌛</div>
              <h2 className="text-2xl font-bold mb-2">Ładowanie historii...</h2>
              <p className="text-muted-foreground">
                Proszę czekać, ładujemy Twoją poprzednią rozmowę.
              </p>
            </div>
          ) : !hasMessages ? (
            <div className="p-8 text-center rounded-lg border bg-card">
              <div className="text-4xl mb-4">📚</div>
              <h2 className="text-2xl font-bold mb-2">
                {selectedTopic
                  ? `Nauka - ${selectedTopic}`
                  : "Rozpocznij naukę"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {selectedTopic
                  ? "Kliknij 'Rozpocznij naukę' aby rozpocząć..."
                  : "Wybierz temat z listy po lewej stronie, aby rozpocząć naukę."}
              </p>
              <div className="text-sm text-muted-foreground">
                <p>AI pomoże Ci:</p>
                <ul className="list-none list-inside mt-2">
                  <li>Zrozumieć koncepcje</li>
                  <li>Rozwiązywać zadania</li>
                  <li>Przećwiczyć materiał</li>
                  <li>Sprawdzić wiedzę</li>
                </ul>
              </div>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}

          {selectedTopic && hasMessages && !isHistoryLoading && (
            <div className="p-4">
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmitWithHistory}
                placeholder="Zadaj pytanie lub poproś o wyjaśnienie..."
                disabled={isLoading || isGenerating}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
