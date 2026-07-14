import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { Truck, RotateCcw, Globe, Clock } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="light" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[800px]">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Policies</p>
          <h1 className="text-4xl md:text-5xl font-heading mb-12">Shipping &amp; Returns</h1>

          {/* Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Truck, label: "Free Shipping", sub: "On orders above ₹2,999" },
              { icon: RotateCcw, label: "Easy Returns", sub: "Within 15 days" },
              { icon: Globe, label: "International", sub: "Ships to 30+ countries" },
              { icon: Clock, label: "Express", sub: "2-day delivery available" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-10 text-sm font-light leading-relaxed text-foreground/70">
            <div>
              <h2 className="text-xl font-heading text-foreground mb-4">Shipping Policy</h2>
              <p>All orders within India are shipped via our premium logistics partners. Standard delivery takes 5–7 business days. Express delivery (2 business days) is available at checkout for an additional ₹499.</p>
              <p className="mt-3">International orders are shipped via DHL Express with full tracking. Delivery times vary by destination, typically 7–14 business days. Import duties and taxes are the responsibility of the customer.</p>
            </div>

            <div>
              <h2 className="text-xl font-heading text-foreground mb-4">Return Policy</h2>
              <p>We accept returns within 15 days of delivery for a full refund. Items must be unworn, unwashed, and in original packaging with all tags attached.</p>
              <p className="mt-3">Fine Jewelry and personalized items are final sale and cannot be returned. For exchanges, please contact our concierge team.</p>
            </div>

            <div>
              <h2 className="text-xl font-heading text-foreground mb-4">How to Initiate a Return</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Log into your SagaLeor account and navigate to Order History</li>
                <li>Select the item(s) you wish to return</li>
                <li>Choose your reason and preferred refund method</li>
                <li>Schedule a free pickup or drop off at any partner location</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
