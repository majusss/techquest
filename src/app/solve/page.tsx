"use client";
import { useChat } from "@ai-sdk/react";
import "katex/dist/katex.min.css";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Calculator,
  MessageSquare,
  Lightbulb,
  History,
} from "lucide-react";
import {
  appendMessage,
  getChats,
  deleteChat,
  createChat,
  deleteAllChats,
} from "@/app/actions/solve";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [pendingAIMessage, setPendingAIMessage] = useState<{
    role: string;
    content: string;
  } | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    append,
    setMessages,
    setInput,
    status,
  } = useChat({
    body: {
      category: "solve",
    },
    onFinish: async (message) => {
      try {
        if (currentChat) {
          const data = await appendMessage(
            {
              role: "assistant" as const,
              content: message.content,
            },
            currentChat.id
          );
          setCurrentChat(data);
          refreshChats();
        } else {
          // Jeśli nie ma aktualnego czatu, zapisz wiadomość do późniejszego dodania
          setPendingAIMessage({
            role: "assistant",
            content: message.content,
          });
        }
      } catch (error) {
        console.error("Error saving chat:", error);
      }
    },
  });

  // Efekt do obsługi oczekującej wiadomości AI
  useEffect(() => {
    const handlePendingMessage = async () => {
      if (pendingAIMessage && currentChat) {
        try {
          const data = await appendMessage(
            {
              role: pendingAIMessage.role as "assistant",
              content: pendingAIMessage.content,
            },
            currentChat.id
          );
          setCurrentChat(data);
          setPendingAIMessage(null);
          refreshChats();
        } catch (error) {
          console.error("Error saving pending AI message:", error);
        }
      }
    };

    handlePendingMessage();
  }, [currentChat, pendingAIMessage]);

  const refreshChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (error) {
      console.error("Error refreshing chats:", error);
    }
  };

  useEffect(() => {
    const loadChats = async () => {
      try {
        setIsHistoryLoading(true);
        const data = await getChats();
        setChats(data);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setIsHistoryLoading(false);
        setIsLoading(false);
      }
    };
    loadChats();
  }, []);

  const loadChat = async (chatId: string) => {
    const selectedChat = chats.find((h) => h.id === chatId);
    if (selectedChat) {
      setCurrentChat(selectedChat);
      setMessages(selectedChat.messages);
    }
  };

  const clearChats = async () => {
    try {
      setIsLoading(true);
      await deleteAllChats();
      setCurrentChat(null);
      setMessages([]);
      setPendingAIMessage(null);
      await refreshChats();
    } catch (error) {
      console.error("Błąd podczas czyszczenia chatu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSingleChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      await deleteChat(chatId);
      if (currentChat?.id === chatId) {
        setCurrentChat(null);
        setMessages([]);
        setPendingAIMessage(null);
      }
      await refreshChats();
    } catch (error) {
      console.error("Błąd podczas usuwania chatu:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    // Tylko resetujemy interfejs, nie tworzymy nowego czatu w bazie
    setCurrentChat(null);
    setMessages([]);
    setPendingAIMessage(null);
  };

  const handleSubmitWithHistory = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = { role: "user" as const, content: input.trim() };

      // Dodaj wiadomość do interfejsu
      append({
        role: "user",
        content: input.trim(),
      });

      try {
        // Jeśli nie ma aktualnego czatu, utwórz nowy
        if (!currentChat) {
          const newChat = await createChat();
          const data = await appendMessage(userMessage, newChat.id);
          setCurrentChat(data);
        } else {
          // Dodaj wiadomość do istniejącego czatu
          const data = await appendMessage(userMessage, currentChat.id);
          setCurrentChat(data);
        }
        await refreshChats();
      } catch (error) {
        console.error("Error saving user message:", error);
      }
      setInput("");
    }
  };

  const hasMessages = messages.length > 0;
  const isGenerating = status === "streaming";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-full">
          <div className="sticky space-y-6 top-3">
            <Card className="shadow-md border-t-4 border-t-purple-500">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-purple-500" />
                  Rozwiąż zadanie
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-slate-600 mb-4">
                  Opisz zadanie, które chcesz rozwiązać, a AI pomoże Ci je
                  rozwiązać krok po kroku.
                </p>
                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={startNewChat}
                  disabled={isLoading || isGenerating}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nowe zadanie
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md border-t-4 border-t-amber-500">
              <CardHeader className="rounded-t-lg flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-500" />
                  Historia zadań
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearChats}
                  disabled={isLoading || chats.length === 0}
                  title="Usuń wszystkie czaty"
                  className="hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {isHistoryLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-200 border-t-amber-600"></div>
                  </div>
                ) : chats.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 bg-amber-50 rounded-md">
                    <div className="text-4xl mb-2">📝</div>
                    Brak historii zadań
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-[40vh]">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        className="flex items-center gap-2 group"
                      >
                        <Button
                          variant={
                            currentChat?.id === chat.id ? "default" : "outline"
                          }
                          onClick={() => loadChat(chat.id)}
                          className={`flex-1 overflow-hidden justify-start text-ellipsis whitespace-nowrap transition-all duration-200 ${
                            currentChat?.id === chat.id
                              ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500"
                              : "group-hover:border-amber-200"
                          }`}
                        >
                          {chat.messages?.[0]?.content?.substring(0, 30) ||
                            "Nowy czat"}
                          {chat.messages?.[0]?.content?.length > 30
                            ? "..."
                            : ""}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => deleteSingleChat(chat.id, e)}
                          disabled={isLoading}
                          className="hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-md min-h-[70vh] flex flex-col">
            <CardHeader className="rounded-t-lg gap-0 border-b">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                {currentChat ? "Rozwiązywanie zadania" : "Nowe zadanie"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-0">
              {hasMessages ? (
                <div className="flex-grow overflow-y-auto p-4">
                  <MessageList messages={messages} />
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-6 bg-purple-50 text-purple-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                      ✏️
                    </div>
                    <h2 className="text-2xl font-bold mb-3">
                      Rozwiąż zadanie z AI
                    </h2>
                    <p className="text-slate-500 mb-6">
                      Opisz zadanie, które chcesz rozwiązać, a AI pomoże Ci je
                      rozwiązać krok po kroku.
                    </p>
                    <div className="text-sm text-slate-600 bg-purple-50 p-4 rounded-lg mb-6">
                      <p className="font-medium mb-2">AI pomoże Ci:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        <li className="flex items-center gap-1">
                          <span className="bg-purple-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Przeanalizować zadanie</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-purple-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Wskazać odpowiednie wzory</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-purple-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Rozwiązać je krok po kroku</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-purple-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Wyjaśnić każdy etap</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 pb-0 pt-6 border-t">
                <ChatInput
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmitWithHistory}
                  placeholder="Opisz zadanie, które chcesz rozwiązać..."
                  disabled={isLoading || isGenerating}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
