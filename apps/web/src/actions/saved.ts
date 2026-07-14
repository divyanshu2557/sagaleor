"use server";

import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createCollection(name: string, cover?: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const collection = await prisma.collection.create({
    data: {
      userId: user.id,
      name,
      cover,
    },
  });

  revalidatePath("/saved");
  return collection;
}

export async function saveItem(data: {
  name: string;
  imageUrl: string;
  sourceUrl?: string;
  type?: string;
  collectionId?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const item = await prisma.savedItem.create({
    data: {
      userId: user.id,
      name: data.name,
      imageUrl: data.imageUrl,
      sourceUrl: data.sourceUrl,
      type: data.type || "inspiration",
      collectionId: data.collectionId,
    },
  });

  revalidatePath("/saved");
  return item;
}

export async function deleteSavedItem(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  await prisma.savedItem.delete({
    where: { id },
  });

  revalidatePath("/saved");
  return true;
}
