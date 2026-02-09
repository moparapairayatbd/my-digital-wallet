import { useState } from "react";
import { Eye, EyeOff, Send, Download, HandCoins, PlusCircle, ArrowDownToLine, Receipt, Phone, QrCode, ArrowUpRight, ArrowDownLeft, ChevronRight, CreditCard, Globe, Wifi, TrendingUp, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { user, transactions, offers, spendingCategories } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SpendingInsights } from "@/components/dashboard/SpendingInsights";
import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { BankingPreview } from "@/components/dashboard/BankingPreview";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("Hello", "হ্যালো")}, {t(user.name.split(" ")[0], "রহিম")} 👋
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
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 touch-target">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-nitro-green/10" : "bg-nitro-pink/10"}`}>
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="h-4 w-4 text-nitro-green" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-nitro-pink" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(tx.title, tx.titleBn)}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.amount > 0 ? "text-nitro-green" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}৳{Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
