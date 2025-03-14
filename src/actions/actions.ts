"use server";

import OpenAI from "openai";

type MathResponse = {
  success: boolean;
  answer: string;
  error?: string;
};

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    "HTTP-Referer": "https://matemaster-ai.vercel.app",
    "X-Title": "MateMaster AI",
  },
});

export async function getMathResponse(question: string): Promise<MathResponse> {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Jesteś pomocnym nauczycielem matematyki. Wyjaśniaj koncepcje krok po kroku, używaj przykładów i upewnij się, że uczeń rozumie podstawy przed przejściem do bardziej zaawansowanych tematów. Odpowiadaj zawsze po polsku. Używaj notacji matematycznej w formacie LaTeX gdy jest to potrzebne.",
        },
        {
          role: "user",
          content: question,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: true,
    });

    let result = "";

    for await (const chunk of completion) {
      if (chunk.choices[0]?.delta?.content) {
        result += chunk.choices[0].delta.content;
      }
    }

    return {
      success: true,
      answer: result,
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      success: false,
      answer: "",
      error: "Wystąpił błąd podczas przetwarzania zapytania",
    };
  }
}
