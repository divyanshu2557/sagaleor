"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { useStore } from "@/lib/store";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/women", label: "Women" },
  { href: "/men", label: "Men" },
  { href: "/jewelry", label: "Fine Jewelry" },
  { href: "/editorials", label: "Editorials" },
  { href: "/intelligence", label: "AI Stylist" },
];

export function SiteHeader({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cart, setIsCartOpen } = useStore();
  const { data: session } = useSession();
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseTextColor = variant === "dark"
    ? (isScrolled ? "text-foreground" : "text-white")
    : "text-foreground";

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#111111] text-[#E5E5E5] text-[0.6rem] py-2 text-center uppercase tracking-[0.2em] font-medium relative z-[60]">
        COMPLIMENTARY SHIPPING &amp; RETURNS ON ALL ORDERS
        <span className="mx-4 text-white/20">|</span>
        100% AUTHENTIC
      </div>

      {/* Header */}
      <header
        className={`fixed top-[30px] left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl py-3 shadow-sm border-b border-border/30"
            : variant === "dark"
              ? "bg-gradient-to-b from-black/80 to-transparent py-5"
              : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 max-w-[1440px]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group relative z-50">
              <span className={`text-primary font-heading italic text-xl tracking-tighter mr-[-4px]`}>S</span>
              <span className={`text-primary font-heading italic text-xl tracking-tighter`}>L</span>
              <span className={`text-lg font-heading font-medium tracking-[0.2em] uppercase ml-2 ${baseTextColor} transition-colors duration-500`}>
                SagaLeor
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className={`hidden lg:flex items-center gap-8 text-[0.65rem] font-medium tracking-[0.15em] uppercase ${isScrolled ? 'text-foreground/70' : variant === 'dark' ? 'text-white/80' : 'text-foreground/70'} transition-colors duration-500`}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative py-1 hover:text-primary transition-colors group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className={`flex items-center gap-5 ${isScrolled ? 'text-foreground/70' : variant === 'dark' ? 'text-white/80' : 'text-foreground/70'} transition-colors duration-500`}>
              <button className="hover:text-primary transition-colors hidden sm:block" aria-label="Search">
                <Search className="h-[18px] w-[18px] stroke-[1.5]" />
              </button>
              
              {session ? (
                <div className="relative group hidden sm:block">
                  <Link href="/dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
                    <User className="h-[18px] w-[18px] stroke-[1.5]" />
                  </Link>
                  <div className="absolute top-full right-0 mt-4 bg-background border border-border/50 shadow-xl py-2 w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                    <div className="px-4 py-2 border-b border-border/50">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground truncate">{session.user?.name}</p>
                    </div>
                    <Link href="/dashboard" className="block px-4 py-2 text-xs tracking-wider uppercase hover:bg-secondary transition-colors">Dashboard</Link>
                    <button onClick={() => signOut()} className="w-full text-left px-4 py-2 text-xs tracking-wider uppercase hover:bg-secondary transition-colors text-destructive flex items-center justify-between">
                      Sign Out <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="hover:text-primary transition-colors" aria-label="Account">
                  <User className="h-[18px] w-[18px] stroke-[1.5]" />
                </Link>
              )}
              
              <button className="hover:text-primary transition-colors hidden sm:block" aria-label="Wishlist">
                <Heart className="h-[18px] w-[18px] stroke-[1.5]" />
              </button>
              <button onClick={() => setIsCartOpen(true)} className="hover:text-primary transition-colors relative" aria-label="Cart">
                <ShoppingBag className="h-[18px] w-[18px] stroke-[1.5]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1.5 bg-primary text-primary-foreground text-[0.5rem] h-3.5 w-3.5 rounded-full flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                className="lg:hidden hover:text-primary transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[55] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-sm font-medium tracking-[0.2em] uppercase lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-foreground hover:text-primary transition-colors text-lg"
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => { setMobileOpen(false); signOut(); }}
              className="mt-8 border border-destructive/50 text-destructive px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="mt-8 border border-primary text-primary px-8 py-3 text-xs tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#0A0A0A] text-white pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-[1440px]">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <span className="text-primary font-heading italic text-xl tracking-tighter mr-[-4px]">S</span>
              <span className="text-primary font-heading italic text-xl tracking-tighter">L</span>
              <span className="text-sm font-heading font-medium tracking-[0.2em] uppercase ml-2">SagaLeor</span>
            </Link>
            <p className="text-[0.8rem] text-white/40 font-light leading-relaxed max-w-[220px]">
              Where artificial intelligence meets haute couture. Your style, mathematically perfected.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.2em] uppercase mb-5 text-white/60">Shop</h4>
            <ul className="space-y-3 text-[0.8rem] text-white/40 font-light">
              <li><Link href="/women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/jewelry" className="hover:text-white transition-colors">Fine Jewelry</Link></li>
              <li><Link href="/women" className="hover:text-white transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.2em] uppercase mb-5 text-white/60">Experience</h4>
            <ul className="space-y-3 text-[0.8rem] text-white/40 font-light">
              <li><Link href="/intelligence" className="hover:text-white transition-colors">AI Stylist</Link></li>
              <li><Link href="/editorials" className="hover:text-white transition-colors">Editorials</Link></li>
              <li><Link href="/philosophy" className="hover:text-white transition-colors">Our Philosophy</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Client Account</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[0.6rem] font-medium tracking-[0.2em] uppercase mb-5 text-white/60">Support</h4>
            <ul className="space-y-3 text-[0.8rem] text-white/40 font-light">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping &amp; Returns</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.65rem] text-white/30 font-light">
          <p>&copy; {new Date().getFullYear()} SagaLeor. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
