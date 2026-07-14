import { TrendingUp, Heart, MessageCircle, Share2, MoreHorizontal, Users, Award, Flame } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CommunityClient } from "@/components/community/CommunityClient";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { following: { select: { id: true } } }
  });

  // Fetch real posts from the database
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true },
      },
      comments: {
        include: {
          user: { select: { name: true } }
        },
        orderBy: { createdAt: "asc" }
      }
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">

      {/* Header */}
      <div>
        <h1 className="text-3xl text-foreground mb-2">Community</h1>
        <p className="text-muted-foreground">Connect with fashion lovers, share your looks, and discover inspiration.</p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-heading text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>



      {/* Feed Component */}
      <CommunityClient 
        initialPosts={posts} 
        currentUserId={currentUser?.id || null} 
        initialFollowingIds={currentUser?.following?.map(f => f.id) || []}
      />

    </div>
  );
}

const stats = [
  { label: "Style Score", value: "840", icon: Award },
  { label: "Followers", value: "1.2k", icon: Users },
  { label: "Following", value: "248", icon: Users },
  { label: "Daily Streak", value: "12", icon: Flame },
];
