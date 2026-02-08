import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { transactions } from "@/data/mockData";
import { ArrowUpRight, ArrowDownLeft, Filter } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const filters = ["all", "send", "receive", "payment", "cashout", "add", "recharge"] as const;

const monthlyData = [
  { month: "Sep", income: 8500, expense: 6200 },
  { month: "Oct", income: 12000, expense: 9800 },
  { month: "Nov", income: 9200, expense: 7400 },
  { month: "Dec", income: 15000, expense: 11200 },
  { month: "Jan", income: 11500, expense: 8900 },
  { month: "Feb", income: 14000, expense: 7100 },
];

const TransactionHistory = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<typeof filters[number]>("all");

  const filtered = filter === "all" ? transactions : transactions.filter(tx => tx.type === filter);

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Transaction History", "লেনদেনের ইতিহাস")}</h1>

      {/* Monthly Chart */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">{t("Monthly Summary", "মাসিক সারাংশ")}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="income" fill="hsl(152, 68%, 45%)" radius={[4, 4, 0, 0]} name={t("Income", "আয়")} />
              <Bar dataKey="expense" fill="hsl(330, 85%, 52%)" radius={[4, 4, 0, 0]} name={t("Expense", "ব্যয়")} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center text-xs">
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-sm bg-nitro-green" />{t("Income", "আয়")}</div>
            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-sm bg-primary" />{t("Expense", "ব্যয়")}</div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
            className={filter === f ? "gradient-primary text-primary-foreground" : ""}
            onClick={() => setFilter(f)}>
            {f === "all" ? t("All", "সব") : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      {/* List */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {filtered.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-nitro-green/10" : "bg-nitro-pink/10"}`}>
                  {tx.amount > 0 ? <ArrowDownLeft className="h-4 w-4 text-nitro-green" /> : <ArrowUpRight className="h-4 w-4 text-nitro-pink" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{t(tx.title, tx.titleBn)}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} {tx.to && `→ ${tx.to}`}{tx.from && `← ${tx.from}`}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-semibold text-sm ${tx.amount > 0 ? "text-nitro-green" : ""}`}>
                  {tx.amount > 0 ? "+" : ""}৳{Math.abs(tx.amount).toLocaleString()}
                </span>
                <Badge variant="outline" className="ml-2 text-[10px]">{tx.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
