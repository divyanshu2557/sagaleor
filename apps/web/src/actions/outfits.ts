"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOutfit(data: { name: string; occasion?: string; itemIds: string[] }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    const outfit = await prisma.outfit.create({
      data: {
        userId: user.id,
        name: data.name,
        occasion: data.occasion,
        items: {
          connect: data.itemIds.map(id => ({ id }))
        }
      }
    });

    revalidatePath("/outfits");
    return { success: true, outfit };
  } catch (error) {
    console.error("Error creating outfit:", error);
    return { error: "Failed to create outfit" };
  }
}

export async function deleteOutfit(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    await prisma.outfit.deleteMany({
      where: {
        id,
        userId: user.id,
      }
    });

    revalidatePath("/outfits");
    return { success: true };
  } catch (error) {
    console.error("Error deleting outfit:", error);
    return { error: "Failed to delete outfit" };
  }
}
