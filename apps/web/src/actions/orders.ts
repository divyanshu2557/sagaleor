"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUserOrders() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const orders = await prisma.order.findMany({
      where: { user: { email: session.user.email } },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return { orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { error: "Failed to fetch orders" };
  }
}

export async function createMockOrder() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Create a dummy order
    // @ts-ignore
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: 12490,
        status: "Processing",
        trackingNumber: "SGLR" + Math.floor(10000000 + Math.random() * 90000000),
        items: {
          create: [
            {
              name: "Structured Silk Blazer",
              price: 8990,
              quantity: 1,
              imageUrl: "https://images.unsplash.com/photo-1548624149-f9b1859aa7d0?w=500&q=80",
            },
            {
              name: "Minimalist Trousers",
              price: 3500,
              quantity: 1,
              imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&q=80",
            }
          ]
        }
      }
    });

    revalidatePath("/settings");

    return { success: true, order };
  } catch (error) {
    console.error("Error creating mock order:", error);
    return { error: "Failed to create mock order" };
  }
}
