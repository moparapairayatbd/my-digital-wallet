import { ArrowLeft, Download, FileText, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTransactions } from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function groupByMonth(txs: any[]) {
  const groups: Record<string, { totalIn: number; totalOut: number; count: number }> = {};
  txs.forEach((tx) => {
    const d = new Date(tx.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!groups[key]) groups[key] = { totalIn: 0, totalOut: 0, count: 0 };
    const isIn = tx.type === "receive" || tx.type === "add_money";
    if (isIn) groups[key].totalIn += Number(tx.amount);
    else groups[key].totalOut += Number(tx.amount);
    groups[key].count++;
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([key, val]) => {
      const [y, m] = key.split("-");
      const date = new Date(Number(y), Number(m) - 1);
      return {
        month: date.toLocaleDateString("en-US", { year: "numeric", month: "long" }),
        ...val,
      };
    });
}

const Statements = () => {
  const { t } = useLanguage();
  const { data: transactions, isLoading } = useTransactions();

  const statements = groupByMonth(transactions || []);
  const current = statements[0] || { totalIn: 0, totalOut: 0, count: 0, month: "—" };

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Statements", "স্টেটমেন্ট")}</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          <Card className="gradient-success text-primary-foreground border-0">
            <CardContent className="p-3 text-center">
              <TrendingUp className="h-4 w-4 mx-auto mb-1 opacity-80" />
              <p className="font-bold text-lg">৳{current.totalIn.toLocaleString()}</p>
              <p className="text-[10px] opacity-70">{t("Total In", "মোট আয়")}</p>
            </CardContent>
          </Card>
          <Card className="gradient-primary text-primary-foreground border-0">
            <CardContent className="p-3 text-center">
              <TrendingDown className="h-4 w-4 mx-auto mb-1 opacity-80" />
              <p className="font-bold text-lg">৳{current.totalOut.toLocaleString()}</p>
              <p className="text-[10px] opacity-70">{t("Total Out", "মোট ব্যয়")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 text-center">
              <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className={`font-bold text-lg ${current.totalIn - current.totalOut >= 0 ? "text-nitro-green" : "text-destructive"}`}>
                ৳{Math.abs(current.totalIn - current.totalOut).toLocaleString()}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("Net", "নেট")}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Monthly Statements", "মাসিক স্টেটমেন্ট")}</h2>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : statements.length > 0 ? (
          <div className="space-y-3">
            {statements.map((stmt, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between touch-target">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{stmt.month}</p>
                      <p className="text-xs text-muted-foreground">
                        {stmt.count} {t("transactions", "লেনদেন")} • {t("Net", "নেট")}: ৳{(stmt.totalIn - stmt.totalOut).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-9 w-9"
                    onClick={() => toast.success(t("Statement downloaded!", "স্টেটমেন্ট ডাউনলোড হয়েছে!"))}>
                    <Download className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-sm">
            {t("No transactions yet to generate statements", "স্টেটমেন্ট তৈরি করার জন্য এখনও কোনো লেনদেন নেই")}
          </div>
        )}
      </div>
    </div>
  );
};

export default Statements;
