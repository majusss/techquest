"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

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

export async function saveChat(
  category: string,
  messages: any[]
): Promise<ChatHistory> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const dbUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) throw new Error("User not found");

  const existingChat = await db.chat.findFirst({
    where: {
      userId: dbUser.id,
      messages: {
        some: {
          role: "system",
          content: category,
        },
      },
    },
    include: {
      messages: true,
    },
  });

  if (existingChat) {
    await db.message.deleteMany({
      where: { chatId: existingChat.id },
    });

    const newMessages = await Promise.all(
      messages.map((msg: any) =>
        db.message.create({
          data: {
            role: msg.role,
            content: msg.content,
            chatId: existingChat.id,
          },
        })
      )
    );

    const updatedChat = await db.chat.findUnique({
      where: { id: existingChat.id },
      include: { messages: true },
    });

    return updatedChat as ChatHistory;
  }

  const newChat = await db.chat.create({
    data: {
      userId: dbUser.id,
      messages: {
        create: [
          { role: "system", content: category },
          ...messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content,
          })),
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
      chats: {
        include: { messages: true },
      },
    },
  });

  if (!dbUser) {
    await db.user.create({
      data: { id: user.id },
      include: {
        chats: {
          include: { messages: true },
        },
      },
    });
    return null;
  }

  const chat = dbUser.chats.find((chat) =>
    chat.messages.some(
      (msg) => msg.role === "system" && msg.content === category
    )
  );

  return (chat as ChatHistory) || null;
}

export async function deleteChat(chatId: string): Promise<void> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const chat = await db.chat.findFirst({
    where: {
      id: chatId,
      userId: user.id,
    },
  });

  if (!chat) throw new Error("Chat not found");

  await db.message.deleteMany({
    where: { chatId },
  });

  await db.chat.delete({
    where: { id: chatId },
  });
}
