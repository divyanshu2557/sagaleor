"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";

export default function EditorialsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const img1Y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const img3Y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      <SiteHeader variant="dark" />

      {/* Hero */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">
        <div className="z-20 text-center text-white relative">
          <p className="text-[0.6rem] tracking-[0.4em] uppercase font-medium mb-5 text-white/50">Volume I &bull; Paris</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-medium tracking-tighter leading-[0.85]">
            THE<br />SILHOUETTE
          </h1>
        </div>
        <motion.div style={{ y: img1Y }} className="absolute inset-0 z-10">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80"
            alt="Editorial Cover"
            className="w-full h-full object-cover opacity-40"
          />
        </motion.div>
      </section>

      {/* Editorial Grid */}
      <section className="py-24 md:py-40 px-6 md:px-16 max-w-[1440px] mx-auto bg-[#F5F5F0]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
          <div className="md:col-span-5 relative">
            <motion.div style={{ y: img2Y }} className="aspect-[3/4] w-full overflow-hidden bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80"
                alt="Editorial Detail"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="md:col-span-7 space-y-10 pl-0 md:pl-16">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="text-3xl md:text-5xl font-heading leading-tight"
            >
              &ldquo;We dress the intelligence of the modern individual. It&apos;s not just fabric; it&apos;s a structural extension of thought.&rdquo;
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-md space-y-5 text-base font-light leading-relaxed text-black/60"
            >
              <p>
                In this volume, we explore the intersection of minimalist design and high-grade materials. The AI algorithms of SagaLeor have analyzed thousands of global street styles to perfectly calibrate the drape, weight, and cut of these pieces.
              </p>
              <p>Every stitch is calculated. Every seam is intentional.</p>
            </motion.div>

            <Link href="/women" className="inline-block text-[0.6rem] tracking-[0.2em] uppercase font-bold border-b-2 border-black pb-1 hover:text-black/50 hover:border-black/50 transition-colors">
              Explore The Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Full Width Image */}
      <section className="h-[70vh] w-full relative overflow-hidden">
        <motion.div style={{ y: img3Y }} className="absolute inset-0 -top-[15%] h-[130%] w-full">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80"
            alt="Editorial Wide"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </section>

      {/* Next Volume */}
      <section className="py-24 flex flex-col items-center justify-center text-center bg-[#0A0A0A] text-white">
        <p className="text-[0.6rem] tracking-[0.4em] uppercase font-medium mb-5 text-white/40">Next Volume</p>
        <h3 className="text-4xl md:text-6xl font-heading cursor-pointer hover:text-primary transition-colors">
          THE TOKYO ARCHIVE
        </h3>
      </section>

      <SiteFooter />
    </div>
  );
}
