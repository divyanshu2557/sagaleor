"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, MoreHorizontal, Mic, ImageIcon, Send, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { sendChatMessage, type ChatMessage } from "@/actions/chat";

export default function AIStylistPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi Suvreen! ✨ I'm your personal AI Stylist. I know your Style DNA, your wardrobe, and what looks amazing on you. Ask me anything — outfit ideas, shopping advice, or what to wear for your next event!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(messages, trimmed);
      const assistantMessage: ChatMessage = { role: "assistant", content: response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again. 💫" },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-foreground">AI Stylist</h1>
              <p className="text-xs text-green-600">Online • Knows your Style DNA</p>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pb-6 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}
          >
            {msg.role === "assistant" && (
              <div className="w-9 h-9 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-none shadow-sm"
                  : "bg-secondary text-foreground rounded-2xl rounded-bl-none border border-border/50"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-9 h-9 rounded-full overflow-hidden shrink-0">
                <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-end gap-3 animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-full bg-primary/20 shrink-0 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-secondary text-foreground px-5 py-4 rounded-2xl rounded-bl-none border border-border/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 pb-4">
          {quickSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInput(suggestion);
                setTimeout(() => handleSend(), 0);
              }}
              disabled={isLoading}
              className="px-4 py-2 bg-card border border-border/50 rounded-full text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="pt-4 border-t border-border mt-auto">
        <div className="relative flex items-center bg-card border border-border/50 rounded-full shadow-sm p-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about style..."
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          />
          <div className="flex items-center gap-1.5 pr-1">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary" disabled={isLoading}>
              <Mic className="w-5 h-5" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary" disabled={isLoading}>
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ml-1"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const quickSuggestions = [
  "What should I wear today?",
  "Plan an outfit for a date night",
  "What colors suit my skin tone?",
  "Suggest a brunch look",
  "What's missing in my wardrobe?",
];
