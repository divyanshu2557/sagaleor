import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { analyzeWardrobe } from "@/actions/analyze";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch upcoming occasions
  const upcomingOccasions = await prisma.occasion.findMany({
    where: { 
      userId: user.id,
      date: { gte: new Date() }
    },
    orderBy: { date: "asc" },
    take: 4
  });

  // Fetch recent trending posts from the community
  const recentPosts = await prisma.post.findMany({
    orderBy: [
      { likes: "desc" },
      { createdAt: "desc" }
    ],
    take: 6
  });

  // Fetch AI analysis
  let analysis = null;
  try {
    analysis = await analyzeWardrobe();
  } catch (err) {
    console.error("Failed to fetch wardrobe analysis:", err);
  }

  return (
    <DashboardClient 
      user={user}
      upcomingOccasions={upcomingOccasions}
      recentPosts={recentPosts}
      analysis={analysis}
    />
  );
}
