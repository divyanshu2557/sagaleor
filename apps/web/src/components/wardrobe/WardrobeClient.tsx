"use client";

import React, { useState } from "react";
import { LayoutGrid, List, Plus, Heart, Trash2, X } from "lucide-react";
import { addWardrobeItem, deleteWardrobeItem } from "@/actions/wardrobe";
import { useRouter } from "next/navigation";

export function WardrobeClient({ initialItems }: { initialItems: any[] }) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [isAdding, setIsAdding] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "Tops", imageUrl: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const categories = ["All", "Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories"];

  const filteredItems = initialItems.filter(item => 
    categoryFilter === "All" ? true : item.category === categoryFilter
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await addWardrobeItem({
      name: newItem.name,
      price: parseFloat(newItem.price) || 0,
      category: newItem.category,
      imageUrl: newItem.imageUrl || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    });
    setIsSubmitting(false);
    setIsAdding(false);
    setNewItem({ name: "", price: "", category: "Tops", imageUrl: "" });
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteWardrobeItem(id);
    router.refresh();
  };

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-medium text-foreground">My Closet</h1>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                categoryFilter === cat 
                  ? "bg-foreground text-background font-medium" 
                  : "bg-secondary text-muted-foreground hover:bg-secondary/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground bg-secondary rounded-lg p-1">
          <button 
            onClick={() => setView("grid")}
            className={`p-1.5 rounded-md transition-colors ${view === "grid" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView("list")}
            className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-background text-foreground shadow-sm" : "hover:text-foreground"}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Item Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground mb-4">No items found in this category.</p>
          <button onClick={() => setIsAdding(true)} className="text-primary font-medium hover:underline">
            Add your first item
          </button>
        </div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6" : "space-y-4"}>
          {filteredItems.map((item) => (
            <div key={item.id} className={`group cursor-pointer ${view === "list" ? "flex items-center gap-4 bg-card p-4 rounded-2xl border border-border/50" : ""}`}>
              <div className={`relative rounded-2xl overflow-hidden bg-secondary ${view === "grid" ? "aspect-[3/4] mb-3" : "w-16 h-16 shrink-0"}`}>
                {item.imageUrl && (
                   <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                )}
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 hover:bg-destructive hover:text-white text-muted-foreground backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className={`flex justify-between items-start gap-2 ${view === "list" ? "flex-1" : ""}`}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">₹{item.price} • {item.category}</p>
                </div>
                {item.wornCount > 0 && (
                   <div className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full border border-border text-[10px] text-muted-foreground" title="Times Worn">
                      {item.wornCount}
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border/50 rounded-3xl w-full max-w-md p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-foreground">Add to Wardrobe</h2>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Item Name</label>
                <input required type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" placeholder="e.g., Black Linen Shirt" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Price (₹)</label>
                  <input required type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" placeholder="1999" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1.5">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary appearance-none">
                    {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1.5">Image URL (Optional)</label>
                <input type="url" value={newItem.imageUrl} onChange={e => setNewItem({...newItem, imageUrl: e.target.value})} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" placeholder="https://..." />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary text-foreground hover:bg-secondary/70 transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isSubmitting ? "Adding..." : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
