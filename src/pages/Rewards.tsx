import { ArrowLeft, Award, ChevronRight, Gift, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { rewardsData } from "@/data/mockData";
import { Link } from "react-router-dom";

const tierColors = { Bronze: "bg-amber-700", Silver: "bg-slate-400", Gold: "bg-yellow-500", Platinum: "bg-slate-700" };

const Rewards = () => {
  const { t } = useLanguage();
  const progress = (rewardsData.points / rewardsData.nextTierPoints) * 100;

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Rewards", "রিওয়ার্ডস")}</h1>
      </div>

      {/* Points Balance */}
      <Card className="gradient-primary text-primary-foreground border-0 overflow-hidden relative">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-5 w-5" />
            <span className="text-sm opacity-80">{t("Your Points", "আপনার পয়েন্ট")}</span>
          </div>
          <p className="text-4xl font-display font-bold">{rewardsData.points.toLocaleString()}</p>
          <div className="mt-4">
            <div className="flex justify-between text-xs opacity-80 mb-1">
              <span>{rewardsData.tier}</span>
              <span>{rewardsData.nextTier}</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs opacity-60 mt-1">{rewardsData.nextTierPoints - rewardsData.points} points to {rewardsData.nextTier}</p>
          </div>
          <div className="absolute -right-6 -bottom-6 h-32 w-32 rounded-full bg-white/10" />
        </CardContent>
      </Card>

      {/* Redeemable */}
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
                  disabled={rewardsData.points < item.points}>
                  {t("Redeem", "রিডিম")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Points History", "পয়েন্ট ইতিহাস")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {rewardsData.history.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 touch-target">
                <div>
                  <p className="text-sm font-medium">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date}</p>
                </div>
                <span className={`font-semibold text-sm ${item.points > 0 ? "text-nitro-green" : "text-nitro-pink"}`}>
                  {item.points > 0 ? "+" : ""}{item.points}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* How to earn */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-3">{t("How to Earn More", "আরও আয় করুন")}</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Send money → 5 points per transaction</p>
            <p>• Pay bills → 10 points per bill</p>
            <p>• Refer friends → 100 points per referral</p>
            <p>• Daily login → 5 points</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
