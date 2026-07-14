import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OutfitsClient } from "@/components/outfits/OutfitsClient";

export default async function OutfitsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch user with outfits and wardrobe items
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      outfits: {
        include: {
          items: true // Include the wardrobe items for each outfit
        },
        orderBy: { createdAt: "desc" }
      },
      wardrobeItems: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <OutfitsClient 
        initialOutfits={user.outfits || []} 
        wardrobeItems={user.wardrobeItems || []} 
      />
    </div>
  );
}
