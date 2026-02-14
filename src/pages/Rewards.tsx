import { ArrowLeft, Award, Gift, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRewards, useRewardHistory } from "@/hooks/useWallet";
import { rewardsData } from "@/data/mockData";
import { Link } from "react-router-dom";

const tierOrder = ["bronze", "silver", "gold", "platinum"];
const tierLabels: Record<string, string> = { bronze: "Bronze", silver: "Silver", gold: "Gold", platinum: "Platinum" };
const tierThresholds: Record<string, number> = { bronze: 1000, silver: 5000, gold: 15000, platinum: 50000 };

const Rewards = () => {
  const { t } = useLanguage();
  const { data: rewards, isLoading } = useRewards();
  const { data: history, isLoading: historyLoading } = useRewardHistory();

  const points = rewards?.points ?? 0;
  const tier = rewards?.tier ?? "bronze";
  const totalEarned = rewards?.total_earned ?? 0;
  const totalRedeemed = rewards?.total_redeemed ?? 0;
  const nextTierIdx = Math.min(tierOrder.indexOf(tier) + 1, tierOrder.length - 1);
  const nextTier = tierOrder[nextTierIdx];
  const nextTierPoints = tierThresholds[nextTier] || 50000;
  const progress = Math.min((totalEarned / nextTierPoints) * 100, 100);

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-6 p-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Rewards", "রিওয়ার্ডস")}</h1>
      </div>

      <Card className="gradient-primary text-primary-foreground border-0 overflow-hidden relative">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5" />
            <span className="text-sm opacity-80">{t("Your Points", "আপনার পয়েন্ট")}</span>
          </div>
          <p className="text-4xl font-display font-bold">{points.toLocaleString()}</p>
          <p className="text-xs opacity-60 mt-1">{t("Total Earned", "মোট অর্জিত")}: {totalEarned} • {t("Redeemed", "রিডিম")}: {totalRedeemed}</p>
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span className="capitalize">{tier}</span>
              <span className="capitalize">{nextTier}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs opacity-60 mt-1">{Math.max(0, nextTierPoints - totalEarned)} {t("points to", "পয়েন্ট বাকি")} {tierLabels[nextTier]}</p>
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10" />
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Redeem Points", "পয়েন্ট রিডিম করুন")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {rewardsData.redeemable.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm font-medium">{t(item.title, item.titleBn)}</p>
                <p className="text-xs text-primary font-semibold mt-1">{item.points} pts</p>
                <Button size="sm" className="mt-2 w-full h-9 text-xs gradient-primary text-primary-foreground border-0"
                  disabled={points < item.points}>
                  {t("Redeem", "রিডিম")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Points History", "পয়েন্ট ইতিহাস")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {historyLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4"><Skeleton className="h-5 w-full" /></div>
              ))
            ) : history && history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 touch-target">
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-semibold text-sm ${item.type === "earned" ? "text-nitro-green" : "text-nitro-pink"}`}>
                    {item.type === "earned" ? "+" : "-"}{item.points}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No reward history yet", "এখনও কোনো রিওয়ার্ড ইতিহাস নেই")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">{t("How to Earn More", "আরও আয় করুন")}</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• {t("Send money → 5 points per transaction", "টাকা পাঠান → প্রতি লেনদেনে ৫ পয়েন্ট")}</p>
            <p>• {t("Pay bills → 10 points per bill", "বিল পে → প্রতি বিলে ১০ পয়েন্ট")}</p>
            <p>• {t("Refer friends → 100 points per referral", "বন্ধু রেফার → প্রতি রেফারেলে ১০০ পয়েন্ট")}</p>
            <p>• {t("Daily login → 5 points", "দৈনিক লগইন → ৫ পয়েন্ট")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
