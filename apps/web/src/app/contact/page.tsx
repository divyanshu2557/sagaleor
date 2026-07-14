import React from "react";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteNav";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <SiteHeader variant="light" />

      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-[1440px]">
          <p className="text-[0.6rem] uppercase tracking-[0.2em] text-primary font-semibold mb-3">Get In Touch</p>
          <h1 className="text-4xl md:text-6xl font-heading mb-4">Contact Concierge</h1>
          <p className="text-muted-foreground font-light max-w-lg mb-16">
            Our personal styling concierge is available to assist you with orders, styling advice, and any inquiries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "concierge@sagaleor.com", sub: "Response within 2 hours" },
                { icon: Phone, label: "Phone", value: "+91 22 4000 8000", sub: "Mon–Sat, 10 AM – 8 PM IST" },
                { icon: MapPin, label: "Atelier", value: "Kala Ghoda, Mumbai 400001", sub: "By appointment only" },
                { icon: Clock, label: "Hours", value: "Monday to Saturday", sub: "10:00 AM – 8:00 PM IST" },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[0.6rem] uppercase tracking-widest text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-medium text-sm">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-muted-foreground mb-2">First Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-muted-foreground mb-2">Last Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-muted-foreground mb-2">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
              <div>
                <label className="block text-[0.6rem] font-medium tracking-widest uppercase text-muted-foreground mb-2">Message</label>
                <textarea rows={4} className="w-full bg-transparent border-b border-border py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" className="bg-primary text-primary-foreground h-11 px-8 text-[0.6rem] tracking-[0.2em] uppercase font-semibold hover:bg-primary/90 transition-colors mt-2">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
