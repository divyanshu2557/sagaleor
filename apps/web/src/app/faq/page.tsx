"use client";

import React, { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "How does the AI Stylist work?", a: "Our AI analyzes your uploaded wardrobe, style preferences, body measurements, and lifestyle patterns to build your unique Style DNA. It then uses this profile to recommend outfits, identify wardrobe gaps, and curate new pieces that integrate perfectly with what you already own." },
  { q: "Is my data safe with SagaLeor?", a: "Absolutely. We use bank-level encryption (AES-256) for all personal data. Your wardrobe photos and style preferences are never shared with third parties. You can delete your data at any time from your account settings." },
  { q: "How long does shipping take?", a: "Standard shipping within India takes 5–7 business days. Express delivery (2 business days) is available for ₹499. International orders ship via DHL Express and typically arrive within 7–14 business days." },
  { q: "What is your return policy?", a: "We accept returns within 15 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached. Fine Jewelry and personalized items are final sale." },
  { q: "Can I try the AI Stylist for free?", a: "Yes! Creating an account gives you access to basic AI styling features including wardrobe analysis and daily outfit suggestions. Premium features like occasion-specific styling, predictive wardrobe optimization, and personal shopping are available with our SagaLeor Luxe subscription." },
  { q: "Do you offer personal styling consultations?", a: "Yes. Our human stylists work alongside the AI to provide a hybrid experience. You can book a 30-minute video consultation with a certified stylist through your account dashboard. This is complimentary for Luxe members." },
  { q: "Are all products authentic?", a: "100% guaranteed authentic. We source directly from brands and verified luxury partners. Every item comes with a certificate of authenticity and can be verified through our blockchain-based provenance system." },
  { q: "How do I cancel my subscription?", a: "You can cancel anytime from Account Settings → Subscription. There are no cancellation fees. Your access continues until the end of your current billing period." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="light" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[800px]">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Support</p>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground font-light mb-12 max-w-md">
            Everything you need to know about SagaLeor. Can&apos;t find an answer? Contact our concierge.
          </p>

          <div className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="text-sm font-medium pr-4 group-hover:text-primary transition-colors">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="pb-5 text-sm text-muted-foreground font-light leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
