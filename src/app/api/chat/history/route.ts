import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    // Pobierz użytkownika lub utwórz go jeśli nie istnieje
    let dbUser = await db.user.findUnique({
      where: { id: user.id },
      include: {
        chats: {
          include: {
            messages: true,
          },
        },
      },
    });

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          id: user.id,
        },
        include: {
          chats: {
            include: {
              messages: true,
            },
          },
        },
      });
    }

    // Jeśli nie ma kategorii, zwróć wszystkie chaty
    if (!category) {
      return NextResponse.json(dbUser.chats);
    }

    // Znajdź chat dla danej kategorii
    const chat = dbUser.chats.find((chat) =>
      chat.messages.some(
        (msg) => msg.role === "system" && msg.content === category
      )
    );

    return NextResponse.json(chat ? [chat] : []);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { category, messages } = await request.json();

    // Pobierz użytkownika
    const dbUser = await db.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Sprawdź czy istnieje chat dla tej kategorii
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
      // Usuń wszystkie wiadomości z istniejącego chatu
      await db.message.deleteMany({
        where: {
          chatId: existingChat.id,
        },
      });

      // Dodaj nowe wiadomości
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

      // Pobierz zaktualizowany chat
      const updatedChat = await db.chat.findUnique({
        where: { id: existingChat.id },
        include: {
          messages: true,
        },
      });

      return NextResponse.json(updatedChat);
    }

    // Jeśli nie ma istniejącego chatu, utwórz nowy
    const chat = await db.chat.create({
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
      include: {
        messages: true,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error saving chat history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
