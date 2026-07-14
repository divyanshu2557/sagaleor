"use client";

import React, { useState } from "react";
import { Plus, Heart, Share2, Trash2, X, AlertCircle } from "lucide-react";
import { createOutfit, deleteOutfit } from "@/actions/outfits";
import { useRouter } from "next/navigation";

export function OutfitsClient({ 
  initialOutfits,
  wardrobeItems 
}: { 
  initialOutfits: any[];
  wardrobeItems: any[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newOutfitName, setNewOutfitName] = useState("");
  const [newOutfitOccasion, setNewOutfitOccasion] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) return;
    
    setIsSubmitting(true);
    await createOutfit({
      name: newOutfitName,
      occasion: newOutfitOccasion,
      itemIds: selectedItems,
    });
    
    setIsSubmitting(false);
    setIsAdding(false);
    setNewOutfitName("");
    setNewOutfitOccasion("");
    setSelectedItems([]);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteOutfit(id);
    router.refresh();
  };

  const toggleItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-foreground mb-2">My Outfits</h1>
          <p className="text-muted-foreground">Your curated looks and saved combos.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Outfit
        </button>
      </div>

      {/* Outfit Grid */}
      {initialOutfits.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed border-border rounded-3xl">
          <p className="text-muted-foreground mb-4">You haven't created any outfits yet.</p>
          <button onClick={() => setIsAdding(true)} className="text-primary font-medium hover:underline">
            Create your first outfit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialOutfits.map((outfit) => {
            // Get up to 4 images for the collage
            const images = outfit.items.slice(0, 4).map((i: any) => i.imageUrl).filter(Boolean);
            
            return (
              <div key={outfit.id} className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm group hover:shadow-md transition-all">
                {/* Outfit Collage */}
                <div className="relative h-72 overflow-hidden bg-secondary">
                  {images.length > 0 ? (
                    <div className={`grid h-full gap-0.5 bg-border/30 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : images.length === 3 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-2 grid-rows-2'}`}>
                      {images.map((img: string, imgIdx: number) => (
                        <div key={imgIdx} className={`overflow-hidden ${images.length === 3 && imgIdx === 0 ? 'row-span-2' : ''}`}>
                          <img src={img} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No images
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleDelete(outfit.id)} className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-white transition-colors shadow-sm">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {outfit.occasion && (
                    <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      {outfit.occasion}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-foreground">{outfit.name}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5">{outfit.items.length} items</p>
                    </div>
                  </div>
                  
                  {/* Miniature Item Icons */}
                  <div className="flex items-center gap-2 pt-4 border-t border-border/50">
                    {outfit.items.slice(0, 5).map((item: any) => (
                      <div key={item.id} className="w-8 h-8 rounded-full overflow-hidden bg-secondary border border-border" title={item.name}>
                        {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                    ))}
                    {outfit.items.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                        +{outfit.items.length - 5}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Outfit Builder Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border/50 rounded-3xl w-full max-w-4xl p-6 shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-medium text-foreground">Create Outfit</h2>
              <button onClick={() => setIsAdding(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col md:flex-row gap-8">
              {/* Left Column: Details & Preview */}
              <div className="w-full md:w-1/3 space-y-6 shrink-0">
                <form id="outfit-form" onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Outfit Name</label>
                    <input required type="text" value={newOutfitName} onChange={e => setNewOutfitName(e.target.value)} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" placeholder="e.g., Casual Friday" />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1.5">Occasion (Optional)</label>
                    <input type="text" value={newOutfitOccasion} onChange={e => setNewOutfitOccasion(e.target.value)} className="w-full bg-secondary border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary" placeholder="e.g., Office, Party" />
                  </div>
                </form>

                <div className="bg-secondary rounded-2xl p-4 border border-border/50">
                  <h3 className="text-sm font-medium text-foreground mb-3">Selected Items ({selectedItems.length})</h3>
                  {selectedItems.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground flex flex-col items-center">
                      <AlertCircle className="w-6 h-6 mb-2 opacity-50" />
                      <p className="text-sm">Select items from your wardrobe on the right.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedItems.map(id => {
                        const item = wardrobeItems.find(i => i.id === id);
                        return item ? (
                          <div key={id} className="relative aspect-square rounded-lg overflow-hidden bg-card border border-border">
                            {item.imageUrl && <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />}
                            <button onClick={() => toggleItem(id)} className="absolute top-1 right-1 w-4 h-4 bg-background/80 rounded-full flex items-center justify-center text-foreground hover:bg-destructive hover:text-white">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Wardrobe Selector */}
              <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l border-border md:pl-8 pt-6 md:pt-0">
                <h3 className="text-sm font-medium text-foreground mb-4">Your Wardrobe</h3>
                {wardrobeItems.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No items in your wardrobe yet. Add some first!</p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {wardrobeItems.map(item => {
                      const isSelected = selectedItems.includes(item.id);
                      return (
                        <div 
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer transition-all ${
                            isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:opacity-80'
                          }`}
                        >
                          <div className="absolute inset-0 bg-secondary" />
                          {item.imageUrl && <img src={item.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />}
                          
                          {/* Selected Overlay */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 mt-6 border-t border-border flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsAdding(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-secondary text-foreground hover:bg-secondary/70 transition-colors">Cancel</button>
              <button 
                type="submit" 
                form="outfit-form"
                disabled={isSubmitting || selectedItems.length === 0} 
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Save Outfit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
