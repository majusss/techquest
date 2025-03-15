"use client";

import { useChat } from "@ai-sdk/react";
import "katex/dist/katex.min.css";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageList } from "@/components/chat/MessageList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Trash2, BookOpen, MessageSquare, Lightbulb } from "lucide-react";
import { appendMessage, getChat, deleteChat } from "@/app/actions/chat";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { getLearned, markLearned } from "../actions/stats";

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

// Konwertujemy obiekt topics na tablicę kategorii
const topicsData = {
  Ułamki: [
    "Ułamki zwykłe",
    "Miejsce ułamka na osi liczbowej",
    "Porównywanie ułamków",
    "Rozszerzanie ułamków",
    "Skracanie ułamków",
    "Liczby mieszane, ułamki niewłaściwe i właściwe",
    "Ułamek jako iloraz",
    "Dodawanie i odejmowanie ułamków o wspólnym mianowniku",
    "Sprowadzanie ułamków do wspólnego mianownika",
    "Dodawanie i odejmowanie ułamków zwykłych",
    "Mnożenie ułamków zwykłych",
    "Dzielenie ułamków zwykłych",
    "Ułamki dziesiętne",
    "Dodawanie i odejmowanie ułamków dziesiętnych",
    "Mnożenie ułamków dziesiętnych",
    "Dzielenie ułamków dziesiętnych",
    "Zestawienie pojęć związanych z ułamkami",
    "Różne zadania z ułamków",
  ],
  Procenty: [
    "Zamiana ułamka na procent",
    "Zamiana procentu na ułamek",
    "Jakim procentem jednej liczby jest druga liczba",
    "Obliczanie procentu z danej liczby",
    "Obliczanie liczby mając dany jej procent",
    "Podwójna obniżka/podwyżka cen",
    "Procent składany - kapitalizacja odsetek",
    "Zadania z procentów",
  ],
  "Potęgowanie i pierwiastkowanie": [
    "Potęgowanie - wprowadzenie",
    "Mnożenie potęg o tej samej podstawie",
    "Dzielenie potęg o tej samej podstawie",
    "Mnożenie potęg o tym samym wykładniku",
    "Dzielenie potęg o tym samym wykładniku",
    "Podnoszenie potęgi do potęgi",
    "Potęga o wykładniku 0",
    "Potęga o wykładniku ujemnym",
    "Pierwiastek kwadratowy",
    "Szacowanie pierwiastków",
    "Pierwiastkowanie",
    "Potęga o wykładniku wymiernym",
    "Zadania z potęgowania i pierwiastkowania",
    "Notacja wykładnicza",
    "Zagnieżdżone pierwiastki",
  ],
  "Liczby i działania": [
    "Rodzaje liczb",
    "Cyfry rzymskie",
    "Cechy podzielności liczb",
    "Dzielenie pisemne liczb",
    "Rozkładanie liczby na czynniki pierwsze",
    "Najmniejsza wspólna wielokrotność (NWW)",
    "Największy wspólny dzielnik (NWD)",
    "Jednostki długości",
    "Jednostki pola powierzchni",
    "Zadania z różnych działań na liczbach rzeczywistych",
  ],
  "Zbiory liczbowe": [
    "Zbiory",
    "Działania na zbiorach",
    "Iloczyn kartezjański zbiorów",
    "Przedziały",
    "Działania na przedziałach",
    "Zaznaczanie zbiorów na osi liczbowej",
  ],
  "Wartość bezwzględna": [
    "Wartość bezwzględna wyrażeń z x-em",
    "Wykres wartości bezwzględnej",
    "Interpretacja geometryczna wartości bezwzględnej",
    "Równania z wartością bezwzględną",
    "Nierówności z wartością bezwzględną",
    "Równania z kilkoma wartościami bezwzględnymi",
    "Nierówności z więcej niż jedną wartością bezwzględną",
  ],
  "Wyrażenia algebraiczne": [
    "Obliczanie wartości liczbowej wyrażenia algebraicznego",
    "Jednomiany",
    "Sumowanie wyrażeń algebraicznych",
    "Opuszczanie nawiasów",
    "Mnożenie wyrażeń algebraicznych",
    "Wzory skróconego mnożenia",
    "Usuwanie niewymierności z mianownika",
    "Dwumian Newtona",
    "Różne zadania z wyrażeń algebraicznych",
  ],
  "Równania i nierówności": [
    "Równania liniowe",
    "Równania w zadaniach z treścią",
    "Równanie oznaczone, tożsamościowe i sprzeczne",
    "Nierówności liniowe",
  ],
  "Układy równań": [
    "Co to jest układ równań",
    "Metoda podstawiania",
    "Metoda przeciwnych współczynników",
    "Metoda graficzna",
    "Metoda wyznaczników",
    "Układy oznaczone, nieoznaczone i sprzeczne",
    "Układy równań w zadaniach z treścią",
    "Układy równań z parametrem",
  ],
  Funkcje: [
    "Definicja funkcji",
    "Rysowanie wykresu funkcji",
    "Wartości funkcji i odczytywanie ich z wykresu",
    "Dziedzina funkcji",
    "Miejsca zerowe funkcji",
    "Monotoniczność funkcji",
    "Funkcje parzyste i nieparzyste",
    "Wektory w układzie współrzędnych",
    "Przesunięcia wykresów funkcji",
    "Przekształcanie wykresu przez symetrię względem osi układu współrzędnych",
    "Funkcja złożona",
  ],
  "Funkcja liniowa": [
    "Wykres funkcji liniowej",
    "Równania liniowe",
    "Miejsce zerowe funkcji liniowej",
    "Monotoniczność funkcji liniowej",
    "Równanie prostej przechodzącej przez dwa punkty",
    "Proste równoległe i prostopadłe",
    "Funkcja liniowa - zadania z parametrem",
    "Równania i nierówności liniowe z parametrem",
  ],
  "Funkcja kwadratowa": [
    "Funkcja kwadratowa typu f(x)=ax^2",
    "Przesunięcie wykresu funkcji kwadratowej o wektor",
    "Postać ogólna funkcji kwadratowej",
    "Postać kanoniczna funkcji kwadratowej",
    "Proste równania kwadratowe",
    "Równania kwadratowe",
    "Równania sprowadzalne do równań kwadratowych",
    "Program do rozwiązywania równań kwadratowych",
    "Miejsca zerowe funkcji kwadratowej",
    "Postać iloczynowa funkcji kwadratowej",
    "Zamiana postaci ogólnej na postać kanoniczną i iloczynową",
    "Zamiana postaci kanonicznej na postać ogólną i iloczynową",
    "Zamiana postaci iloczynowej na postać ogólną i kanoniczną",
    "Oś symetrii paraboli",
    "Wykres funkcji kwadratowej",
    "Nierówności kwadratowe",
    "Wzory Viete'a",
    "Równania i nierówności kwadratowe z parametrem",
    "Najmniejsza oraz największa wartość funkcji kwadratowej",
    "Zadania optymalizacyjne z funkcji kwadratowej",
    "Zastosowania funkcji kwadratowej",
  ],
  Wielomiany: [
    "Definicja wielomianu",
    "Obliczanie wartości wielomianu",
    "Stopień wielomianu",
    "Dodawanie i odejmowanie wielomianów",
    "Mnożenie wielomianów",
    "Dzielenie wielomianów",
    "Schemat Hornera",
    "Reszta z dzielenia wielomianu",
    "Trójkąt Pascala",
    "Rozkład wielomianu na czynniki",
    "Równania wielomianowe",
    "Równość wielomianów",
    "Twierdzenie Bézouta",
    "Pierwiastki całkowite wielomianu",
    "Pierwiastki wymierne wielomianu",
    "Krotność pierwiastka wielomianu",
    "Wykres wielomianu",
    "Nierówności wielomianowe",
  ],
};

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
    console.log(subcategory, learned);
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
    subtopic: string | null
  ) => {
    setSelectedTopic(topic);
    setSelectedSubtopic(subtopic);
    if (subtopic) {
      getLearned(subtopic).then((learned) => setIsLearned(learned ?? false));
    }

    setMessages([]);
  };

  const handleSubmitWithHistory = async (
    e: React.FormEvent<HTMLFormElement>
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
                          subcategory: selectedSubtopic,
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
