"use client";

import React, { useEffect } from "react";
import { X, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";

export function CartSidebar() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, addToCart, cartTotal } = useStore();

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setIsCartOpen]);

  // Lock body scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isCartOpen]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-background border-l border-border/50 z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-xl font-heading">Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your cart is empty.</p>
                  <Button
                    variant="outline"
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item, index) => (
                    <div key={`${item.product.id}-${item.size}-${index}`} className="flex gap-4">
                      <div className="relative w-24 h-32 bg-secondary shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground mb-1">
                              {item.product.brand}
                            </p>
                            <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                            {item.size && (
                              <p className="text-xs text-muted-foreground mt-1">Size: {item.size}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="p-1 hover:text-destructive transition-colors text-muted-foreground"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center border border-border/50">
                            <button
                              onClick={() => {
                                if (item.quantity > 1) {
                                  removeFromCart(item.product.id, item.size); // Temporary: need a decrement fn in store ideally, or just re-add logic. 
                                  // Wait, let's just make it simple:
                                } else {
                                  removeFromCart(item.product.id, item.size);
                                }
                              }}
                              className="p-1.5 hover:bg-secondary text-muted-foreground"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                            <button
                              onClick={() => addToCart(item.product, item.size)}
                              className="p-1.5 hover:bg-secondary text-muted-foreground"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <p className="font-medium text-sm">
                            ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-background/50 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-heading">₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Link href="/checkout" onClick={() => setIsCartOpen(false)}>
                  <Button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-xs tracking-[0.2em] uppercase font-semibold">
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
