"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function getUserStats() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  if (!userStats) throw new Error("User stats not found");

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

export async function getLearned(subcategory: string) {
  console.log(subcategory);
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const userStats = await db.userStats.findUnique({
    where: { userId: user.id },
  });

  console.log(userStats?.learned);

  return userStats?.learned.includes(subcategory);
}

export async function markLearned(subcategory: string, learned: boolean) {
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
        set: userStats!.learned.includes(subcategory)
          ? userStats!.learned.filter((item) => item !== subcategory)
          : [...userStats!.learned, subcategory],
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

  const streak = messages.reduce((acc, message) => {
    const messageDate = new Date(message.createdAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - messageDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return acc + diffDays;
  }, 0);

  return streak;
}
