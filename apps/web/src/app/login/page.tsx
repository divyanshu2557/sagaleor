"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isLogin) {
      // Handle Login
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push(callbackUrl);
      }
    } else {
      // Handle Registration
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to register");
          setLoading(false);
        } else {
          // Auto login after registration
          const loginRes = await signIn("credentials", {
            redirect: false,
            email,
            password,
          });

          if (!loginRes?.error) {
            router.push(callbackUrl);
          } else {
            setLoading(false);
          }
        }
      } catch (err) {
        setError("Something went wrong");
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549439602-43ebca2327af?w=1600&q=80')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />

      <div className="w-full max-w-[400px] relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8">
            <h1 className="text-3xl font-heading tracking-tight flex items-center justify-center gap-2">
              <span className="text-primary italic">S</span>
              <span className="text-primary italic -ml-2">L</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-heading mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="text-muted-foreground text-sm">
            {isLogin 
              ? "Sign in to access your curated wardrobe and history." 
              : "Join SagaLeor to unlock your personalized Style DNA."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" 
                  placeholder="Enter your name" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" 
                placeholder="Enter email" 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
                {isLogin && (
                  <button type="button" className="text-[0.65rem] text-muted-foreground hover:text-primary transition-colors">
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border/50 py-2 focus:outline-none focus:border-primary transition-colors" 
                placeholder="Enter password" 
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 tracking-[0.15em] uppercase text-xs mt-8"
          >
            {loading ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)} className="text-foreground hover:text-primary transition-colors border-b border-foreground/30">
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-foreground hover:text-primary transition-colors border-b border-foreground/30">
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
