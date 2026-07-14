"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Heart, Share2, Sparkles, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { getProductById } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const product = getProductById(id);
  const { addToCart } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-heading mb-4">Product Not Found</h1>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  const sizes = ["XS", "S", "M", "L", "XL"];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pt-[100px]">
      <SiteHeader variant="light" />

      <main className="container mx-auto px-6 max-w-[1440px] py-10">
        <Link href={`/${product.category}`} className="inline-flex items-center text-xs tracking-widest uppercase text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-3 h-3 mr-2" />
          Back to {product.category}
        </Link>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          {/* Gallery - Left Side */}
          <div className="w-full lg:w-[60%] flex flex-col-reverse md:flex-row gap-4 h-[70vh] lg:h-[85vh]">
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 h-28 md:w-full md:h-32 shrink-0 border transition-all duration-300 ${activeImage === idx ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <Image src={img} alt={`${product.name} - View ${idx + 1}`} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full h-full bg-secondary overflow-hidden">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full"
              >
                <Image src={product.images[activeImage]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 60vw" priority />
              </motion.div>
            </div>
          </div>

          {/* Product Details - Right Side (Sticky) */}
          <div className="w-full lg:w-[40%] flex flex-col h-full lg:sticky lg:top-[120px] lg:max-h-[calc(100vh-140px)] overflow-y-auto no-scrollbar pb-10">
            
            <div className="flex justify-between items-start mb-2">
              <Link href="#" className="text-xs tracking-[0.2em] uppercase font-semibold text-muted-foreground hover:text-primary transition-colors">
                {product.brand}
              </Link>
              <div className="flex items-center gap-3">
                <button className="text-muted-foreground hover:text-primary transition-colors"><Share2 className="w-4 h-4" /></button>
                <button className="text-muted-foreground hover:text-primary transition-colors"><Heart className="w-4 h-4" /></button>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-heading mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xl font-medium">{product.formattedPrice}</span>
              {product.mrp && <span className="text-sm text-muted-foreground line-through">{product.mrp}</span>}
              <span className="text-[0.65rem] tracking-wider uppercase bg-secondary px-2 py-1 ml-auto">Inclusive of all taxes</span>
            </div>

            <div className="mb-8">
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs tracking-[0.15em] uppercase font-medium">Select Size</span>
                <button className="text-xs underline text-muted-foreground hover:text-primary transition-colors">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 flex items-center justify-center text-xs transition-all duration-300 border ${selectedSize === size ? 'border-primary bg-primary text-primary-foreground font-semibold' : 'border-border/50 hover:border-primary text-foreground'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-10">
              <Button 
                onClick={() => addToCart(product, selectedSize)}
                className="w-full h-14 text-[0.7rem] tracking-[0.2em] uppercase font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Add To Bag
              </Button>
              
              <Link href="/intelligence" className="w-full">
                <Button variant="outline" className="w-full h-14 text-[0.7rem] tracking-[0.2em] uppercase font-semibold border-primary/20 hover:bg-primary/5 hover:border-primary/50 text-primary">
                  <Sparkles className="w-4 h-4 mr-2" /> Ask AI Stylist
                </Button>
              </Link>
            </div>

            {/* Details Accordion */}
            <div className="border-t border-border/50 divide-y divide-border/50">
              <details className="group py-5" open>
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm tracking-wider uppercase">
                  Product Details
                  <span className="transition group-open:rotate-45"><Plus className="w-4 h-4" /></span>
                </summary>
                <ul className="text-sm text-muted-foreground mt-4 space-y-2 font-light list-disc pl-4">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </details>
              <details className="group py-5">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-sm tracking-wider uppercase">
                  Shipping & Returns
                  <span className="transition group-open:rotate-45"><Plus className="w-4 h-4" /></span>
                </summary>
                <div className="text-sm text-muted-foreground mt-4 font-light space-y-4">
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 shrink-0 text-foreground" />
                    <p>Complimentary express shipping on this item. Delivery within 2-4 business days.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-5 h-5 shrink-0 text-foreground" />
                    <p>15-day complimentary return policy. Item must be unworn with original tags attached.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 shrink-0 text-foreground" />
                    <p>100% Authentic Guarantee. Sourced directly from {product.brand}.</p>
                  </div>
                </div>
              </details>
            </div>

          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
