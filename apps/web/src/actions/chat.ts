"use server";

import { glm } from "@/lib/ai";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(user: any): string {
  const styleDna = user.styleDna;
  const items = user.wardrobeItems || [];

  const categorySummary = items.reduce((acc: Record<string, number>, item: any) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const categoryStr = Object.entries(categorySummary)
    .map(([cat, count]) => `${cat}: ${count}`)
    .join(", ");

  const topItems = items
    .sort((a: any, b: any) => b.wornCount - a.wornCount)
    .slice(0, 5)
    .map((item: any) => `${item.name} (${item.category}, worn ${item.wornCount}x)`)
    .join(", ");

  const outfits = user.outfits || [];
  const outfitsStr = outfits.map((o: any) => `'${o.name}' (${o.occasion || 'Any'}): ${o.items.map((i: any) => i.name).join(", ")}`).join(" | ");

  return `You are SagaLeor's AI Fashion Stylist — a warm, knowledgeable, and encouraging personal style advisor.

## About the User
- Name: ${user.name}
- Style Score: ${user.styleScore}/100

## Style DNA
- Face Shape: ${styleDna?.faceShape || "Unknown"}
- Body Shape: ${styleDna?.bodyShape || "Unknown"}
- Skin Tone: ${styleDna?.skinTone || "Unknown"}
- Undertone: ${styleDna?.undertone || "Unknown"}
- Uniqueness: ${styleDna?.uniquenessScore || 0}%

## Wardrobe Summary
- Total Items: ${items.length}
- Categories: ${categoryStr}
- Most Worn Items: ${topItems}

## Saved Outfits
- ${outfitsStr || "No outfits saved yet"}

## Your Personality
- Be warm, personal, and encouraging — use the user's name occasionally
- Give specific, actionable advice referencing their wardrobe items and saved outfits when relevant
- Consider their body shape, skin tone, and undertone when suggesting colors/cuts
- Keep responses EXTREMELY concise. Use 1-2 short sentences max. Get straight to the point to ensure fast replies.
- Use occasional emojis sparingly for warmth ✨
- If asked about items not in their wardrobe, suggest what to look for while shopping
- Never be judgmental about their choices`;
}

export async function sendChatMessage(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return "I need you to log in before we can chat! ✨";

    // Fetch user context
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        styleDna: true, 
        wardrobeItems: true,
        outfits: { include: { items: true } }
      },
    });

    if (!user) {
      return "I'm sorry, I couldn't find your profile. Please try again later.";
    }

    const systemPrompt = buildSystemPrompt(user);

    // Build conversation history for NVIDIA (OpenAI-compatible format)
    const conversationMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ];

    const response = await glm.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: conversationMessages,
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 150,
      seed: 42,
    });

    return response.choices[0]?.message?.content || "I'm not sure how to respond to that. Could you rephrase?";
  } catch (error: any) {
    console.error("AI Chat Error:", error);

    if (error.message?.includes("API key") || error.status === 401 || error.status === 403) {
      return "⚠️ The AI service is not configured yet. Please add your `NVIDIA_API_KEY` to the `.env` file in `apps/web/.env` and restart the server.\n\nYou can get a free key at [build.nvidia.com](https://build.nvidia.com).";
    }

    return "I'm having trouble connecting right now. Please try again in a moment. 💫";
  }
}
