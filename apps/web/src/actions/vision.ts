"use server";

import { glm, nemotron } from "@/lib/ai";
import prisma from "@/lib/prisma";

/**
 * Step 1: Llama 3.2 90B Vision detects clothing items in an image
 * Step 2: Llama 3.1 70B enriches the detected items with fashion intelligence
 * 
 * This pipeline allows users to scan clothing photos and get
 * AI-powered analysis of what they own.
 */

export interface DetectedItem {
  name: string;
  category: string;
  color: string;
  style: string;
  estimatedPrice: string;
}

export interface VisionAnalysisResult {
  detectedItems: DetectedItem[];
  outfitScore: number;
  feedback: string;
  colorHarmony: string;
  occasions: string[];
}

/**
 * Analyze a clothing image URL using the Vision + Reasoning pipeline.
 * 
 * Flow:
 * 1. Llama-3.2-90b-vision-instruct (vision) → analyzes pixels and identifies items
 * 2. Llama-3.1-70b-instruct (reasoning) → provides fashion intelligence on detected items
 */
export async function analyzeClothingImage(imageUrl: string): Promise<VisionAnalysisResult> {
  try {
    // Fetch user style context
    const user = await prisma.user.findUnique({
      where: { email: "suvreen@gmail.com" },
      include: { styleDna: true },
    });

    // Step 1: Vision Model — Detect objects/clothing in the image using proper multimodal format
    const detectionResponse = await nemotron.chat.completions.create({
      model: "meta/llama-3.2-90b-vision-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a fashion item detection system. Analyze this image and detect all clothing items visible.
Respond ONLY with valid JSON (no markdown code blocks, no explanation):
{"items": [{"name": "item name", "category": "Tops/Bottoms/Dresses/Shoes/Bags/Accessories", "color": "primary color", "style": "casual/formal/sporty/ethnic"}]}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 512,
    });

    let detectedItems: DetectedItem[] = [];
    try {
      const detectionText = detectionResponse.choices[0]?.message?.content?.trim() || "";
      const cleanText = detectionText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const parsed = JSON.parse(cleanText);
      detectedItems = parsed.items || [];
    } catch {
      detectedItems = [
        { name: "Detected Garment", category: "Tops", color: "Neutral", style: "casual", estimatedPrice: "₹2,500" }
      ];
    }

    // Step 2: Llama 3.1 70B — Fashion intelligence on detected items
    const itemsList = detectedItems.map(i => `${i.name} (${i.category}, ${i.color}, ${i.style})`).join(", ");
    
    const glmResponse = await glm.chat.completions.create({
      model: "meta/llama-3.1-70b-instruct",
      messages: [
        {
          role: "system",
          content: "You are a fashion analyst. Given detected clothing items and a user's style DNA, provide outfit scoring and styling feedback. Respond ONLY with valid JSON."
        },
        {
          role: "user",
          content: `Detected items: ${itemsList}
User's Style DNA: Face ${user?.styleDna?.faceShape || "Oval"}, Body ${user?.styleDna?.bodyShape || "Hourglass"}, Skin ${user?.styleDna?.skinTone || "Warm Beige"}, Undertone ${user?.styleDna?.undertone || "Neutral"}

Respond ONLY with valid JSON (no markdown code blocks, no explanation):
{
  "outfitScore": 85,
  "feedback": "Brief styling feedback about the outfit",
  "colorHarmony": "good/excellent/needs work",
  "occasions": ["occasion1", "occasion2"],
  "priceEstimates": [{"item": "item name", "price": "₹X,XXX"}]
}`
        }
      ],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 512,
      seed: 42,
    });

    let outfitScore = 80;
    let feedback = "Great styling choices!";
    let colorHarmony = "good";
    let occasions: string[] = ["Casual", "Weekend"];

    try {
      const glmText = glmResponse.choices[0]?.message?.content?.trim() || "";
      const cleanGlm = glmText.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      const glmParsed = JSON.parse(cleanGlm);
      outfitScore = glmParsed.outfitScore || 80;
      feedback = glmParsed.feedback || "Great styling choices!";
      colorHarmony = glmParsed.colorHarmony || "good";
      occasions = glmParsed.occasions || ["Casual"];
      
      // Enrich detected items with price estimates
      if (glmParsed.priceEstimates) {
        detectedItems = detectedItems.map((item) => {
          const priceMatch = glmParsed.priceEstimates.find(
            (p: any) => p.item?.toLowerCase().includes(item.name.toLowerCase())
          );
          return { ...item, estimatedPrice: priceMatch?.price || "₹2,500" };
        });
      }
    } catch {
      // Use defaults
    }

    return {
      detectedItems,
      outfitScore,
      feedback,
      colorHarmony,
      occasions,
    };
  } catch (error) {
    console.error("Vision pipeline error:", error);
    return {
      detectedItems: [],
      outfitScore: 0,
      feedback: "Unable to analyze the image right now. Please try again.",
      colorHarmony: "unknown",
      occasions: [],
    };
  }
}

/**
 * Quick scan: Use Llama 3.2 Vision to classify a single wardrobe item
 * from an image and auto-fill metadata for the wardrobe.
 */
export async function scanWardrobeItem(imageUrl: string): Promise<{
  name: string;
  category: string;
  color: string;
  estimatedPrice: number;
  season: string;
}> {
  try {
    const response = await nemotron.chat.completions.create({
      model: "meta/llama-3.2-90b-vision-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a fashion item classifier. Classify this clothing item.
Respond ONLY with valid JSON (no markdown code blocks, no explanation):
{"name": "Item Name", "category": "Tops/Bottoms/Dresses/Shoes/Bags/Accessories/Outerwear", "color": "primary color", "estimatedPrice": 2500, "season": "All/Summer/Winter/Monsoon"}`
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      temperature: 1.0,
      top_p: 1.0,
      max_tokens: 256,
    });

    const text = response.choices[0]?.message?.content?.trim() || "";
    const cleanText = text.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    return JSON.parse(cleanText);
  } catch {
    return {
      name: "New Item",
      category: "Tops",
      color: "Neutral",
      estimatedPrice: 2500,
      season: "All",
    };
  }
}
