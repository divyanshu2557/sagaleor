import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="light" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[800px]">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground mb-12">Last updated: July 14, 2026</p>

          <div className="space-y-8 text-sm font-light leading-relaxed text-foreground/70">
            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">1. Information We Collect</h2>
              <p>We collect information you provide directly — including your name, email address, shipping address, payment information, wardrobe photos, and style preferences. We also collect usage data such as browsing patterns, AI interaction history, and device information.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">2. How We Use Your Information</h2>
              <p>Your data powers our AI styling engine to deliver personalized recommendations. We use it to process orders, communicate with you, improve our services, and ensure account security. We never sell your personal information to third parties.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">3. Data Security</h2>
              <p>We employ AES-256 encryption for data at rest and TLS 1.3 for data in transit. Wardrobe photos are stored in isolated, encrypted containers. Our infrastructure is hosted on SOC 2 Type II certified platforms.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">4. Your Rights</h2>
              <p>You have the right to access, correct, or delete your personal data at any time. You can export your Style DNA profile and wardrobe data in standard formats. To exercise these rights, contact privacy@sagaleor.com or use the controls in your account settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">5. Cookies</h2>
              <p>We use essential cookies for authentication and session management. Analytics cookies help us understand how you use our platform. You can manage cookie preferences in your browser settings.</p>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
