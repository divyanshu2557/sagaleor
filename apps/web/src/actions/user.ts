"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserSettings(data: {
  name?: string;
  phone?: string;
  theme?: string;
  language?: string;
  aiPersonalize?: boolean;
  shareData?: boolean;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data,
    });

    revalidatePath("/settings");
    revalidatePath("/profile");
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { error: "Failed to update settings" };
  }
}
