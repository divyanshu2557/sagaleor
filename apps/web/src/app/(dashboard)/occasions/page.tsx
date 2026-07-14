import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { OccasionsClient } from "@/components/occasions/OccasionsClient";

export default async function OccasionsPage() {
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

  const occasions = await prisma.occasion.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
    include: {
      outfit: true,
    }
  });

  const outfits = await prisma.outfit.findMany({
    where: { userId: user.id },
    include: {
      items: true
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      <OccasionsClient occasions={occasions} outfits={outfits} />
    </div>
  );
}
