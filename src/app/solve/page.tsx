"use client";
import { useChat } from "ai/react";
import "katex/dist/katex.min.css";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { appendMessage, getChats, deleteChat } from "@/app/actions/solve";

interface SolveChat {
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
  chatId: string | null;
  solveChatId: string | null;
}

export default function SolvePage() {
  const [chats, setChats] = useState<SolveChat[]>([]);
  const [currentChat, setCurrentChat] = useState<SolveChat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { messages, input, handleInputChange, append, setMessages } = useChat({
    body: {
      category: "solve",
    },
    onFinish: async (message) => {
      try {
        const data = await appendMessage({
          role: "assistant" as const,
          content: message.content,
        });
        setCurrentChat(data);
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    },
  });

  useEffect(() => {
    getChats().then(setChats).catch(console.error);
  }, []);

  const loadChat = async (chatId: string) => {
    const selectedChat = chats.find((h) => h.id === chatId);
    if (selectedChat) {
      setCurrentChat(selectedChat);
      setMessages(selectedChat.messages);
    }
  };

  const clearChat = async () => {
    if (currentChat) {
      try {
        setIsLoading(true);
        await deleteChat(currentChat.id);
        setCurrentChat(null);
        setMessages([]);
        setChats(chats.filter((chat) => chat.id !== currentChat.id));
      } catch (error) {
        console.error("Błąd podczas czyszczenia chatu:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitWithHistory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: "user" as const, content: input.trim() };
      append({
        role: "user",
        content: input.trim(),
      });
      appendMessage(userMessage);
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Historia</CardTitle>
              {currentChat && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChat}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant={
                      currentChat?.id === chat.id ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => loadChat(chat.id)}
                  >
                    {new Date(chat.createdAt).toLocaleString()}
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
              handleSubmit={handleSubmitWithHistory}
              placeholder="Opisz zadanie, które chcesz rozwiązać..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
