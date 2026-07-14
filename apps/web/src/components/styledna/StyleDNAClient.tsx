"use client";

import React, { useState } from "react";
import { Edit2, Save, X, Loader2, ScanFace, Upload } from "lucide-react";
import { updateStyleDNA, analyzeStyleDNAImage } from "@/actions/styledna";
import { useRouter } from "next/navigation";

const ATTRIBUTE_OPTIONS = {
  faceShape: ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"],
  bodyShape: ["Hourglass", "Pear", "Apple", "Rectangle", "Inverted Triangle"],
  skinTone: ["Fair", "Light", "Medium", "Tan", "Deep", "Rich"],
  undertone: ["Cool", "Warm", "Neutral", "Olive"],
};

export function StyleDNAClient({ initialDna }: { initialDna: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [dna, setDna] = useState({
    faceShape: initialDna?.faceShape || "Oval",
    bodyShape: initialDna?.bodyShape || "Hourglass",
    skinTone: initialDna?.skinTone || "Medium",
    undertone: initialDna?.undertone || "Warm",
  });
  
  const router = useRouter();

  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await updateStyleDNA(dna);
    setIsSaving(false);
    setIsEditing(false);
    router.refresh();
  };

  const handleAIAutoDetect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate uploading and scanning
    setIsScanning(true);
    
    // Fake progress steps
    // Compress and resize the image before sending to avoid Next.js payload limits and speed up AI
    const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const MAX_WIDTH = 600;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            // Export as compressed JPEG
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          };
          img.onerror = (error) => reject(error);
        };
        reader.onerror = error => reject(error);
      });
    };

    let imageUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"; // fallback
    try {
      setScanStep("Compressing & uploading photo...");
      imageUrl = await compressImage(file);
    } catch (e) {
      console.error("Failed to read file", e);
    }
    
    setScanStep("Analyzing image with AI...");
    
    // Cycle text in the background while waiting for the AI
    const textInterval = setInterval(() => {
      setScanStep(prev => 
        prev.includes("structure") ? "Detecting skin tone..." : 
        prev.includes("skin tone") ? "Mapping proportions..." : 
        "Analyzing facial structure..."
      );
    }, 800);
    
    const result = await analyzeStyleDNAImage(imageUrl);
    
    clearInterval(textInterval);
    
    if (result.success && result.data) {
      const newDna = {
        faceShape: result.data.faceShape || dna.faceShape,
        bodyShape: result.data.bodyShape || dna.bodyShape,
        skinTone: result.data.skinTone || dna.skinTone,
        undertone: result.data.undertone || dna.undertone,
      };
      setDna(newDna);
      
      // Auto-save the new AI generated DNA
      await updateStyleDNA(newDna);
      router.refresh();
    }
    
    setIsScanning(false);
    setScanStep("");
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const attributes = [
    {
      id: "faceShape",
      label: "Face Shape",
      value: dna.faceShape,
      options: ATTRIBUTE_OPTIONS.faceShape,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
    },
    {
      id: "bodyShape",
      label: "Body Shape",
      value: dna.bodyShape,
      options: ATTRIBUTE_OPTIONS.bodyShape,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14M5 20h14M8 4v2c0 2-2 4-2 6s2 4 2 6v2M16 4v2c0 2 2 4 2 6s-2 4-2 6v2"/></svg>
    },
    {
      id: "skinTone",
      label: "Skin Tone",
      value: dna.skinTone,
      options: ATTRIBUTE_OPTIONS.skinTone,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
    },
    {
      id: "undertone",
      label: "Undertone",
      value: dna.undertone,
      options: ATTRIBUTE_OPTIONS.undertone,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
    }
  ];

  return (
    <div className="space-y-12">
      {/* Main Uniqueness Graphic */}
      <div className="flex flex-col items-center justify-center py-12 relative">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        
        <div className="absolute top-0 right-0 flex items-center gap-3">
          {!isEditing && !isScanning && (
            <button 
              onClick={handleAIAutoDetect}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
            >
              <ScanFace className="w-4 h-4" /> AI Auto-Detect
            </button>
          )}

          {!isEditing && !isScanning ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/70 transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit Profile
            </button>
          ) : isEditing ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/70 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative w-64 h-64 flex items-center justify-center mt-8">
          {/* Scanning Animation Rings */}
          {isScanning && (
            <>
              <div className="absolute inset-[-20px] border-[3px] border-primary/40 rounded-full border-t-primary animate-spin" style={{ animationDuration: '1s' }}></div>
              <div className="absolute inset-[-40px] border-2 border-primary/20 rounded-full border-b-primary animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            </>
          )}

          <div className={`absolute inset-0 border border-primary/20 rounded-full animate-spin-slow ${isScanning ? 'border-primary/60 scale-105 transition-all duration-500' : ''}`} style={{ animationDuration: '20s' }}></div>
          <div className={`absolute inset-2 border border-primary/40 rounded-full border-dashed animate-spin-slow ${isScanning ? 'border-primary/80 scale-105 transition-all duration-500' : ''}`} style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-6 border border-primary/60 rounded-full opacity-50"></div>
          
          <div className="text-center z-10 bg-background/80 backdrop-blur-sm rounded-full p-8 w-40 h-40 flex flex-col items-center justify-center">
            {isScanning ? (
              <div className="flex flex-col items-center gap-3">
                <ScanFace className="w-10 h-10 text-primary animate-pulse" />
                <p className="text-xs font-medium text-primary animate-pulse text-center leading-tight">{scanStep}</p>
              </div>
            ) : (
              <>
                <p className="text-5xl font-heading font-medium text-foreground">{initialDna?.uniquenessScore || 87}%</p>
                <p className="text-xs tracking-[0.2em] text-muted-foreground mt-2 uppercase">Uniqueness</p>
              </>
            )}
          </div>
        </div>

        <div className="text-center mt-12 max-w-md">
          <p className="text-sm text-muted-foreground leading-relaxed">
            You have a very distinctive style identity. Only {100 - (initialDna?.uniquenessScore || 85)}% of people are similar to you.
          </p>
        </div>
      </div>

      {/* Attributes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {attributes.map((attr) => (
          <div key={attr.id} className="bg-card border border-border/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-colors shadow-sm">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground mb-4">
              {attr.icon}
            </div>
            <p className="text-xs text-muted-foreground mb-2">{attr.label}</p>
            
            {isEditing ? (
              <select
                value={attr.value}
                onChange={(e) => setDna({ ...dna, [attr.id]: e.target.value })}
                className="w-full bg-secondary border-none rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-primary appearance-none text-center"
              >
                {attr.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <p className="text-base font-medium text-foreground">{attr.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
