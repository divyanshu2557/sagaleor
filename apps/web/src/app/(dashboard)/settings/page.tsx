import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { SettingsDashboard } from "@/components/settings/SettingsDashboard";
import { getUserOrders } from "@/actions/orders";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  // Fetch latest user data directly
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    redirect("/login");
  }

  // Use the server action we created
  const ordersResponse = await getUserOrders();
  const orders = ordersResponse.orders || [];

  const initialUser = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    theme: user.theme,
    language: user.language,
    aiPersonalize: user.aiPersonalize,
    shareData: user.shareData,
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and orders.</p>
      </div>

      {/* Profile Header */}
      <div className="bg-card rounded-3xl border border-border/50 p-6 shadow-sm flex items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
          <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.name}`} alt={user.name} className="w-full h-full object-cover bg-secondary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xl font-medium text-foreground truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground mt-1 truncate">{user.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs text-primary bg-primary/10 px-2.5 py-0.5 rounded-full font-medium">Verified Member</span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">Since {new Date(user.createdAt).getFullYear()}</span>
          </div>
        </div>
      </div>

      <SettingsDashboard initialUser={initialUser} initialOrders={orders} />
    </div>
  );
}
