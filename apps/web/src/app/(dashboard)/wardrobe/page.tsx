import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { WardrobeClient } from "@/components/wardrobe/WardrobeClient";

export const dynamic = "force-dynamic";

function InsightStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-light text-foreground mt-1">{value}</span>
    </div>
  );
}

export default async function WardrobePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wardrobeItems: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const closetItems = user.wardrobeItems || [];
  const totalItems = closetItems.length;
  const mostWornItem = [...closetItems].sort((a, b) => b.wornCount - a.wornCount)[0];
  const mostWornPercentage = totalItems > 0 && mostWornItem 
    ? Math.round((mostWornItem.wornCount / closetItems.reduce((acc, item) => acc + item.wornCount, 0)) * 100)
    : 0;
  const totalValue = closetItems.reduce((acc, item) => acc + item.price, 0);
  const totalWorn = closetItems.reduce((acc, item) => acc + item.wornCount, 0);
  const costPerWear = totalWorn > 0 ? (totalValue / totalWorn).toFixed(1) : totalValue.toFixed(1);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      <WardrobeClient initialItems={closetItems} />

      {/* Wardrobe Insights Footer */}
      <div className="bg-card border border-border/50 rounded-3xl p-8 mt-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">Wardrobe Insights</h3>
          <p className="text-sm text-muted-foreground">A summary of your closet's value and usage.</p>
        </div>
        
        <div className="flex items-center gap-8 md:gap-16 flex-wrap">
          <InsightStat label="Total Items" value={totalItems.toString()} />
          <InsightStat label="Most Worn" value={`${mostWornPercentage || 0}%`} />
          <InsightStat label="Cost Per Wear" value={`₹${costPerWear}`} />
          <InsightStat label="Wardrobe Value" value={`₹${totalValue.toLocaleString('en-IN')}`} />
          
          {/* Circular Health indicator */}
          <div className="flex items-center gap-3 border-l border-border pl-8">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Wardrobe Health</span>
              <span className="text-green-600 font-medium">Good</span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-muted)" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="283" strokeDashoffset="67" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-foreground">76%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
