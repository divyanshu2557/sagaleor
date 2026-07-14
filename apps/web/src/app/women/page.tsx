"use client";

import React from "react";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { motion } from "framer-motion";
import { getProductsByCategory } from "@/lib/data";

const categories = [
  { name: "Dresses", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80", count: 42 },
  { name: "Blazers & Coats", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", count: 28 },
  { name: "Sarees & Lehengas", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80", count: 35 },
  { name: "Trousers", img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80", count: 31 },
];

export default function WomenPage() {
  const items = getProductsByCategory("women");
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="dark" />

      {/* Hero Banner */}
      <section className="relative h-[70vh] min-h-[500px] bg-[#0A0A0A] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
          alt="Women Collection"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1440px] pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">The Collection</p>
            <h1 className="text-5xl md:text-7xl font-heading text-white mb-3">Women</h1>
            <p className="text-white/50 font-light max-w-md">Elegance redefined through the lens of AI-curated luxury. Every piece chosen for you.</p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <h2 className="text-2xl font-heading mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.name} className="group relative aspect-[3/4] overflow-hidden bg-secondary cursor-pointer">
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-5 left-5 text-white">
                  <h3 className="text-lg font-heading">{cat.name}</h3>
                  <p className="text-[0.65rem] text-white/50 mt-1">{cat.count} Pieces</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24 bg-background">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl font-heading">All Products</h2>
            <p className="text-sm text-muted-foreground">{items.length} pieces</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {items.map((p) => (
              <Link href={`/product/${p.id}`} key={p.id} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  {/* Secondary image on hover if available */}
                  {p.images.length > 1 && (
                    <img src={p.images[1]} alt={`${p.name} Alternate`} className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
                  )}
                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 text-white text-center py-2.5 text-[0.6rem] tracking-[0.15em] uppercase font-medium">
                    Quick View
                  </div>
                </div>
                <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground mb-0.5">{p.brand}</p>
                <p className="text-sm font-medium truncate">{p.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-sm font-semibold">{p.formattedPrice}</p>
                  {p.mrp && <p className="text-xs text-muted-foreground line-through">{p.mrp}</p>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
