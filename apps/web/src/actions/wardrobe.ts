"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addWardrobeItem(data: { name: string; price: number; category: string; season?: string; color?: string; imageUrl?: string }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: user.id,
        name: data.name,
        price: data.price,
        category: data.category,
        season: data.season,
        color: data.color,
        imageUrl: data.imageUrl,
      }
    });

    revalidatePath("/wardrobe");
    return { success: true, item };
  } catch (error) {
    console.error("Error adding wardrobe item:", error);
    return { error: "Failed to add item" };
  }
}

export async function deleteWardrobeItem(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    await prisma.wardrobeItem.deleteMany({
      where: {
        id,
        userId: user.id,
      }
    });

    revalidatePath("/wardrobe");
    return { success: true };
  } catch (error) {
    console.error("Error deleting wardrobe item:", error);
    return { error: "Failed to delete item" };
  }
}
