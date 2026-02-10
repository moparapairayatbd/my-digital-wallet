import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTransactions } from "@/hooks/useWallet";
import { ArrowUpRight, ArrowDownLeft, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
  const { data: transactions, isLoading } = useTransactions();
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? (transactions || []) : (transactions || []).filter((tx: any) => tx.type === filter);
  const grouped = groupByDate(filtered);

  return (
    <div className="max-w-2xl mx-auto page-enter space-y-6">
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
