"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import {
  LayoutDashboard,
  Dna,
  Shirt,
  Sparkles,
  Compass,
  Layers,
  Calendar,
  Heart,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

const mainNavItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Style DNA", href: "/style-dna", icon: Dna },
  { name: "Wardrobe", href: "/wardrobe", icon: Shirt },
  { name: "AI Stylist", href: "/ai-stylist", icon: Sparkles },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Outfits", href: "/outfits", icon: Layers },
  { name: "Occasions", href: "/occasions", icon: Calendar },
  { name: "Saved", href: "/saved", icon: Heart },
  { name: "Community", href: "/community", icon: Users },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-sidebar h-screen flex flex-col pt-8 pb-6 px-4">
      <div className="mb-12 px-2">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} strokeWidth={isActive ? 2.5 : 2} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Mini */}
      <div className="mt-auto pt-6 border-t border-border px-2">
        <button className="flex items-center gap-3 w-full text-left rounded-xl p-2 hover:bg-secondary transition-colors">
          <div className="w-10 h-10 rounded-full bg-accent overflow-hidden shrink-0">
            {/* Placeholder for user avatar */}
            <img src="https://i.pravatar.cc/150?img=47" alt="User" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Suvreen</p>
            <p className="text-xs text-muted-foreground truncate">Premium Member</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
