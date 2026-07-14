"use client";

import React, { useState, useEffect } from "react";
import { CloudSun, ChevronRight, AlertTriangle, ShoppingBag, CalendarDays, Heart, Flame, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function DashboardClient({ 
  user, 
  upcomingOccasions, 
  recentPosts, 
  analysis 
}: { 
  user: any;
  upcomingOccasions: any[];
  recentPosts: any[];
  analysis: any | null; // We can pass it or fetch it client-side. We'll pass it.
}) {
  const [greeting, setGreeting] = useState("Good morning");
  const [weather, setWeather] = useState({ temp: 22, condition: "Sunny", loaded: false, tip: "Perfect for light layers" });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Fetch dynamic weather
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
          const data = await res.json();
          
          if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            // Map WMO codes
            let condition = "Clear";
            let tip = "Great day for your favorite outfit!";
            
            if (code === 0) { condition = "Sunny"; tip = "Don't forget your sunglasses!"; }
            else if (code >= 1 && code <= 3) { condition = "Cloudy"; tip = "Perfect for light layers."; }
            else if (code >= 45 && code <= 48) { condition = "Foggy"; tip = "Visibility is low, wear something bright."; }
            else if (code >= 51 && code <= 67) { condition = "Rainy"; tip = "Grab an umbrella or a stylish raincoat!"; }
            else if (code >= 71 && code <= 77) { condition = "Snow"; tip = "Time for your best winter coat and boots."; }
            else if (code >= 95) { condition = "Stormy"; tip = "Best to stay indoors, cozy up!"; }

            setWeather({ temp, condition, loaded: true, tip });
          }
        } catch (error) {
          console.error("Failed to fetch weather:", error);
          setWeather(prev => ({ ...prev, loaded: true }));
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setWeather(prev => ({ ...prev, loaded: true })); // fallback to default
      });
    } else {
      setWeather(prev => ({ ...prev, loaded: true }));
    }
  }, []);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8 pb-12"
    >
      {/* Hero Welcome Section */}
      <motion.div variants={item} className="bg-gradient-to-br from-primary/10 via-background to-secondary/30 rounded-3xl p-8 border border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl text-foreground mb-2">{greeting}, <span className="font-heading font-medium">{user.name?.split(' ')[0]}</span>.</h1>
          <p className="text-muted-foreground text-lg">Your style command center is ready.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm relative z-10 min-w-[200px]">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
            {weather.loaded ? <CloudSun className="w-6 h-6" /> : <Loader2 className="w-6 h-6 animate-spin" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {weather.loaded ? `${weather.temp}°C, ${weather.condition}` : "Loading weather..."}
            </p>
            <p className="text-xs text-muted-foreground">{weather.loaded ? weather.tip : "Getting location..."}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main Feed & Events) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Occasions */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-foreground flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" /> Upcoming Events
              </h2>
              <Link href="/occasions" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {upcomingOccasions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingOccasions.slice(0, 2).map((event, idx) => {
                  const eventDate = new Date(event.date);
                  return (
                    <div key={idx} className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm group hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block mb-2">{event.type}</p>
                          <p className="font-medium text-foreground text-lg">{event.name}</p>
                          <p className="text-sm text-muted-foreground mt-1">{eventDate.toLocaleDateString()} • {event.location || 'No location'}</p>
                        </div>
                        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-muted-foreground font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {eventDate.getDate()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-dashed border-border/60 p-8 text-center">
                <p className="text-muted-foreground">No upcoming events. Time to plan something fun!</p>
                <Link href="/occasions" className="mt-4 inline-block text-sm text-primary font-medium hover:underline">Add an Event</Link>
              </div>
            )}
          </motion.section>

          {/* Community Pulse (Trending) */}
          <motion.section variants={item}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-medium text-foreground flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" /> Community Pulse
              </h2>
              <Link href="/discover" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center">
                Explore <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recentPosts.slice(0, 3).map((post, idx) => (
                <Link href={`/community`} key={idx} className="group block relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary">
                  <img src={post.imageUrl} alt={post.content} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white text-sm font-medium line-clamp-1">{post.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                      <span className="text-xs text-white">{post.likes}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

        </div>

        {/* Right Column (AI Wardrobe Analysis) */}
        <div className="space-y-8">
          <motion.section variants={item} className="bg-card rounded-3xl p-6 shadow-sm border border-border/50">
            <h2 className="text-xl font-medium text-foreground mb-6">Wardrobe Health</h2>
            
            {analysis ? (
              <>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className={`text-2xl font-heading ${analysis.healthScore >= 75 ? 'text-green-600' : analysis.healthScore >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{analysis.healthLabel}</p>
                    <p className="text-sm text-muted-foreground mt-1">AI-analyzed balance</p>
                  </div>
                  <p className="text-2xl font-medium text-foreground">{analysis.healthScore}%</p>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden mb-8">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${analysis.healthScore}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${analysis.healthScore >= 75 ? 'bg-green-500' : analysis.healthScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} 
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">Identified Gaps</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.gaps.slice(0, 3).map((gap: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-medium text-foreground uppercase tracking-wider">AI Suggestions</h3>
                    </div>
                    <ul className="space-y-2">
                      {analysis.suggestions.slice(0, 3).map((suggestion: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0 mt-2"></span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">AI is analyzing your wardrobe...</p>
              </div>
            )}
            
          </motion.section>
        </div>

      </div>
    </motion.div>
  );
}
