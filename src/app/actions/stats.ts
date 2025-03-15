"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserStats() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  if (!userStats) return await createEmptyUserStats();

  return userStats;
}

async function createEmptyUserStats() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  await db.userStats.create({
    data: { userId: user.id },
  });
}

export async function incrementSolved() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  if (!userStats) {
    await createEmptyUserStats();
  }

  await db.userStats.update({
    where: { userId: user.id },
    data: {
      solved: (userStats?.solved ?? 0) + 1,
    },
  });
}

export async function getLearned(subcategoryKey: string) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  return userStats?.learned.includes(subcategoryKey);
}

export async function markLearned(subcategoryKey: string, learned: boolean) {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  if (!userStats) {
    await createEmptyUserStats();
  }

  await db.userStats.update({
    where: { userId: user.id },
    data: {
      learned: {
        set: userStats!.learned.includes(subcategoryKey)
          ? userStats!.learned.filter((item) => item !== subcategoryKey)
          : [...userStats!.learned, subcategoryKey],
      },
    },
  });

  return learned;
}

export async function countStreak() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const messages = await db.message.findMany({
    where: {
      chat: {
        userId: user.id,
      },
    },
  });

  const streak = messages.reduce((acc, message, index, array) => {
    if (index === 0) return 1; // Pierwszy dzień zawsze liczy się jako 1

    const currentDate = new Date(message.createdAt);
    const previousDate = new Date(array[index - 1].createdAt);

    // Ustawienie godziny na początek dnia dla poprawnego porównania
    currentDate.setHours(0, 0, 0, 0);
    previousDate.setHours(0, 0, 0, 0);

    // Oblicz różnicę dni
    const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Jeśli różnica jest większa niż 1 dzień, seria jest przerwana
    if (diffDays > 1) return 1;

    // Jeśli to ten sam dzień, nie zwiększaj streak
    if (diffDays === 0) return acc;

    // Jeśli to kolejny dzień, zwiększ streak
    return acc + 1;
  }, 0);

  return streak;
}

export async function getLearnedTopics() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  const groupedLearned = userStats?.learned.reduce(
    (acc, item) => {
      const [topic, subtopic] = item.split("-");
      if (!acc[topic]) {
        acc[topic] = [];
      }
      acc[topic].push(subtopic);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  return groupedLearned;
}

export async function getLastActivity(): Promise<
  {
    title: string;
    time: Date;
    icon: string;
    color: string;
  }[]
> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  if (!userStats) {
    await createEmptyUserStats();
  }

  const lernChats = await db.lernChat.findMany({
    where: { userId: user.id },
    include: { messages: true },
  });

  const solveChats = await db.solveChat.findMany({
    where: { userId: user.id },
    include: { messages: true },
  });

  const output = [];

  for (const chat of lernChats) {
    const messagesWithContent = chat.messages.filter((m) => "content" in m);
    if (messagesWithContent.length > 0) {
      output.push({
        title: messagesWithContent[0].content || "Nauka tematu",
        time: chat.createdAt,
        icon: "📚",
        color: "blue",
      });
    }
  }

  for (const chat of solveChats) {
    const messagesWithContent = chat.messages.filter((m) => "content" in m);
    if (messagesWithContent.length > 0) {
      output.push({
        title: messagesWithContent[0].content || "Rozwiązywanie zadania",
        time: chat.createdAt,
        icon: "✏️",
        color: "purple",
      });
    }
  }

  for (const learned of userStats?.learned || []) {
    const [topic, subtopic, date] = learned.split("-");
    output.push({
      title: `${topic} - ${subtopic}`,
      time: new Date(date),
      icon: "😎",
      color: "green",
    });
  }
  return output.sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
}
