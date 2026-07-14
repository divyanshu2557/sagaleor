import OpenAI from "openai";

// GLM-5.2 — Conversational AI & Reasoning
export const glm = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API_KEY || "dummy-key",
});

// Nemotron — Object Detection & Visual Analysis (NVIDIA NIM)
export const nemotron = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_VISION_API_KEY || "dummy-key",
});

// DeepSeek V4 Flash — Data Analysis
export const deepseek = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_ANALYSIS_API_KEY || "dummy-key",
});

export default glm;
