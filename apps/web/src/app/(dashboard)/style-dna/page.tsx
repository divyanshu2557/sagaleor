import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StyleDNAClient } from "@/components/styledna/StyleDNAClient";

export default async function StyleDNAPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      styleDna: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      
      {/* Header & Tabs */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-medium text-foreground">Your Style DNA</h1>
        </div>
        
        <div className="flex items-center justify-between border-b border-border text-sm font-medium overflow-x-auto scrollbar-hide">
          <button className="px-6 py-4 border-b-2 border-primary text-primary transition-colors whitespace-nowrap">OVERVIEW</button>
          <button className="px-6 py-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">ANALYSIS</button>
          <button className="px-6 py-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">PALETTE</button>
          <button className="px-6 py-4 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">PERSONALITY</button>
        </div>
      </div>

      <StyleDNAClient initialDna={user.styleDna} />

    </div>
  );
}
