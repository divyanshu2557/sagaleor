"use server";

import { deepseek } from "@/lib/ai";
import prisma from "@/lib/prisma";

export interface WardrobeAnalysis {
  healthScore: number;
  healthLabel: string;
  totalItems: number;
  totalValue: number;
  costPerWear: string;
  topCategories: { name: string; count: number }[];
  gaps: string[];
  suggestions: string[];
}

export async function analyzeWardrobe(): Promise<WardrobeAnalysis> {
  const user = await prisma.user.findUnique({
    where: { email: "suvreen@gmail.com" },
    include: { wardrobeItems: true, styleDna: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const items = user.wardrobeItems;
  const totalItems = items.length;
  const totalValue = items.reduce((acc, item) => acc + item.price, 0);
  const totalWorn = items.reduce((acc, item) => acc + item.wornCount, 0);
  const costPerWear = totalWorn > 0 ? (totalValue / totalWorn).toFixed(1) : "0";

  // Compute category breakdown
  const categoryCounts = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  // Try AI-powered gap analysis via NVIDIA
  let gaps: string[] = [];
  let suggestions: string[] = [];

  try {
    const categoryStr = topCategories.map((c) => `${c.name}: ${c.count}`).join(", ");
    const prompt = `You are a fashion wardrobe analyst. Given this wardrobe breakdown:
Categories: ${categoryStr}
Total items: ${totalItems}
Style DNA: Face shape ${user.styleDna?.faceShape}, Body shape ${user.styleDna?.bodyShape}, Skin tone ${user.styleDna?.skinTone}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks, no explanation):
{"gaps": ["gap1", "gap2", "gap3"], "suggestions": ["suggestion1", "suggestion2", "suggestion3"]}

gaps = 3 categories or item types missing from the wardrobe
suggestions = 3 specific items to buy next based on the style DNA`;

    const response = await deepseek.chat.completions.create({
      model: "deepseek-ai/deepseek-v4-flash",
      messages: [{ role: "user", content: prompt }],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 2048,
      extra_body: {
        chat_template_kwargs: {
          thinking: true,
          reasoning_effort: "high"
        }
      }
    } as any);

    const text = response.choices[0]?.message?.content?.trim() || "";
    // Parse JSON response, stripping any markdown code fences
    const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    const parsed = JSON.parse(cleanText);
    gaps = parsed.gaps || [];
    suggestions = parsed.suggestions || [];
  } catch {
    // Fallback to static analysis
    const allCategories = ["Tops", "Bottoms", "Dresses", "Shoes", "Bags", "Accessories", "Outerwear", "Activewear"];
    gaps = allCategories.filter((c) => !categoryCounts[c]).slice(0, 3);
    suggestions = [
      "A versatile neutral blazer for layering",
      "Statement earrings for your oval face shape",
      "A midi dress in warm tones for your skin tone",
    ];
  }

  // Compute health score (0-100) based on diversity and usage
  const uniqueCategories = Object.keys(categoryCounts).length;
  const diversityScore = Math.min((uniqueCategories / 6) * 50, 50);
  const usageScore = totalWorn > 0 ? Math.min((totalWorn / totalItems) * 10, 50) : 0;
  const healthScore = Math.round(diversityScore + usageScore);
  const healthLabel = healthScore >= 75 ? "Great" : healthScore >= 50 ? "Good" : "Needs Work";

  return {
    healthScore,
    healthLabel,
    totalItems,
    totalValue,
    costPerWear,
    topCategories,
    gaps,
    suggestions,
  };
}
