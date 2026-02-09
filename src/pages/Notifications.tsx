import { useState } from "react";
import { Bell, Check, ChevronRight, CreditCard, Send, Download, Receipt, Gift, Shield, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Notification {
  id: string;
  type: "transaction" | "promo" | "security" | "system";
  title: string;
  titleBn: string;
  message: string;
  time: string;
  read: boolean;
  icon: typeof Send;
  color: string;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "transaction", title: "Money Received", titleBn: "টাকা প্রাপ্তি", message: "৳2,000 received from 01911-556677", time: "2 min ago", read: false, icon: Download, color: "bg-nitro-green/10 text-nitro-green" },
  { id: "n2", type: "promo", title: "20% Cashback!", titleBn: "২০% ক্যাশব্যাক!", message: "Get 20% cashback on mobile recharge above ৳100", time: "1 hour ago", read: false, icon: Gift, color: "bg-nitro-orange/10 text-nitro-orange" },
  { id: "n3", type: "transaction", title: "Bill Payment Success", titleBn: "বিল পেমেন্ট সফল", message: "Electricity bill ৳1,250 paid successfully", time: "3 hours ago", read: true, icon: Receipt, color: "bg-nitro-blue/10 text-nitro-blue" },
  { id: "n4", type: "security", title: "Login Alert", titleBn: "লগইন সতর্কতা", message: "New login detected from Dhaka, BD", time: "5 hours ago", read: true, icon: Shield, color: "bg-nitro-pink/10 text-nitro-pink" },
  { id: "n5", type: "transaction", title: "Money Sent", titleBn: "টাকা পাঠানো", message: "৳500 sent to 01811-223344", time: "Yesterday", read: true, icon: Send, color: "bg-nitro-purple/10 text-nitro-purple" },
  { id: "n6", type: "system", title: "Card Ready", titleBn: "কার্ড প্রস্তুত", message: "Your virtual card is now active and ready to use", time: "2 days ago", read: true, icon: CreditCard, color: "bg-nitro-teal/10 text-nitro-teal" },
  { id: "n7", type: "promo", title: "Free Transfer Weekend", titleBn: "ফ্রি ট্রান্সফার উইকেন্ড", message: "Send money for free this weekend!", time: "3 days ago", read: true, icon: Gift, color: "bg-nitro-orange/10 text-nitro-orange" },
];

const Notifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("Notifications", "নোটিফিকেশন")}</h1>
          <p className="text-muted-foreground text-sm">
            {unreadCount > 0 ? t(`${unreadCount} unread`, `${unreadCount}টি অপঠিত`) : t("All caught up!", "সব পড়া হয়েছে!")}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}><Check className="h-4 w-4 mr-1" /> {t("Mark all read", "সব পঠিত")}</Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">{t("All", "সব")}</TabsTrigger>
          <TabsTrigger value="transaction">{t("Transactions", "লেনদেন")}</TabsTrigger>
          <TabsTrigger value="promo">{t("Promos", "প্রমো")}</TabsTrigger>
          <TabsTrigger value="security">{t("Security", "নিরাপত্তা")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.map((notif) => (
          <Card key={notif.id} className={`cursor-pointer transition-all ${!notif.read ? "border-primary/30 bg-primary/[0.02]" : ""}`} onClick={() => markRead(notif.id)}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                  <notif.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!notif.read ? "font-semibold" : "font-medium"}`}>{t(notif.title, notif.titleBn)}</p>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.message}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{notif.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{t("No notifications", "কোনো নোটিফিকেশন নেই")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
