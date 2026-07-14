"use client";

import React, { useState, useTransition } from "react";
import { User, Bell, Shield, Palette, Globe, CreditCard, HelpCircle, Sun, Moon, Smartphone, Package, Truck, CheckCircle, PackageSearch, RefreshCw } from "lucide-react";
import { updateUserSettings } from "@/actions/user";
import { createMockOrder } from "@/actions/orders";
import { useRouter } from "next/navigation";

type UserData = {
  name: string;
  email: string;
  phone?: string | null;
  theme: string;
  language: string;
  aiPersonalize: boolean;
  shareData: boolean;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

type OrderData = {
  id: string;
  total: number;
  status: string;
  trackingNumber?: string | null;
  createdAt: Date;
  items: OrderItem[];
};

export function SettingsDashboard({ 
  initialUser, 
  initialOrders 
}: { 
  initialUser: UserData; 
  initialOrders: OrderData[];
}) {
  const [activeTab, setActiveTab] = useState<"account" | "preferences" | "orders">("account");
  const [user, setUser] = useState<UserData>(initialUser);
  const [isPending, startTransition] = useTransition();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = (field: keyof UserData, value: any) => {
    // Optimistic update
    setUser(prev => ({ ...prev, [field]: value }));
    
    // Server update
    startTransition(() => {
      updateUserSettings({ [field]: value });
    });
  };

  const handleCreateMockOrder = () => {
    startTransition(async () => {
      await createMockOrder();
      router.refresh(); // Refresh page to get the new order from server
    });
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-border/50 pb-px overflow-x-auto no-scrollbar">
        <TabButton 
          active={activeTab === "account"} 
          onClick={() => setActiveTab("account")} 
          icon={User} 
          label="Account" 
        />
        <TabButton 
          active={activeTab === "preferences"} 
          onClick={() => setActiveTab("preferences")} 
          icon={Palette} 
          label="Preferences" 
        />
        <TabButton 
          active={activeTab === "orders"} 
          onClick={() => setActiveTab("orders")} 
          icon={PackageSearch} 
          label="Orders & Tracking" 
        />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        
        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SettingsSection title="Personal Information">
              <div className="p-5 space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <input 
                    type="text" 
                    value={user.name} 
                    onChange={(e) => handleUpdate("name", e.target.value)}
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    value={user.email} 
                    disabled
                    className="w-full bg-secondary/30 border border-border/50 rounded-xl px-4 py-2.5 text-sm text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                  <input 
                    type="tel" 
                    value={user.phone || ""} 
                    onChange={(e) => handleUpdate("phone", e.target.value)}
                    placeholder="+91"
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </SettingsSection>
            
            <SettingsSection title="Security">
              <SettingsItem icon={Shield} label="Password" description="Change your password" action={<span className="text-primary text-sm font-medium hover:underline cursor-pointer">Update</span>} />
              <SettingsItem icon={CreditCard} label="Payment Methods" description="Manage saved cards" action={<span className="text-primary text-sm font-medium hover:underline cursor-pointer">Manage</span>} />
            </SettingsSection>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <SettingsSection title="Display & Language">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Theme</p>
                    <p className="text-xs text-muted-foreground">Select your interface theme</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                  <button 
                    onClick={() => handleUpdate("theme", "light")}
                    className={`p-2 rounded-lg transition-colors ${user.theme === 'light' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleUpdate("theme", "dark")}
                    className={`p-2 rounded-lg transition-colors ${user.theme === 'dark' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleUpdate("theme", "system")}
                    className={`p-2 rounded-lg transition-colors ${user.theme === 'system' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-5 py-4 border-t border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Language & Region</p>
                    <p className="text-xs text-muted-foreground">Select your locale</p>
                  </div>
                </div>
                <select 
                  value={user.language}
                  onChange={(e) => handleUpdate("language", e.target.value)}
                  className="bg-secondary/50 border border-border/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-IN">English (India)</option>
                  <option value="fr-FR">Français</option>
                  <option value="hi-IN">Hindi</option>
                </select>
              </div>
            </SettingsSection>

            <SettingsSection title="Privacy & Data">
              <div className="px-5 py-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">AI Personalization</p>
                      <p className="text-xs text-muted-foreground">Allow AI to learn from your style choices</p>
                    </div>
                  </div>
                  <Toggle active={user.aiPersonalize} onChange={(v) => handleUpdate("aiPersonalize", v)} />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Share Style Data</p>
                      <p className="text-xs text-muted-foreground">Anonymous sharing for community trends</p>
                    </div>
                  </div>
                  <Toggle active={user.shareData} onChange={(v) => handleUpdate("shareData", v)} />
                </div>
              </div>
            </SettingsSection>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {initialOrders.length === 0 ? (
              <div className="bg-card rounded-3xl border border-border/50 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">When you make a purchase, your order history and tracking information will appear here.</p>
                <button 
                  onClick={handleCreateMockOrder}
                  disabled={isPending}
                  className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
                  Generate Mock Order
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {initialOrders.map((order) => (
                  <div key={order.id} className="bg-card rounded-3xl border border-border/50 overflow-hidden">
                    {/* Order Header */}
                    <div 
                      className="p-5 flex items-center justify-between cursor-pointer hover:bg-secondary/20 transition-colors"
                      onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-medium text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                            order.status === 'Delivered' ? 'bg-green-500/10 text-green-500' :
                            order.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                            order.status === 'Shipped' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">₹{order.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Order Details & Tracking (Expanded) */}
                    {expandedOrderId === order.id && (
                      <div className="border-t border-border/50 bg-secondary/10 p-5 animate-in slide-in-from-top-2 duration-200">
                        
                        {/* Tracking Timeline */}
                        {order.trackingNumber && (
                          <div className="mb-8">
                            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                              <Truck className="w-4 h-4" /> 
                              Tracking: <span className="font-mono text-primary">{order.trackingNumber}</span>
                            </h4>
                            <div className="relative">
                              {/* Track Line */}
                              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border"></div>
                              
                              <div className="space-y-6">
                                <TrackingStep 
                                  title="Order Placed" 
                                  date={new Date(order.createdAt).toLocaleDateString()} 
                                  completed={true} 
                                />
                                <TrackingStep 
                                  title="Processing" 
                                  date="In Progress" 
                                  completed={order.status === 'Processing' || order.status === 'Shipped' || order.status === 'Delivered'} 
                                  active={order.status === 'Processing'}
                                />
                                <TrackingStep 
                                  title="Shipped" 
                                  date="Pending" 
                                  completed={order.status === 'Shipped' || order.status === 'Delivered'} 
                                  active={order.status === 'Shipped'}
                                />
                                <TrackingStep 
                                  title="Delivered" 
                                  date="Pending" 
                                  completed={order.status === 'Delivered'} 
                                  active={order.status === 'Delivered'}
                                  isLast
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Items */}
                        <h4 className="text-sm font-medium mb-3">Items in this order</h4>
                        <div className="space-y-3">
                          {order.items.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-card border border-border/50 rounded-xl p-3">
                              {item.imageUrl ? (
                                <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? "text-primary" : ""}`} />
      {label}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
      )}
    </button>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border/50 bg-secondary/20">
        <h3 className="font-medium text-foreground">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingsItem({ icon: Icon, label, description, action }: { icon: any, label: string, description: string, action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 last:border-0">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-foreground">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

function Toggle({ active, onChange }: { active: boolean; onChange: (val: boolean) => void }) {
  return (
    <div 
      className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-primary' : 'bg-muted'}`}
      onClick={() => onChange(!active)}
    >
      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${active ? 'left-[22px]' : 'left-0.5'}`}></div>
    </div>
  );
}

function TrackingStep({ title, date, completed, active, isLast }: { title: string; date: string; completed: boolean; active?: boolean; isLast?: boolean }) {
  return (
    <div className="flex gap-4 relative z-10">
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-card ${
          completed 
            ? 'border-primary text-primary' 
            : active 
              ? 'border-primary border-dashed text-primary/70' 
              : 'border-border text-muted-foreground'
        }`}>
          {completed ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
        </div>
      </div>
      <div className={`pb-2 ${!isLast ? 'min-h-[2rem]' : ''}`}>
        <p className={`text-sm font-medium ${completed || active ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
    </div>
  );
}
