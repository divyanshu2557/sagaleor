"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Cpu, Shield, BrainCircuit, ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SiteHeader } from "@/components/layout/SiteNav";

export default function IntelligencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const coreOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35], [1, 1, 0]);
  const coreScale = useTransform(scrollYProgress, [0, 0.35], [1, 4]);

  const text1Opacity = useTransform(scrollYProgress, [0.25, 0.35, 0.55], [0, 1, 0]);
  const text1Y = useTransform(scrollYProgress, [0.25, 0.55], [40, -40]);

  const text2Opacity = useTransform(scrollYProgress, [0.55, 0.65, 0.85], [0, 1, 0]);
  const text2Y = useTransform(scrollYProgress, [0.55, 0.85], [40, -40]);

  return (
    <div ref={containerRef} className="h-[300vh] bg-[#050505] text-white font-sans selection:bg-primary selection:text-white">
      <SiteHeader variant="dark" />

      {/* Sticky scroll-tell viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Core animation */}
        <motion.div
          style={{ opacity: coreOpacity, scale: coreScale }}
          className="absolute z-10 flex flex-col items-center justify-center"
        >
          <div className="relative w-36 h-36 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border border-primary/30 border-t-primary border-b-primary"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full border border-white/15 bg-primary/10 backdrop-blur-md"
            />
            <BrainCircuit className="w-10 h-10 text-primary" strokeWidth={1} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-10 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-heading font-medium tracking-tight mb-3">The Style Engine</h1>
            <p className="text-white/40 text-xs tracking-[0.2em] uppercase">Scroll to Initialize</p>
          </motion.div>
        </motion.div>

        {/* Phase 1 */}
        <motion.div
          style={{ opacity: text1Opacity, y: text1Y }}
          className="absolute z-20 max-w-xl text-center px-6"
        >
          <div className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-full mb-5 border border-primary/20">
            <Cpu className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading mb-5 leading-tight">Neural Aesthetic Mapping</h2>
          <p className="text-base text-white/60 font-light leading-relaxed">
            Our engine processes millions of data points from runway archives, global street style, and your personal interactions to construct your unique mathematical <span className="text-primary font-medium">Style DNA</span>.
          </p>
        </motion.div>

        {/* Phase 2 */}
        <motion.div
          style={{ opacity: text2Opacity, y: text2Y }}
          className="absolute z-20 max-w-xl text-center px-6"
        >
          <div className="inline-flex items-center justify-center p-3.5 bg-white/5 rounded-full mb-5 border border-white/10">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading mb-5 leading-tight">Predictive Wardrobe Optimization</h2>
          <p className="text-base text-white/60 font-light leading-relaxed">
            SagaLeor doesn&apos;t just show you clothes. It simulates how new pieces interact with your existing wardrobe, maximizing versatility and ensuring every purchase is mathematically flawless.
          </p>
          <div className="mt-10">
            <Link href="/login" className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 transition-colors h-12 px-8 text-[0.6rem] tracking-[0.2em] uppercase font-bold">
              Initialize Your Profile <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
