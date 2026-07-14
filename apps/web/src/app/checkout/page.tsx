"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Check, ShieldCheck, Lock, CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, cartTotal } = useStore();
  const [step, setStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Redirect to login if unauthenticated
  if (status === "unauthenticated") {
    router.push("/login?callbackUrl=/checkout");
    return null;
  }

  const tax = cartTotal * 0.18; // 18% GST mock
  const finalTotal = cartTotal + tax;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-sm tracking-widest uppercase text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-heading mb-4">Order Confirmed</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Thank you for your purchase. Your order #SL-{Math.floor(Math.random() * 1000000)} has been received and is being processed.
        </p>
        <Link href="/">
          <Button className="h-12 px-8 tracking-widest uppercase text-xs">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Column - Form */}
      <div className="w-full lg:w-3/5 p-6 lg:p-12 xl:p-24 flex flex-col">
        <header className="mb-12">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-heading tracking-tight flex items-center gap-2">
              <span className="text-primary italic">S</span>
              <span className="text-primary italic -ml-2">L</span>
              <span className="uppercase tracking-[0.2em] text-sm ml-2">SagaLeor</span>
            </h1>
          </Link>
        </header>

        <div className="flex items-center text-xs tracking-widest uppercase mb-12">
          <span className={`${step === "shipping" ? "text-primary font-semibold" : "text-muted-foreground"}`}>Shipping</span>
          <span className="mx-4 text-border">—</span>
          <span className={`${step === "payment" ? "text-primary font-semibold" : "text-muted-foreground"}`}>Payment</span>
        </div>

        <div className="max-w-xl">
          {step === "shipping" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading">Shipping Information</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">First Name</label>
                  <input type="text" defaultValue={session?.user?.name?.split(' ')[0] || ""} className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Enter first name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Last Name</label>
                  <input type="text" defaultValue={session?.user?.name?.split(' ').slice(1).join(' ') || ""} className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Enter last name" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <input type="email" defaultValue={session?.user?.email || ""} className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Enter email" />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Address</label>
                  <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Street address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">City</label>
                  <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="City" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Postal Code</label>
                  <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="PIN code" />
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Cart
                </Link>
                <Button 
                  onClick={() => setStep("payment")}
                  className="h-12 px-8 tracking-[0.15em] uppercase text-xs"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading">Payment Details</h2>
              
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-md flex items-start gap-4 mb-8">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Secure Checkout</p>
                  <p className="text-xs text-muted-foreground mt-1">Your payment information is encrypted and secure. We do not store your credit card details.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Card Number</label>
                  <div className="relative">
                    <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 pl-8 focus:outline-none focus:border-primary transition-colors" placeholder="0000 0000 0000 0000" />
                    <CreditCard className="w-4 h-4 text-muted-foreground absolute left-0 top-3" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">Expiry Date</label>
                    <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-muted-foreground">CVV</label>
                    <div className="relative">
                      <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 pr-8 focus:outline-none focus:border-primary transition-colors" placeholder="123" />
                      <Lock className="w-4 h-4 text-muted-foreground absolute right-0 top-3" />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground">Name on Card</label>
                  <input type="text" className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" placeholder="Full name" />
                </div>
              </div>

              <div className="pt-6 flex justify-between items-center">
                <button onClick={() => setStep("shipping")} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shipping
                </button>
                <Button 
                  onClick={() => setStep("success")}
                  className="h-12 px-8 tracking-[0.15em] uppercase text-xs"
                >
                  Pay ₹{finalTotal.toLocaleString("en-IN")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full lg:w-2/5 bg-secondary/30 p-6 lg:p-12 xl:p-24 border-l border-border/30">
        <div className="max-w-md mx-auto lg:mx-0 sticky top-12">
          <h2 className="text-xl font-heading mb-8">Order Summary</h2>
          
          <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 no-scrollbar">
            {cart.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative w-16 h-20 bg-secondary shrink-0">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background rounded-full flex items-center justify-center text-[0.6rem] font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-2">{item.product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                </div>
                <p className="text-sm font-medium">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4 border-t border-border/50 pt-6 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Tax (18%)</span>
              <span>₹{tax.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-border/50 pt-6">
            <span className="text-base font-medium">Total</span>
            <div className="text-right">
              <span className="text-xs text-muted-foreground mr-2">INR</span>
              <span className="text-2xl font-heading">₹{finalTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
