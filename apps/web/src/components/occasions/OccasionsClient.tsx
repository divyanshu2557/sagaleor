"use client";

import React, { useState } from "react";
import { Plus, CalendarDays, MapPin, Clock, ChevronRight, Sparkles, X, Trash2 } from "lucide-react";
import { createOccasion, deleteOccasion } from "@/actions/occasions";
import { motion, AnimatePresence } from "framer-motion";

export function OccasionsClient({ occasions, outfits }: { occasions: any[], outfits: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Date Night");
  const [location, setLocation] = useState("");

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;
    setIsSubmitting(true);
    
    // Combine date and time for DB (simple implementation)
    const datetime = new Date(`${date}T${time || "12:00"}`);

    try {
      await createOccasion({
        name,
        date: datetime,
        type,
        location
      });
      setIsModalOpen(false);
      setName("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteOccasion(id);
    }
  };

  // Separate upcoming and past
  const now = new Date();
  const upcoming = occasions.filter(o => new Date(o.date) >= now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = occasions.filter(o => new Date(o.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl text-foreground mb-2">Occasions</h1>
          <p className="text-muted-foreground">Plan the perfect outfit for every event in your life.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Upcoming Events */}
      <section className="space-y-5">
        <h2 className="text-xl font-medium text-foreground">Upcoming Events</h2>
        {upcoming.length === 0 && (
          <div className="text-center py-10 bg-card rounded-3xl border border-border/50 text-muted-foreground">
            No upcoming events. Click "Add Event" to plan one!
          </div>
        )}
        <div className="space-y-4">
          {upcoming.map((event) => {
            const eventDate = new Date(event.date);
            const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
            const day = eventDate.getDate();
            const weekday = eventDate.toLocaleString('default', { weekday: 'short' });
            const timeStr = eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={event.id} className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 group hover:shadow-md transition-shadow relative">
                
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Date Badge */}
                <div className="w-20 h-20 rounded-2xl bg-secondary flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{month}</span>
                  <span className="text-2xl font-heading text-foreground">{day}</span>
                  <span className="text-xs text-muted-foreground">{weekday}</span>
                </div>

                {/* Event Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium text-primary bg-primary/10">{event.type}</span>
                  </div>
                  <p className="text-lg font-medium text-foreground">{event.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {timeStr}</span>
                    {event.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {event.location}</span>
                    )}
                  </div>
                </div>

                {/* Outfit Preview */}
                <div className="flex items-center gap-3 shrink-0 mr-8 md:mr-4">
                  {event.outfit ? (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-secondary">
                         {/* Here we'd show the outfit items or image, maybe an icon for now */}
                         <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Outfit</div>
                      </div>
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">Outfit Ready</span>
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 text-primary text-sm font-medium hover:underline">
                      <Sparkles className="w-4 h-4" /> Get AI Suggestion
                    </button>
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Past Events */}
      {past.length > 0 && (
        <section className="space-y-5 mt-12">
          <h2 className="text-xl font-medium text-foreground">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {past.map((event) => {
               const eventDate = new Date(event.date);
               const formattedDate = eventDate.toLocaleDateString();
               return (
                <div key={event.id} className="bg-card rounded-3xl border border-border/50 p-5 shadow-sm opacity-75 hover:opacity-100 transition-opacity flex flex-col justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{event.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button onClick={() => handleDelete(event.id)} className="text-xs text-destructive hover:underline">Delete</button>
                  </div>
                </div>
               );
            })}
          </div>
        </section>
      )}

      {/* Add Event Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card w-full max-w-md rounded-3xl border border-border shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-xl font-heading text-foreground">Add New Event</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Event Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dinner with Raj"
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                    <input 
                      type="date" 
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Location (Optional)</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Central Park"
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Event Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option>Date Night</option>
                    <option>Work/Office</option>
                    <option>Casual Outing</option>
                    <option>Party/Club</option>
                    <option>Wedding</option>
                    <option>Vacation</option>
                  </select>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
