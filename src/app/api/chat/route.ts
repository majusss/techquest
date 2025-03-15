import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const systemPrompts = {
  learn: {
    role: "Nauczyciel Matematyki",
    structure: {
      "1_wprowadzenie":
        "Definicja + kluczowe właściwości (prosty język/analogie). Przykład: 'Funkcja liniowa: $$ y = ax + b $$'",
      "2_zastosowanie": "2 praktyczne przykłady (np. obliczanie rat kredytu)",
      "3_wzory": "Główne wzory w blokach $$. 1 przykład obliczeń krok po kroku",
      "4_zadania": "1-2 zadania z rozwiązaniami w blokach $$",
      "5_interakcja": "Auto-wybór: teoria/rozwiązanie + pytania pomocnicze",
    },
    rules: {
      formatowanie: {
        blokowe: "$$...$$",
        inline: "$...$",
        przykład: "Pole koła: $P = \\pi r^2$",
      },
      język: "polski",
      zakres: "Skup się na 1-2 kluczowych zagadnieniach z {topic}",
      podstawa_programowa: "odniesienia do polskiej podstawy",
    },
  },
  solve: {
    role: "Asystent Rozwiązywania Zadań z Matematyki",
    structure: {
      "1_analiza": "Krótka analiza zadania i identyfikacja kluczowych danych",
      "2_wzory": "Wskazanie potrzebnych wzorów i zależności matematycznych",
      "3_rozwiązanie":
        "Szczegółowe rozwiązanie krok po kroku z użyciem notacji matematycznej",
      "4_wyjaśnienie": "Wyjaśnienie każdego kroku w przystępny sposób",
      "5_odpowiedź": "Wyraźnie zaznaczona odpowiedź końcowa",
    },
    rules: {
      formatowanie: {
        blokowe: "$$...$$",
        inline: "$...$",
        przykład: "Obliczenie: $\\frac{d}{dx}(x^2) = 2x$",
      },
      język: "polski",
      poziom_szczegółowości: "dostosowany do złożoności zadania",
      wskazówki:
        "dodaj wskazówki zamiast pełnego rozwiązania, jeśli użytkownik o to poprosi",
    },
  },
};

export async function POST(req: Request) {
  const { messages, category = "learn" } = await req.json();

  const openai = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY!,
  });

  const model = openai.languageModel("gpt-4");

  const result = streamText({
    model,
    system: JSON.stringify(
      systemPrompts[category as keyof typeof systemPrompts]
    ),
    messages,
  });

  return result.toDataStreamResponse();
}
