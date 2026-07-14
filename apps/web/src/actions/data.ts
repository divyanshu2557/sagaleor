"use server";

import prisma from "@/lib/prisma";

export async function getUserData(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        styleDna: true,
        wardrobeItems: true,
        recommendations: true,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Failed to fetch user data.");
  }
}
