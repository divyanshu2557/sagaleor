"use client";

import { Search, Bell } from "lucide-react";

export function Header() {
  return (
    <header className="h-20 flex items-center justify-between px-8 bg-transparent">
      {/* Title / Greeting Area - leaving empty as it will be handled by the page content usually, or we can add breadcrumbs here */}
      <div className="flex-1"></div>

      {/* Right side actions */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything..."
            className="pl-10 pr-4 py-2 rounded-full bg-card border border-border text-sm focus:outline-none focus:ring-1 focus:ring-ring w-64 transition-shadow shadow-sm"
          />
        </div>
        
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors text-foreground">
          <Bell className="w-5 h-5" />
          {/* Notification Dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </button>
      </div>
    </header>
  );
}
