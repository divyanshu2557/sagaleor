"use client";

import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { motion } from "framer-motion";

export default function PhilosophyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="dark" />

      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] bg-[#0A0A0A] overflow-hidden flex items-end">
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80"
          alt="Our Philosophy"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/40" />
        <div className="container relative z-10 mx-auto px-6 max-w-[1440px] pb-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">About SagaLeor</p>
            <h1 className="text-5xl md:text-7xl font-heading text-white">Our Philosophy</h1>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-[800px]">
          <div className="space-y-10 text-lg font-light leading-relaxed text-foreground/80">
            <p className="text-2xl font-heading text-foreground leading-snug">
              We believe fashion is not about following trends — it&apos;s about understanding yourself deeply enough that every garment becomes an extension of your identity.
            </p>

            <p>
              SagaLeor was born at the intersection of haute couture and artificial intelligence. We observed that the modern individual — someone who values quality, sustainability, and personal expression — was underserved by an industry that optimizes for mass consumption.
            </p>

            <p>
              Our approach is fundamentally different. We use advanced neural networks to analyze your aesthetic preferences, body proportions, lifestyle patterns, and cultural context. The result is a mathematical model of your style — what we call your <span className="text-primary font-medium">Style DNA</span>.
            </p>

            <h2 className="text-3xl font-heading text-foreground pt-6">The Three Pillars</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Intelligence", desc: "Every recommendation is backed by data. We analyze runway trends, street style, weather, and your calendar to deliver precision styling." },
                { title: "Sustainability", desc: "We reduce overconsumption by ensuring every purchase integrates seamlessly with your existing wardrobe. Less waste, more versatility." },
                { title: "Craftsmanship", desc: "We partner exclusively with artisans and luxury houses that share our commitment to quality, heritage, and ethical production." },
              ].map((pillar) => (
                <div key={pillar.title} className="border-t border-border pt-6">
                  <h3 className="text-lg font-heading text-foreground mb-3">{pillar.title}</h3>
                  <p className="text-sm text-foreground/60 font-light leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>

            <p>
              Every stitch is calculated. Every seam is intentional. Every piece in your wardrobe should earn its place — and we&apos;re here to make sure it does.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
