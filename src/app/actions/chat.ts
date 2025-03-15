"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

interface ChatHistory {
  id: string;
  messages: Message[];
  category: string;
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

type InputMessage = {
  role: "user" | "system" | "data" | "assistant";
  content: string;
};

export async function appendMessage(
  category: string,
  message: InputMessage,
): Promise<ChatHistory> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User not found");

  const existingChat = await db.lernChat.findFirst({
    where: {
      userId: dbUser.id,
      category: category.toLowerCase(),
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
        chatId: existingChat.id,
      },
    });

    const updatedChat = await db.lernChat.findUnique({
      where: { id: existingChat.id },
      include: { messages: true },
    });

    return updatedChat as ChatHistory;
  }

  const newChat = await db.lernChat.create({
    data: {
      userId: dbUser.id,
      category: category.toLowerCase(),
      messages: {
        create: [
          {
            role: message.role,
            content: message.content,
          },
        ],
      },
    },
    include: { messages: true },
  });

  return newChat as ChatHistory;
}

export async function getChat(category: string): Promise<ChatHistory | null> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
    include: {
      lernChats: {
        include: { messages: true },
      },
    },
  });

  if (!dbUser) {
    await db.user.create({
      data: { id: user.id },
    });
    return null;
  }

  const chat = dbUser.lernChats.find(
    (chat) => chat.category.toLowerCase() === category.toLowerCase(),
  );

  return (chat as ChatHistory) || null;
}

export async function deleteChat(chatId: string): Promise<void> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const chat = await db.lernChat.findFirst({
    where: {
      id: chatId,
      userId: user.id,
    },
  });

  if (!chat) throw new Error("Chat not found");

  await db.message.deleteMany({
    where: { chatId },
  });

  await db.lernChat.delete({
    where: { id: chatId },
  });
}
