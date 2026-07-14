"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOccasion(data: {
  name: string;
  date: Date;
  type: string;
  location?: string;
  outfitId?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const occasion = await prisma.occasion.create({
    data: {
      userId: user.id,
      name: data.name,
      date: data.date,
      type: data.type,
      location: data.location,
      outfitId: data.outfitId,
    },
  });

  revalidatePath("/occasions");
  return occasion;
}

export async function linkOutfitToOccasion(occasionId: string, outfitId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const occasion = await prisma.occasion.update({
    where: { id: occasionId },
    data: { outfitId },
  });

  revalidatePath("/occasions");
  return occasion;
}

export async function deleteOccasion(occasionId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.occasion.delete({
    where: { id: occasionId },
  });

  revalidatePath("/occasions");
  return true;
}
