"use client";

import { getLearned, markLearned } from "../actions/stats";
import { appendMessage, getChat, deleteChat } from "@/app/actions/chat";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { topicsData } from "@/const/lessons";
import { useChat } from "@ai-sdk/react";
import "katex/dist/katex.min.css";
import { Trash2, BookOpen, MessageSquare } from "lucide-react";
import React, { useEffect, useState } from "react";

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

export default function LearnPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [currentChat, setCurrentChat] = useState<ChatHistory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isLearned, setIsLearned] = useState(false);

  const handleLearnedChange = async ({
    subcategory,
    learned,
  }: {
    subcategory: string | null;
    learned: boolean;
  }) => {
    if (!subcategory) return;
    setIsLearned(learned);
    const ckecked = await markLearned(subcategory, learned);
    setIsLearned(ckecked);
  };

  const {
    messages,
    input,
    handleInputChange,
    append,
    setMessages,
    status,
    setInput,
  } = useChat({
    body: {
      category:
        selectedTopic && selectedSubtopic
          ? `${selectedTopic} - ${selectedSubtopic}`
          : selectedTopic,
    },
    onFinish: async (message) => {
      const currentTopic =
        selectedTopic && selectedSubtopic
          ? `${selectedTopic} - ${selectedSubtopic}`
          : selectedTopic;

      if (currentTopic) {
        try {
          const data = await appendMessage(currentTopic, {
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
    const currentTopic =
      selectedTopic && selectedSubtopic
        ? `${selectedTopic} - ${selectedSubtopic}`
        : selectedTopic;

    if (currentTopic) {
      setIsHistoryLoading(true);
      getChat(currentTopic)
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
  }, [selectedTopic, selectedSubtopic, setMessages]);

  const clearChat = async () => {
    if (currentChat) {
      try {
        setIsLoading(true);
        await deleteChat(currentChat.id);
        setIsLearned(false);
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
    const currentTopic =
      selectedTopic && selectedSubtopic
        ? `${selectedTopic} - ${selectedSubtopic}`
        : selectedTopic;

    if (currentTopic) {
      const userMessage = `Chcę nauczyć się ${currentTopic}. Proszę o wyjaśnienie krok po kroku z przykładami.`;
      append({
        role: "user",
        content: userMessage,
      });
    }
  };

  const handleTopicAndSubtopicSelect = (
    topic: string,
    subtopic: string | null,
  ) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(subtopic);
    if (subtopic) {
      getLearned(subtopic).then((learned) => setIsLearned(learned ?? false));
    }

    setMessages([]);
  };

  const handleSubmitWithHistory = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const currentTopic =
      selectedTopic && selectedSubtopic
        ? `${selectedTopic} - ${selectedSubtopic}`
        : selectedTopic;

    if (input.trim() && currentTopic) {
      const userMessage = { role: "user" as const, content: input.trim() };
      append({
        role: "user",
        content: input.trim(),
      });
      try {
        const data = await appendMessage(currentTopic, userMessage);
        setCurrentChat(data);
      } catch (error) {
        console.error("Error saving user message:", error);
      }
      setInput("");
    }
  };

  const hasMessages = messages.length > 0;
  const isGenerating = status === "streaming";
  const currentTopicTitle =
    selectedTopic && selectedSubtopic
      ? `${selectedTopic} - ${selectedSubtopic}`
      : selectedTopic;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 h-full">
          <div className="sticky space-y-6 top-3">
            <Card className="shadow-md border-t-4 border-t-blue-500">
              <CardHeader className="rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Wybierz temat do nauki
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[55vh] ">
                  {Object.entries(topicsData).map(([topic, subtopics]) => (
                    <div key={topic} className="group">
                      <Select
                        value={
                          selectedTopic === topic ? selectedSubtopic || "" : ""
                        }
                        onValueChange={(value) =>
                          handleTopicAndSubtopicSelect(topic, value || null)
                        }
                        disabled={isGenerating || isHistoryLoading}
                      >
                        <SelectTrigger
                          className={`w-full transition-all duration-200 ${
                            selectedTopic === topic
                              ? "border-blue-500 bg-blue-50 shadow-sm"
                              : "group-hover:border-blue-200"
                          }`}
                        >
                          <SelectValue placeholder={topic} />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {subtopics.map((subtopic) => (
                            <SelectItem key={subtopic} value={subtopic}>
                              {subtopic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                {currentTopicTitle &&
                  !hasMessages &&
                  !isGenerating &&
                  !isHistoryLoading && (
                    <Button
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleStartLearning}
                    >
                      Rozpocznij naukę
                    </Button>
                  )}
              </CardContent>
            </Card>

            {currentTopicTitle && currentChat && (
              <Card className="shadow-md border-t-4 border-t-green-500">
                <CardHeader className="rounded-t-lg flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-green-500" />
                    Aktywna rozmowa
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearChat}
                    disabled={isLoading || isGenerating || isHistoryLoading}
                    className="hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="bg-green-50 p-3 rounded-md">
                    <h3 className="font-medium text-green-800 mb-1">
                      {currentTopicTitle}
                    </h3>
                    <p className="text-sm text-green-600">
                      Ostatnia aktywność:{" "}
                      {new Date(currentChat.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-md min-h-[70vh] flex flex-col">
            <CardHeader className="rounded-t-lg gap-0 border-b ">
              <CardTitle className="flex items-center justify-between">
                {currentTopicTitle
                  ? `Nauka: ${currentTopicTitle}`
                  : "Wybierz temat, aby rozpocząć naukę"}
                {!isHistoryLoading && currentTopicTitle && (
                  <div className="inline-flex items-center gap-2">
                    <Label htmlFor="learned">Nauczone?</Label>
                    <Checkbox
                      className="w-5 h-5"
                      id="learned"
                      checked={isLearned}
                      onCheckedChange={(e) =>
                        handleLearnedChange({
                          subcategory: `${selectedTopic}-${selectedSubtopic}-${new Date()}`,
                          learned: Boolean(e),
                        })
                      }
                    />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-0">
              {isHistoryLoading ? (
                <div className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                    <h2 className="text-xl font-bold mb-2">
                      Ładowanie historii...
                    </h2>
                    <p className="text-slate-500">
                      Proszę czekać, ładujemy Twoją poprzednią rozmowę.
                    </p>
                  </div>
                </div>
              ) : !hasMessages ? (
                <div className="flex-grow flex items-center justify-center p-8">
                  <div className="text-center max-w-md">
                    <div className="text-6xl mb-6 bg-blue-50 text-blue-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
                      📚
                    </div>
                    <h2 className="text-2xl font-bold mb-3">
                      {currentTopicTitle
                        ? `Nauka - ${currentTopicTitle}`
                        : "Rozpocznij naukę"}
                    </h2>
                    <p className="text-slate-500 mb-6">
                      {currentTopicTitle
                        ? "Kliknij 'Rozpocznij naukę' aby rozpocząć..."
                        : "Wybierz temat z listy po lewej stronie, aby rozpocząć naukę."}
                    </p>
                    <div className="text-sm text-slate-600 bg-blue-50 p-4 rounded-lg mb-6">
                      <p className="font-medium mb-2">AI pomoże Ci:</p>
                      <ul className="grid grid-cols-2 gap-2">
                        <li className="flex items-center gap-1">
                          <span className="bg-blue-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Zrozumieć koncepcje</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-blue-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Rozwiązywać zadania</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-blue-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Przećwiczyć materiał</span>
                        </li>
                        <li className="flex items-center gap-1">
                          <span className="bg-blue-200 rounded-full w-4 h-4 flex-shrink-0 flex items-center justify-center text-xs">
                            ✓
                          </span>
                          <span>Sprawdzić wiedzę</span>
                        </li>
                      </ul>
                    </div>
                    {currentTopicTitle &&
                      !isGenerating &&
                      !isHistoryLoading && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={handleStartLearning}
                        >
                          Rozpocznij naukę
                        </Button>
                      )}
                  </div>
                </div>
              ) : (
                <div className="flex-grow overflow-y-auto p-4">
                  <MessageList messages={messages} />
                </div>
              )}

              {currentTopicTitle && (hasMessages || !isHistoryLoading) && (
                <div className="p-4 pb-0 pt-3 border-t">
                  <ChatInput
                    input={input}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmitWithHistory}
                    placeholder="Zadaj pytanie lub poproś o wyjaśnienie..."
                    disabled={isLoading || isGenerating}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
