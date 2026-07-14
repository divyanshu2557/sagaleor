"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Add @ts-ignore for all Prisma calls since client generation is blocked
// @ts-ignore
export async function getConversations() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    // @ts-ignore
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return { error: "User not found" };

    // @ts-ignore
    const conversations = await prisma.conversation.findMany({
      where: { participantId: user.id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // Get the latest message for the sidebar
        }
      },
      orderBy: { updatedAt: "desc" },
    });

    return { conversations };
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return { error: "Failed to fetch conversations" };
  }
}

export async function getMessages(conversationId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    // @ts-ignore
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return { messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { error: "Failed to fetch messages" };
  }
}

export async function sendMessage(conversationId: string, text: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return { error: "Not authenticated" };

    // Create the user's message
    // @ts-ignore
    const message = await prisma.message.create({
      data: {
        conversationId,
        sender: "USER",
        text,
      }
    });

    // Update conversation's updatedAt
    // @ts-ignore
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    revalidatePath("/messages");

    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { error: "Failed to send message" };
  }
}

// Simulated Auto-Responder
export async function triggerAutoReply(conversationId: string, userMessage: string) {
  try {
    // Wait a couple of seconds to simulate typing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // @ts-ignore
    const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!conversation) return;

    let replyText = "That's so interesting! Tell me more.";

    if (conversation.isAI) {
      const lowerText = userMessage.toLowerCase();
      if (lowerText.includes("hello") || lowerText.includes("hi")) {
        replyText = "Hello! I am your AI Stylist. How can I help you elevate your wardrobe today?";
      } else if (lowerText.includes("brunch")) {
        replyText = "For brunch, I recommend a light linen dress or chic high-waisted trousers with a silk top. Shall I find some options in your Wardrobe?";
      } else if (lowerText.includes("weather") || lowerText.includes("cold")) {
        replyText = "Layering is key! A nice structured blazer over a casual tee works perfectly.";
      } else {
        replyText = "I'm analyzing your style DNA... Based on your preferences, I think you should try mixing some bold colors with your neutrals!";
      }
    } else {
      // Mock friend responses
      const responses = [
        "Omg yes absolutely! 😍",
        "Haha that's so true 😂",
        "Wait I need to see this outfit!",
        "I was literally just thinking the same thing.",
        "Let's catch up soon to discuss!"
      ];
      replyText = responses[Math.floor(Math.random() * responses.length)];
    }

    // @ts-ignore
    await prisma.message.create({
      data: {
        conversationId,
        sender: "OTHER",
        text: replyText,
      }
    });

    // @ts-ignore
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    revalidatePath("/messages");
    return { success: true };
  } catch (error) {
    console.error("Auto-reply error:", error);
  }
}
