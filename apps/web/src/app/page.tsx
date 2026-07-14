"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play, Sparkles, ChevronRight, Truck, ShieldCheck, RotateCcw, Award } from "lucide-react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";

/* ═══ Helpers ═══════════════════════════════════════════════════════ */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: "easeOut", delay }} className={className}>
      {children}
    </motion.div>
  );
}

/* ═══ Data ══════════════════════════════════════════════════════════ */
const categories = [
  { name: "Women", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80", href: "/women" },
  { name: "Men", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", href: "/men" },
  { name: "Fine Jewelry", img: "https://images.unsplash.com/photo-1515562141589-67f0d4e2b60b?w=600&q=80", href: "/jewelry" },
  { name: "Accessories", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", href: "/women" },
];

const newArrivals = [
  { name: "Silk Organza Saree", brand: "Manish Malhotra", price: "₹28,990", mrp: "₹34,990", img: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80" },
  { name: "Cashmere Wrap Coat", brand: "Loro Piana", price: "₹42,990", mrp: "₹52,990", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80" },
  { name: "Velvet Evening Gown", brand: "Sabyasachi", price: "₹35,990", mrp: "₹45,990", img: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80" },
  { name: "Tailored Wool Trousers", brand: "Tom Ford", price: "₹18,990", mrp: "₹24,990", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" },
  { name: "Heritage Kurta Set", brand: "Anita Dongre", price: "₹16,990", mrp: "₹22,990", img: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80" },
  { name: "Italian Merino Blazer", brand: "Ermenegildo Zegna", price: "₹54,990", mrp: "₹68,990", img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80" },
  { name: "Pearl Drop Earrings", brand: "Tanishq", price: "₹12,990", mrp: "₹15,990", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
  { name: "Leather Derby Shoes", brand: "Church&apos;s", price: "₹24,990", mrp: "₹32,990", img: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=600&q=80" },
];

const brandLogos = [
  <svg key="sabyasachi" viewBox="0 0 200 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="100" y="26" textAnchor="middle" fontSize="22" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.05em">SABYASACHI</text>
    <text x="100" y="36" textAnchor="middle" fontSize="8" fontWeight="300" fontFamily="sans-serif" letterSpacing="0.3em">CALCUTTA</text>
  </svg>,
  <svg key="tomford" viewBox="0 0 160 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="80" y="28" textAnchor="middle" fontSize="24" fontWeight="600" fontFamily="Arial, sans-serif" letterSpacing="0.1em">TOM FORD</text>
  </svg>,
  <svg key="loropiana" viewBox="0 0 160 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="80" y="28" textAnchor="middle" fontSize="24" fontWeight="400" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="0.02em">Loro Piana</text>
  </svg>,
  <svg key="manish" viewBox="0 0 240 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="120" y="28" textAnchor="middle" fontSize="20" fontWeight="500" fontFamily="Helvetica, sans-serif" letterSpacing="0.15em">MANISH MALHOTRA</text>
  </svg>,
  <svg key="anita" viewBox="0 0 200 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="100" y="28" textAnchor="middle" fontSize="20" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.1em">ANITA DONGRE</text>
  </svg>,
  <svg key="zegna" viewBox="0 0 160 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="80" y="28" textAnchor="middle" fontSize="24" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.1em">ZEGNA</text>
  </svg>,
  <svg key="gucci" viewBox="0 0 140 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="70" y="28" textAnchor="middle" fontSize="26" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="0.1em">GUCCI</text>
  </svg>,
  <svg key="dior" viewBox="0 0 100 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="50" y="28" textAnchor="middle" fontSize="28" fontWeight="600" fontFamily="Times New Roman, serif" letterSpacing="0.05em">DIOR</text>
  </svg>,
  <svg key="tanishq" viewBox="0 0 140 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="70" y="28" textAnchor="middle" fontSize="24" fontWeight="500" fontFamily="Georgia, serif" letterSpacing="0.05em">TANISHQ</text>
  </svg>,
  <svg key="ritukumar" viewBox="0 0 180 40" fill="currentColor" className="h-5 md:h-6 w-auto opacity-40 hover:opacity-100 transition-opacity duration-500">
    <text x="90" y="28" textAnchor="middle" fontSize="22" fontWeight="400" fontFamily="Georgia, serif" letterSpacing="0.1em">RITU KUMAR</text>
  </svg>
];

/* ═══ PAGE ══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: parallaxRef, offset: ["start start", "end end"] });
  const heroY = useTransform(scrollYProgress, [0, 0.15], ["0%", "30%"]);
  const col1Y = useTransform(scrollYProgress, [0.2, 0.5], ["4%", "-4%"]);
  const col2Y = useTransform(scrollYProgress, [0.2, 0.5], ["10%", "-10%"]);

  return (
    <div ref={parallaxRef} className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="dark" />

      {/* ─── 1. HERO ──────────────────────────────────────────────── */}
      <section className="relative h-[100svh] w-full bg-[#050505] overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 w-full h-[125vh] -top-[12vh]">
          <video src="/hero-video.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-45" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20 z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[#FDFBF7] to-transparent z-10" />

        <div className="container relative z-20 mx-auto px-6 h-full flex flex-col justify-end pb-24 lg:pb-32 max-w-[1440px]">
          <div className="max-w-2xl text-white">
            <motion.p initial={{ opacity: 0, letterSpacing: "0.5em" }} animate={{ opacity: 1, letterSpacing: "0.25em" }} transition={{ duration: 1.5, delay: 0.3 }} className="text-[0.6rem] uppercase mb-5 text-primary font-semibold">
              AI-Powered Fashion Intelligence
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }} className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading leading-[0.92] tracking-tight mb-7">
              INTELLIGENCE<br /><span className="text-white/35 italic font-light">meets</span><br />ELEGANCE.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="text-[0.95rem] text-white/55 mb-9 font-light leading-relaxed max-w-md">
              Luxury fashion curated by the world&apos;s most advanced AI stylist. Perfectly aligned with your unique Style DNA.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }} className="flex flex-wrap gap-3">
              <MagneticButton>
                <Link href="/women">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 text-[0.6rem] tracking-[0.2em] uppercase font-semibold rounded-none">
                    Shop Collection
                  </Button>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/intelligence" className="flex items-center gap-2 text-[0.6rem] tracking-[0.2em] uppercase font-semibold text-white hover:text-primary transition-colors h-12 px-6 border border-white/20 hover:border-primary/40">
                  <Play className="h-3.5 w-3.5" /> Meet Your AI Stylist
                </Link>
              </MagneticButton>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 2. BRAND MARQUEE ─────────────────────────────────────── */}
      <section className="py-8 border-b border-border/50 overflow-hidden bg-background flex items-center">
        <div className="flex animate-marquee whitespace-nowrap items-center">
          {[...brandLogos, ...brandLogos].map((Logo, i) => (
            <div key={i} className="mx-10 shrink-0 flex items-center justify-center text-foreground">
              {Logo}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. SHOP BY CATEGORY ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-heading">Shop by Category</h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {categories.map((cat, i) => (
              <Reveal key={cat.name} delay={i * 0.08}>
                <Link href={cat.href} className="group block relative aspect-[3/4] overflow-hidden bg-secondary">
                  <Image src={cat.img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-lg font-heading">{cat.name}</h3>
                    <span className="text-[0.6rem] tracking-[0.15em] uppercase text-white/60 mt-1 inline-flex items-center gap-1 group-hover:text-primary transition-colors">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. EDITORIAL COLLECTIONS ─────────────────────────────── */}
      <section className="py-16 md:py-28 bg-background">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <Reveal>
              <h2 className="text-2xl md:text-4xl font-heading">Curated Narratives</h2>
              <p className="text-muted-foreground text-sm font-light mt-2 max-w-md">Editorial collections dynamically generated from global runway trends.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/editorials" className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors whitespace-nowrap">View All</Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
            <motion.div style={{ y: col1Y }} className="md:col-span-7">
              <Link href="/editorials" className="group block relative aspect-[4/5] overflow-hidden bg-secondary">
                <Image src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80" alt="The Art of Layering" fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" sizes="(max-width: 768px) 100vw, 58vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-[0.5rem] tracking-[0.2em] uppercase mb-1.5 text-white/50">Collection 01</p>
                  <h3 className="text-2xl md:text-3xl font-heading">The Art of Layering</h3>
                </div>
              </Link>
            </motion.div>
            <motion.div style={{ y: col2Y }} className="md:col-span-5 flex flex-col gap-4 md:gap-8 mt-0 md:mt-20">
              <Link href="/editorials" className="group block relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" alt="Quiet Luxury" fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" sizes="(max-width: 768px) 100vw, 42vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.5rem] tracking-[0.2em] uppercase mb-1.5 text-white/50">Collection 02</p>
                  <h3 className="text-xl md:text-2xl font-heading">Quiet Luxury</h3>
                </div>
              </Link>
              <Link href="/editorials" className="group block relative aspect-square overflow-hidden bg-secondary">
                <Image src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" alt="After Hours" fill className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" sizes="(max-width: 768px) 100vw, 42vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-[0.5rem] tracking-[0.2em] uppercase mb-1.5 text-white/50">Collection 03</p>
                  <h3 className="text-xl md:text-2xl font-heading">After Hours</h3>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 5. NEW ARRIVALS PRODUCT GRID ─────────────────────────── */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <Reveal>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-heading">New Arrivals</h2>
                <p className="text-muted-foreground text-sm font-light mt-1.5">AI-selected based on your browsing patterns.</p>
              </div>
              <Link href="/women" className="text-[0.6rem] tracking-[0.2em] uppercase font-semibold border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors hidden md:block">Shop All</Link>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {newArrivals.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.05}>
                <Link href="/women" className="group block bg-white">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image src={p.img} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                    {/* Quick View on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/80 text-white text-center py-2.5 text-[0.6rem] tracking-[0.15em] uppercase font-medium">
                      Quick View
                    </div>
                  </div>
                  <div className="p-3 pb-4">
                    <p className="text-[0.6rem] text-primary tracking-wider uppercase font-medium">{p.brand}</p>
                    <p className="text-sm font-medium truncate mt-0.5">{p.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-semibold">{p.price}</span>
                      <span className="text-xs text-muted-foreground line-through">{p.mrp}</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. AI SECTION ────────────────────────────────────────── */}
      <section className="py-20 md:py-32 bg-[#080808] text-white relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-6 max-w-[1440px] relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-5">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-[0.5rem] uppercase tracking-[0.2em] text-primary font-semibold">Intelligence Engine</span>
                </div>
              </Reveal>
              <Reveal delay={0.1}><h2 className="text-3xl md:text-5xl font-heading mb-4 leading-tight">Your Digital<br />Style Architect</h2></Reveal>
              <Reveal delay={0.2}><p className="text-white/45 text-[0.95rem] font-light leading-relaxed mb-7 max-w-lg">Upload your wardrobe, chat with your AI stylist, and receive daily outfit recommendations aligned with your schedule, weather, and aesthetics.</p></Reveal>
              <Reveal delay={0.3}>
                <ul className="space-y-3.5 mb-9">
                  {["Analyzes your unique Style DNA", "Curates outfits for any occasion in seconds", "Identifies gaps in your wardrobe"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <ChevronRight className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-white/65 font-light text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={0.4}>
                <MagneticButton>
                  <Link href="/intelligence" className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 transition-colors h-11 px-7 text-[0.6rem] tracking-[0.2em] uppercase font-semibold">Explore AI <ArrowRight className="w-3.5 h-3.5" /></Link>
                </MagneticButton>
              </Reveal>
            </div>

            {/* Chat mockup */}
            <Reveal delay={0.2} className="relative w-full max-w-lg mx-auto">
              <div className="bg-white/[0.03] rounded-2xl border border-white/10 backdrop-blur-sm p-5 flex flex-col gap-3.5">
                <div className="flex items-center gap-3 pb-3.5 border-b border-white/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-heading italic text-sm">SL</div>
                  <div><p className="text-sm font-medium">SagaLeor Stylist</p><p className="text-[0.55rem] text-white/35">Online</p></div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl rounded-tl-sm self-start max-w-[85%] border border-white/5">
                  <p className="text-[0.78rem] font-light leading-relaxed text-white/75">I&apos;ve noticed your gala in Paris next week. Here are three looks based on your Style DNA and the forecast.</p>
                </div>
                <div className="bg-primary/15 p-3 rounded-xl rounded-tr-sm self-end max-w-[80%] border border-primary/20">
                  <p className="text-[0.78rem] font-light text-white">Show me options with the Tom Ford blazer I uploaded.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[{ img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80", label: "Look 01" }, { img: "https://images.unsplash.com/photo-1550614000-4b95d4ebf324?w=400&q=80", label: "Look 02" }].map((card) => (
                    <div key={card.label} className="bg-black/40 border border-white/5 rounded-lg p-1.5">
                      <div className="relative aspect-[3/4] rounded-md overflow-hidden mb-1.5">
                        <Image src={card.img} alt={card.label} fill className="object-cover" sizes="200px" />
                      </div>
                      <p className="text-[0.55rem] font-medium text-white/60 truncate px-0.5">{card.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── 7. EDITORIAL BANNER ──────────────────────────────────── */}
      <section className="relative h-[50vh] min-h-[350px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1600&q=80" alt="Editorial" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6 z-10">
          <Reveal>
            <p className="text-[0.55rem] tracking-[0.3em] uppercase mb-3 text-white/50">The Editorial</p>
            <h2 className="text-3xl md:text-5xl font-heading mb-5">The Silhouette Volume I</h2>
            <MagneticButton>
              <Link href="/editorials" className="inline-flex items-center gap-2 bg-white text-black hover:bg-white/90 transition-colors h-11 px-7 text-[0.6rem] tracking-[0.2em] uppercase font-semibold">
                Read the Editorial <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </MagneticButton>
          </Reveal>
        </div>
      </section>

      {/* ─── 8. TRUST BADGES ──────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-background border-t border-border/30">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "100% Authentic", sub: "Verified luxury brands" },
              { icon: Truck, title: "Free Shipping", sub: "On orders above ₹2,999" },
              { icon: RotateCcw, title: "Easy Returns", sub: "15-day hassle-free returns" },
              { icon: Award, title: "AI Curated", sub: "Personalized for your DNA" },
            ].map((badge) => (
              <div key={badge.title} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{badge.title}</p>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. NEWSLETTER ────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-secondary/40 border-t border-border/30">
        <div className="container mx-auto px-6 max-w-[600px] text-center">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-heading mb-3">Join the Inner Circle</h2>
            <p className="text-muted-foreground text-sm font-light mb-8">Be the first to receive AI-curated lookbooks, exclusive drops, and personalized style reports.</p>
            <form className="flex gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="flex-1 bg-white border border-border py-3 px-4 text-sm focus:outline-none focus:border-primary transition-colors" />
              <button type="submit" className="bg-primary text-primary-foreground h-[46px] px-6 text-[0.6rem] tracking-[0.15em] uppercase font-semibold hover:bg-primary/90 transition-colors shrink-0">
                Subscribe
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
