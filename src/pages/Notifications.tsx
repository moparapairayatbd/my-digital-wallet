import { useEffect } from "react";
import { Bell, Check, Send, Download, Receipt, Gift, Shield, CreditCard, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNotifications } from "@/hooks/useWallet";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

const iconMap: Record<string, typeof Send> = {
  transaction: Download,
  promo: Gift,
  security: Shield,
  system: CreditCard,
};

const colorMap: Record<string, string> = {
  transaction: "bg-nitro-green/10 text-nitro-green",
  promo: "bg-nitro-orange/10 text-nitro-orange",
  security: "bg-nitro-pink/10 text-nitro-pink",
  system: "bg-nitro-blue/10 text-nitro-blue",
};

const Notifications = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useNotifications();
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;
  const filtered = filter === "all" ? notifications : notifications?.filter(n => n.type === filter);

  const markAllRead = async () => {
    if (!user || !notifications) return;
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .in("id", unreadIds);
    queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  const markRead = async (id: string) => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
  };

  // Mark all as read when leaving the page
  useEffect(() => {
    return () => {
      if (user && unreadCount > 0) {
        supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("user_id", user.id)
          .eq("is_read", false)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
          });
      }
    };
  }, [user, unreadCount, queryClient]);

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
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex gap-3 items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filtered && filtered.length > 0 ? (
          filtered.map((notif) => {
            const Icon = iconMap[notif.type] || Bell;
            const color = colorMap[notif.type] || "bg-muted text-muted-foreground";
            return (
              <Card key={notif.id} className={`cursor-pointer transition-all ${!notif.is_read ? "border-primary/30 bg-primary/[0.02]" : ""}`} onClick={() => !notif.is_read && markRead(notif.id)}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm ${!notif.is_read ? "font-semibold" : "font-medium"}`}>{notif.title}</p>
                        {!notif.is_read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{notif.message}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
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
