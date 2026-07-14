import prisma from "@/lib/prisma";
import { DiscoverClient } from "@/components/discover/DiscoverClient";

export default async function DiscoverPage() {
  // Fetch real trending posts from the database (most liked)
  const trendingPosts = await prisma.post.findMany({
    orderBy: [
      { likes: "desc" },
      { createdAt: "desc" }
    ],
    include: {
      user: {
        select: { name: true }
      }
    },
    take: 12
  });

  return (
    <DiscoverClient trendingPosts={trendingPosts} />
  );
}
