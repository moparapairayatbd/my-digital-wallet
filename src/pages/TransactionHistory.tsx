import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, ArrowDownLeft, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const PAGE_SIZE = 20;
const filters = ["all", "send", "receive", "bill_pay", "cashout", "add_money", "recharge"] as const;

function groupByDate(txs: any[]) {
  const groups: Record<string, any[]> = {};
  txs.forEach((tx) => {
    const date = new Date(tx.created_at).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
  });
  return Object.entries(groups).sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime());
}

const TransactionHistory = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Pull-to-refresh state
  const [pullY, setPullY] = useState(0);
  const [pulling, setPulling] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["transactions-infinite", user?.id, filter],
    queryFn: async ({ pageParam = 0 }) => {
      if (!user) return [];
      let query = supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(pageParam, pageParam + PAGE_SIZE - 1);

      if (filter !== "all") {
        query = query.eq("type", filter as any);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.flat().length;
    },
    initialPageParam: 0,
    enabled: !!user,
  });

  const allTransactions = data?.pages.flat() || [];
  const grouped = groupByDate(allTransactions);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Pull-to-refresh touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollTop = containerRef.current?.scrollTop || 0;
    if (scrollTop <= 0) {
      touchStartY.current = e.touches[0].clientY;
      setPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling) return;
    const diff = e.touches[0].clientY - touchStartY.current;
    if (diff > 0) {
      setPullY(Math.min(diff * 0.4, 80));
    }
  }, [pulling]);

  const handleTouchEnd = useCallback(async () => {
    if (pullY > 50) {
      setIsRefreshing(true);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["wallet", user?.id] });
      setIsRefreshing(false);
    }
    setPullY(0);
    setPulling(false);
  }, [pullY, refetch, queryClient, user?.id]);

  return (
    <div
      ref={containerRef}
      className="max-w-2xl mx-auto page-enter space-y-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull-to-refresh indicator */}
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200"
        style={{ height: pullY > 0 ? pullY : 0, opacity: pullY > 10 ? 1 : 0 }}
      >
        <RefreshCw className={`h-5 w-5 text-primary ${isRefreshing || pullY > 50 ? "animate-spin" : ""}`} style={{ transform: `rotate(${pullY * 3}deg)` }} />
      </div>

      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Transaction History", "লেনদেনের ইতিহাস")}</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
            className={`flex-shrink-0 ${filter === f ? "gradient-primary text-primary-foreground" : ""}`}
            onClick={() => setFilter(f)}>
            {f === "all" ? t("All", "সব") : f.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}
          </Button>
        ))}
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : grouped.length > 0 ? (
        <div className="space-y-4">
          {grouped.map(([date, txs]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-muted-foreground sticky top-14 bg-background py-1 z-10">{date}</p>
              <Card>
                <CardContent className="p-0 divide-y divide-border">
                  {txs.map((tx: any) => {
                    const isIncome = tx.type === "receive" || tx.type === "add_money";
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 touch-target">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isIncome ? "bg-nitro-green/10" : "bg-nitro-pink/10"}`}>
                            {isIncome ? <ArrowDownLeft className="h-4 w-4 text-nitro-green" /> : <ArrowUpRight className="h-4 w-4 text-nitro-pink" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium capitalize">{tx.type.replace("_", " ")}</p>
                            <p className="text-xs text-muted-foreground">
                              {tx.description || (tx.recipient_phone ? `→ ${tx.recipient_phone}` : tx.sender_name ? `← ${tx.sender_name}` : "")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-semibold text-sm ${isIncome ? "text-nitro-green" : ""}`}>
                            {isIncome ? "+" : "-"}৳{Number(tx.amount).toLocaleString()}
                          </span>
                          <Badge variant="outline" className="ml-2 text-[10px] capitalize">{tx.status}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="flex justify-center py-4">
            {isFetchingNextPage ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : hasNextPage ? (
              <p className="text-xs text-muted-foreground">{t("Scroll for more", "আরো দেখতে স্ক্রোল করুন")}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{t("No more transactions", "আর কোনো লেনদেন নেই")}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          {t("No transactions found", "কোনো লেনদেন পাওয়া যায়নি")}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
