import { ArrowLeft, Copy, Share2, Users, Trophy, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { user, referralData } from "@/data/mockData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const steps = [
  { icon: Share2, title: "Share Your Code", titleBn: "কোড শেয়ার করুন", desc: "Share your unique referral code with friends" },
  { icon: Users, title: "Friend Joins", titleBn: "বন্ধু যোগ দেয়", desc: "Your friend signs up using your code" },
  { icon: Gift, title: "Both Earn ৳100", titleBn: "দুজনে ৳১০০ পান", desc: "You and your friend each get ৳100 bonus" },
];

const ReferEarn = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Refer & Earn", "রেফার ও আয়")}</h1>
      </div>

      {/* Referral Code Card */}
      <Card className="gradient-secondary text-primary-foreground border-0">
        <CardContent className="p-6 text-center">
          <p className="text-sm opacity-80 mb-2">{t("Your Referral Code", "আপনার রেফারেল কোড")}</p>
          <div className="bg-white/20 rounded-xl py-3 px-6 inline-block">
            <p className="text-2xl font-mono font-bold tracking-widest">{user.referralCode}</p>
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground gap-2 border-0"
              onClick={() => { navigator.clipboard.writeText(user.referralCode); toast.success("Copied!"); }}>
              <Copy className="h-4 w-4" /> {t("Copy", "কপি")}
            </Button>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground gap-2 border-0">
              <Share2 className="h-4 w-4" /> {t("Share", "শেয়ার")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("Referred", "রেফার"), value: referralData.totalReferred },
          { label: t("Earned", "আয়"), value: `৳${referralData.totalEarned}` },
          { label: t("Pending", "মুলতুবি"), value: `৳${referralData.pendingRewards}` },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How it works */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("How It Works", "কিভাবে কাজ করে")}</h2>
        <Card>
          <CardContent className="p-4 space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{t(step.title, step.titleBn)}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {i < steps.length - 1 && <div className="absolute left-8 mt-10 h-4 w-px bg-border" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Leaderboard", "লিডারবোর্ড")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {referralData.leaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center gap-3 p-4 touch-target">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  entry.rank <= 3 ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {entry.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.referrals} referrals</p>
                </div>
                <span className="text-sm font-semibold text-nitro-green">৳{entry.earned}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferEarn;
