"use client";

import React, { useState } from "react";
import { Heart, Bookmark, Clock, Grid3X3, List, MoreHorizontal, Trash2, ExternalLink, Plus, X } from "lucide-react";
import { createCollection, saveItem, deleteSavedItem } from "@/actions/saved";
import { motion, AnimatePresence } from "framer-motion";

export function SavedClient({ collections, savedItems }: { collections: any[], savedItems: any[] }) {
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [colName, setColName] = useState("");
  const [colCover, setColCover] = useState("");
  
  const [itemName, setItemName] = useState("");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemSourceUrl, setItemSourceUrl] = useState("");
  const [itemCollectionId, setItemCollectionId] = useState("");

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!colName) return;
    setIsSubmitting(true);
    
    try {
      await createCollection(colName, colCover || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&q=80");
      setIsCollectionModalOpen(false);
      setColName("");
      setColCover("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemImageUrl) return;
    setIsSubmitting(true);
    
    try {
      await saveItem({
        name: itemName,
        imageUrl: itemImageUrl,
        sourceUrl: itemSourceUrl,
        collectionId: itemCollectionId || undefined
      });
      setIsItemModalOpen(false);
      setItemName("");
      setItemImageUrl("");
      setItemSourceUrl("");
      setItemCollectionId("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm("Remove this item?")) {
      await deleteSavedItem(id);
    }
  };

  const filteredItems = savedItems.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "inspiration" && item.type === "inspiration") return true;
    // other logic if needed
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl text-foreground mb-2">Saved</h1>
          <p className="text-muted-foreground">Your bookmarked items, outfits, and inspiration.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsCollectionModalOpen(true)}
            className="flex items-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Collection
          </button>
          <button 
            onClick={() => setIsItemModalOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" /> Save Link
          </button>
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="flex items-center gap-1 border-b border-border text-sm font-medium mb-10 overflow-x-auto scrollbar-hide">
        {["all", "outfits", "items", "inspiration"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 border-b-2 capitalize transition-colors whitespace-nowrap ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Collections */}
      <section className="space-y-5 mb-12">
        <h2 className="text-xl font-medium text-foreground">Collections</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {collections.map((col) => (
            <div key={col.id} className="min-w-[200px] w-[200px] bg-card rounded-2xl border border-border/50 overflow-hidden shrink-0 cursor-pointer group hover:shadow-md transition-shadow shadow-sm">
              <div className="h-28 overflow-hidden bg-secondary">
                {col.cover ? (
                  <img src={col.cover} alt={col.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Cover</div>
                )}
              </div>
              <div className="p-4">
                <p className="text-sm font-medium text-foreground">{col.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{col.items?.length || 0} items</p>
              </div>
            </div>
          ))}
          {collections.length === 0 && (
            <div className="text-sm text-muted-foreground italic py-6">No collections yet.</div>
          )}
        </div>
      </section>

      {/* Saved Items Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium text-foreground">Recently Saved</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded transition-colors ${viewMode === "grid" ? "bg-secondary text-foreground" : "hover:bg-secondary"}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded transition-colors ${viewMode === "list" ? "bg-secondary text-foreground" : "hover:bg-secondary"}`}><List className="w-4 h-4" /></button>
          </div>
        </div>
        
        {filteredItems.length === 0 && (
          <div className="text-center py-20 border border-dashed border-border rounded-3xl">
            <Bookmark className="w-10 h-10 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No saved items found. Start exploring!</p>
          </div>
        )}

        <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-2"}`}>
          {filteredItems.map((item) => (
            <div key={item.id} className={`group cursor-pointer ${viewMode === "list" ? "flex gap-4 items-center bg-card p-3 rounded-2xl border border-border/50 shadow-sm" : ""}`}>
              <div className={`relative rounded-2xl overflow-hidden bg-secondary ${viewMode === "grid" ? "aspect-[3/4] mb-3" : "w-24 h-24 shrink-0"}`}>
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id); }}
                    className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center text-destructive hover:bg-background transition-colors shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {item.sourceUrl && (
                    <a 
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center text-foreground hover:bg-background transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {/* Saved Badge */}
                {viewMode === "grid" && (
                  <div className="absolute top-3 right-3">
                    <Heart className="w-5 h-5 text-destructive fill-destructive" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full capitalize">{item.type}</span>
                  {item.collection?.name && (
                    <p className="text-xs text-muted-foreground truncate hidden sm:block">in {item.collection.name}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Collection Modal */}
      <AnimatePresence>
        {isCollectionModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl border border-border shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-heading text-foreground">New Collection</h2>
                <button onClick={() => setIsCollectionModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateCollection} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Collection Name</label>
                  <input 
                    type="text" 
                    required
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    placeholder="e.g. Summer Vibes"
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Cover Image URL (Optional)</label>
                  <input 
                    type="url" 
                    value={colCover}
                    onChange={(e) => setColCover(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCollectionModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">Create</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Save Item Modal */}
      <AnimatePresence>
        {isItemModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl border border-border shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-heading text-foreground">Save Inspiration</h2>
                <button onClick={() => setIsItemModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSaveItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Item Name / Caption</label>
                  <input 
                    type="text" 
                    required
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="e.g. Zara Denim Jacket"
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
                  <input 
                    type="url" 
                    required
                    value={itemImageUrl}
                    onChange={(e) => setItemImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Source Link (Optional)</label>
                  <input 
                    type="url" 
                    value={itemSourceUrl}
                    onChange={(e) => setItemSourceUrl(e.target.value)}
                    placeholder="https://zara.com/..."
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                {collections.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Add to Collection</label>
                    <select 
                      value={itemCollectionId}
                      onChange={(e) => setItemCollectionId(e.target.value)}
                      className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">None</option>
                      {collections.map(col => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">Save</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
