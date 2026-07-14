import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SavedClient } from "@/components/saved/SavedClient";

export const dynamic = "force-dynamic";

export default async function SavedPage() {
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

  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    include: {
      items: true
    },
    orderBy: { createdAt: "desc" }
  });

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: user.id },
    include: {
      collection: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      <SavedClient collections={collections} savedItems={savedItems} />
    </div>
  );
}
