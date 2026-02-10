import { ArrowUpRight, ArrowDownLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile, useTransactions } from "@/hooks/useWallet";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { offers } from "@/data/mockData";
import { SpendingInsights } from "@/components/dashboard/SpendingInsights";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { BankingPreview } from "@/components/dashboard/BankingPreview";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { t } = useLanguage();
  const { data: profile } = useProfile();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  const firstName = profile?.full_name?.split(" ")[0] || "User";

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("Hello", "হ্যালো")}, {firstName} 👋
        </h1>
        <p className="text-muted-foreground text-sm">{t("Welcome back to Nitrozix", "নাইট্রোজিক্সে স্বাগতম")}</p>
      </div>

      <BalanceCard />
      <QuickActions />
      <BankingPreview />
      <SpendingInsights />

      {/* Offers Carousel */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Offers & Promotions", "অফার ও প্রমোশন")}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide">
          {offers.map((offer) => (
            <Card key={offer.id} className={`min-w-[280px] snap-start ${offer.color} text-primary-foreground border-0 flex-shrink-0`}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm">{t(offer.title, offer.titleBn)}</h3>
                <p className="text-xs opacity-80 mt-1">{offer.description}</p>
                <p className="text-[10px] opacity-60 mt-2">{t("Valid till", "কার্যকর")}: {offer.validTill}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">{t("Recent Transactions", "সাম্প্রতিক লেনদেন")}</h2>
          <Link to="/history" className="text-sm text-primary font-medium flex items-center gap-1">
            {t("See All", "সব দেখুন")} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {txLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-3 items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : transactions && transactions.length > 0 ? (
              transactions.slice(0, 5).map((tx) => {
                const isIncome = tx.type === "receive" || tx.type === "add_money";
                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 touch-target">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isIncome ? "bg-nitro-green/10" : "bg-nitro-pink/10"}`}>
                        {isIncome ? (
                          <ArrowDownLeft className="h-4 w-4 text-nitro-green" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-nitro-pink" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium capitalize">{tx.type.replace("_", " ")}</p>
                        <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`font-semibold text-sm ${isIncome ? "text-nitro-green" : "text-foreground"}`}>
                      {isIncome ? "+" : "-"}৳{Number(tx.amount).toLocaleString()}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No transactions yet. Start by sending or adding money!", "এখনো কোনো লেনদেন নেই।")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
