"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

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

type InputMessage = {
  role: "user" | "system" | "data" | "assistant";
  content: string;
};

export async function appendMessage(message: InputMessage): Promise<SolveChat> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User not found");

  const existingChat = await db.solveChat.findFirst({
    where: {
      userId: dbUser.id,
    },
    include: {
      messages: true,
    },
  });

  if (existingChat) {
    await db.message.create({
      data: {
        role: message.role,
        content: message.content,
        solveChatId: existingChat.id,
      },
    });

    const updatedChat = await db.solveChat.findUnique({
      where: { id: existingChat.id },
      include: { messages: true },
    });

    if (!updatedChat) throw new Error("Chat not found");
    return {
      ...updatedChat,
      messages: updatedChat.messages.map((msg) => ({
        ...msg,
        role: msg.role as "user" | "system" | "data" | "assistant",
      })),
    };
  }

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

  return {
    ...newChat,
    messages: newChat.messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "system" | "data" | "assistant",
    })),
  };
}

export async function getChats(): Promise<SolveChat[]> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      SolveChat: {
        include: { messages: true },
      },
    },
  });

  if (!dbUser) {
    await db.user.create({
      data: { id: user.id },
    });
    return [];
  }

  return dbUser.SolveChat.map((chat) => ({
    ...chat,
    messages: chat.messages.map((msg) => ({
      ...msg,
      role: msg.role as "user" | "system" | "data" | "assistant",
    })),
  }));
}

export async function deleteChat(chatId: string): Promise<void> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const chat = await db.solveChat.findFirst({
    where: {
      id: chatId,
      userId: user.id,
    },
  });

  if (!chat) throw new Error("Chat not found");

  await db.message.deleteMany({
    where: { solveChatId: chatId },
  });

  await db.solveChat.delete({
    where: { id: chatId },
  });
}
