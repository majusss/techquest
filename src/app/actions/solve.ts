"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

/**
 * Interfejs reprezentujący czat do rozwiązywania zadań
 */
interface SolveChat {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

/**
 * Interfejs reprezentujący wiadomość w czacie
 */
interface Message {
  id: string;
  content: string;
  role: "user" | "system" | "data" | "assistant";
  createdAt: Date;
  updatedAt: Date;
  chatId: string | null;
  solveChatId: string | null;
}

/**
 * Typ reprezentujący wiadomość wejściową
 */
type InputMessage = {
  role: "user" | "system" | "data" | "assistant";
  content: string;
};

/**
 * Tworzy nowy czat do rozwiązywania zadań
 * @returns Nowo utworzony czat
 */
export async function createChat(): Promise<SolveChat> {
  // Sprawdź, czy użytkownik jest zalogowany
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Znajdź użytkownika w bazie danych
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User not found");

  // Utwórz nowy czat
  const newChat = await db.solveChat.create({
    data: {
      userId: dbUser.id,
    },
    include: { messages: true },
  });

  // Zwróć nowy czat z poprawnie typowanymi wiadomościami
  return {
    ...newChat,
    messages: newChat.messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "system" | "data" | "assistant",
    })),
  };
}

/**
 * Dodaje wiadomość do istniejącego czatu lub tworzy nowy czat z wiadomością
 * @param message Wiadomość do dodania
 * @param chatId Opcjonalne ID czatu, do którego dodać wiadomość
 * @returns Zaktualizowany czat z nową wiadomością
 */
export async function appendMessage(
  message: InputMessage,
  chatId?: string
): Promise<SolveChat> {
  // Sprawdź, czy użytkownik jest zalogowany
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Znajdź użytkownika w bazie danych
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User not found");

  // Jeśli podano chatId, znajdź ten czat
  if (chatId) {
    const existingChat = await db.solveChat.findFirst({
      where: {
        id: chatId,
        userId: dbUser.id,
      },
      include: {
        messages: true,
      },
    });

    if (existingChat) {
      // Dodaj nową wiadomość do istniejącego czatu
      await db.message.create({
        data: {
          role: message.role,
          content: message.content,
          solveChatId: existingChat.id,
        },
      });

      // Pobierz zaktualizowany czat
      const updatedChat = await db.solveChat.findUnique({
        where: { id: existingChat.id },
        include: { messages: true },
      });

      if (!updatedChat) throw new Error("Chat not found");

      // Zwróć zaktualizowany czat z poprawnie typowanymi wiadomościami
      return {
        ...updatedChat,
        messages: updatedChat.messages.map((msg) => ({
          ...msg,
          role: msg.role as "user" | "system" | "data" | "assistant",
        })),
      };
    } else {
      throw new Error("Chat not found");
    }
  }

  // Jeśli nie podano chatId, znajdź ostatni czat lub utwórz nowy
  const existingChat = await db.solveChat.findFirst({
    where: {
      userId: dbUser.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      messages: true,
    },
  });

  if (existingChat) {
    // Dodaj nową wiadomość do ostatniego czatu
    await db.message.create({
      data: {
        role: message.role,
        content: message.content,
        solveChatId: existingChat.id,
      },
    });

    // Pobierz zaktualizowany czat
    const updatedChat = await db.solveChat.findUnique({
      where: { id: existingChat.id },
      include: { messages: true },
    });

    if (!updatedChat) throw new Error("Chat not found");

    // Zwróć zaktualizowany czat z poprawnie typowanymi wiadomościami
    return {
      ...updatedChat,
      messages: updatedChat.messages.map((msg) => ({
        ...msg,
        role: msg.role as "user" | "system" | "data" | "assistant",
      })),
    };
  }

  // Jeśli nie znaleziono żadnego czatu, utwórz nowy z wiadomością
  const newChat = await db.solveChat.create({
    data: {
      userId: dbUser.id,
      messages: {
        create: {
          role: message.role,
          content: message.content,
        },
      },
    },
    include: { messages: true },
  });

  // Zwróć nowy czat z poprawnie typowanymi wiadomościami
  return {
    ...newChat,
    messages: newChat.messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "system" | "data" | "assistant",
    })),
  };
}

/**
 * Pobiera wszystkie czaty użytkownika
 * @returns Lista czatów użytkownika
 */
export async function getChats(): Promise<SolveChat[]> {
  // Sprawdź, czy użytkownik jest zalogowany
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Znajdź użytkownika w bazie danych wraz z jego czatami
  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      SolveChat: {
        include: { messages: true },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  // Jeśli użytkownik nie istnieje, utwórz go i zwróć pustą listę czatów
  if (!dbUser) {
    await db.user.create({
      data: { id: user.id },
    });
    return [];
  }

  // Zwróć czaty użytkownika z poprawnie typowanymi wiadomościami
  return dbUser.SolveChat.map((chat) => ({
    ...chat,
    messages: chat.messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "system" | "data" | "assistant",
    })),
  }));
}

/**
 * Usuwa pojedynczy czat
 * @param chatId ID czatu do usunięcia
 */
export async function deleteChat(chatId: string): Promise<void> {
  // Sprawdź, czy użytkownik jest zalogowany
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Znajdź czat należący do użytkownika
  const chat = await db.solveChat.findFirst({
    where: {
      id: chatId,
      userId: user.id,
    },
  });

  if (!chat) throw new Error("Chat not found");

  // Usuń wszystkie wiadomości czatu
  await db.message.deleteMany({
    where: { solveChatId: chatId },
  });

  // Usuń czat
  await db.solveChat.delete({
    where: { id: chatId },
  });
}

/**
 * Usuwa wszystkie czaty użytkownika
 */
export async function deleteAllChats(): Promise<void> {
  // Sprawdź, czy użytkownik jest zalogowany
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  // Usuń wszystkie czaty użytkownika
  await db.solveChat.deleteMany({
    where: { userId: user.id },
  });
}
