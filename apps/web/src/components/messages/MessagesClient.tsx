"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, MoreHorizontal, Phone, Video, Send, ImageIcon, Smile, Paperclip } from "lucide-react";
import { sendMessage, triggerAutoReply } from "@/actions/messages";
import { useRouter } from "next/navigation";

export function MessagesClient({ 
  initialConversations, 
  initialMessagesMap 
}: { 
  initialConversations: any[];
  initialMessagesMap: Record<string, any[]>;
}) {
  const [activeConvoId, setActiveConvoId] = useState<string | null>(initialConversations[0]?.id || null);
  const [messagesMap, setMessagesMap] = useState<Record<string, any[]>>(initialMessagesMap);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const activeConvo = initialConversations.find(c => c.id === activeConvoId);
  const activeMessages = activeConvoId ? (messagesMap[activeConvoId] || []) : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConvoId) return;

    const textToSend = inputText;
    setInputText("");

    // Optimistic update
    const tempMsg = {
      id: "temp-" + Date.now(),
      sender: "USER",
      text: textToSend,
      createdAt: new Date(),
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConvoId]: [...(prev[activeConvoId] || []), tempMsg]
    }));

    // Send to server
    await sendMessage(activeConvoId, textToSend);

    // Trigger fake typing indicator & auto-reply
    setIsTyping(prev => ({ ...prev, [activeConvoId]: true }));
    
    await triggerAutoReply(activeConvoId, textToSend);
    
    setIsTyping(prev => ({ ...prev, [activeConvoId]: false }));
    router.refresh(); // Fetch the real messages back from server
  };

  // Sync client state with server when data changes (useful after refresh)
  useEffect(() => {
    setMessagesMap(initialMessagesMap);
  }, [initialMessagesMap]);

  return (
    <div className="flex bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden h-[calc(100vh-240px)] min-h-[500px]">
      
      {/* Conversation List */}
      <div className="w-80 border-r border-border flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border-none text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {initialConversations.map((convo) => {
            const lastMsg = convo.messages?.[0];
            
            return (
              <div
                key={convo.id}
                onClick={() => setActiveConvoId(convo.id)}
                className={`flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors border-b border-border/30 ${
                  activeConvoId === convo.id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-secondary/50'
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-secondary">
                    <img src={convo.otherAvatar} alt={convo.otherName} className="w-full h-full object-cover" />
                  </div>
                  {convo.isAI && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-card"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">{convo.otherName}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {lastMsg ? lastMsg.text : "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConvo ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-secondary">
                  <img src={activeConvo.otherAvatar} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{activeConvo.otherName}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConvo.isAI ? "AI Assistant" : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeMessages.map((msg: any) => {
                const isMe = msg.sender === "USER";
                return (
                  <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-secondary">
                        <img src={activeConvo.otherAvatar} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? 'order-first' : ''}`}>
                      <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-secondary text-foreground rounded-bl-none border border-border/50'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              
              {isTyping[activeConvo.id] && (
                <div className="flex items-end gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-secondary">
                    <img src={activeConvo.otherAvatar} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-secondary text-foreground rounded-2xl rounded-bl-none border border-border/50 px-4 py-4 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <form onSubmit={handleSend} className="flex items-center gap-3 bg-secondary rounded-2xl px-4 py-3">
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  <Smile className="w-5 h-5" />
                </button>
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ImageIcon className="w-5 h-5" />
                </button>
                <button 
                  type="submit" 
                  disabled={!inputText.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send className="w-4 h-4 pl-0.5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Search className="w-6 h-6" />
            </div>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
