import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="light" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[800px]">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Legal</p>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">Terms of Service</h1>
          <p className="text-xs text-muted-foreground mb-12">Last updated: July 14, 2026</p>

          <div className="space-y-8 text-sm font-light leading-relaxed text-foreground/70">
            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using the SagaLeor platform, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">2. Account Registration</h2>
              <p>You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your credentials and for all activities under your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">3. AI Styling Services</h2>
              <p>Our AI styling recommendations are generated algorithmically and are suggestions only. SagaLeor is not responsible for styling outcomes. The AI continuously learns from your feedback to improve accuracy.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">4. Purchases and Payments</h2>
              <p>All prices are in Indian Rupees (INR) unless otherwise stated. Prices are subject to change without notice. Payment is processed securely through our certified payment partners.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">5. Intellectual Property</h2>
              <p>All content on the SagaLeor platform — including AI models, design elements, text, and imagery — is the property of SagaLeor and protected by copyright laws. You may not reproduce or distribute any content without written permission.</p>
            </section>

            <section>
              <h2 className="text-lg font-heading text-foreground mb-3">6. Limitation of Liability</h2>
              <p>SagaLeor shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid in the preceding 12 months.</p>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
