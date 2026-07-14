"use client";

import React, { useState } from "react";
import { Search, TrendingUp, Flame, Star, ArrowRight, Filter, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function DiscoverClient({ trendingPosts }: { trendingPosts: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Minimalist", "Streetwear", "Luxury", "Vintage"];

  // Filter posts based on search query (by content/hashtags)
  const filteredPosts = trendingPosts.filter(post => {
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // We could add advanced hashtag matching based on activeFilter here
    // For now, if it's "All" show it, otherwise randomly simulate filtering for demo
    if (activeFilter !== "All") {
      // Very basic simulation: just filter by string match if we had tags, 
      // but since we don't, we'll just show a subset randomly or by string match if it exists.
      return post.content.toLowerCase().includes(activeFilter.toLowerCase());
    }
    return true;
  });

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
      className="max-w-6xl mx-auto space-y-10 pb-12"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-2">Discover</h1>
          <p className="text-muted-foreground text-lg">Explore curated trends, styles, and community posts.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === f 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Search */}
      <motion.div variants={item} className="relative group">
        <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search trends, brands, looks..."
          className="w-full pl-14 pr-6 py-4 rounded-2xl bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-sm transition-all"
        />
      </motion.div>

      {/* Trending Now */}
      <motion.section variants={item} className="space-y-6">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h2 className="text-xl font-medium text-foreground">Trending Now</h2>
        </div>
        
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            <AnimatePresence>
              {filteredPosts.map((post, idx) => (
                <motion.div 
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[3/4] bg-secondary"
                >
                  <img src={post.imageUrl} alt={post.content} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                    <p className="text-white font-medium text-sm md:text-base line-clamp-2 leading-snug">{post.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                        <span className="text-xs text-white/90 font-medium">{post.likes}</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-white/70 bg-white/10 px-2 py-1 rounded-full backdrop-blur-md">
                        @{post.user?.name?.replace(/\s/g, '').toLowerCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Top Badge (only on top 3) */}
                  {idx < 3 && !searchQuery && activeFilter === "All" && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> Top {idx + 1}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20 bg-card rounded-3xl border border-border/50 text-muted-foreground">
            No trending posts found for your search.
          </div>
        )}
      </motion.section>

    </motion.div>
  );
}
