import { ArrowLeft, Copy, Share2, Users, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile, useReferrals } from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const steps = [
  { icon: Share2, title: "Share Your Code", titleBn: "কোড শেয়ার করুন", desc: "Share your unique referral code with friends" },
  { icon: Users, title: "Friend Joins", titleBn: "বন্ধু যোগ দেয়", desc: "Your friend signs up using your code" },
  { icon: Gift, title: "Both Earn ৳100", titleBn: "দুজনে ৳১০০ পান", desc: "You and your friend each get ৳100 bonus" },
];

const ReferEarn = () => {
  const { t } = useLanguage();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: referrals, isLoading: referralsLoading } = useReferrals();

  const referralCode = profile?.referral_code || "---";
  const totalReferred = referrals?.length || 0;
  const completedReferrals = referrals?.filter(r => r.status === "completed") || [];
  const totalEarned = completedReferrals.reduce((sum, r) => sum + Number(r.reward_amount || 0), 0);
  const pendingCount = referrals?.filter(r => r.status === "pending")?.length || 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Join Nitrozix!", text: `Use my referral code ${referralCode} to get ৳100 bonus!`, url: window.location.origin });
    } else {
      navigator.clipboard.writeText(`Join Nitrozix with my code: ${referralCode}`);
      toast.success(t("Link copied!", "লিংক কপি হয়েছে!"));
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Refer & Earn", "রেফার ও আয়")}</h1>
      </div>

      {profileLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        <Card className="gradient-secondary text-primary-foreground border-0">
          <CardContent className="p-6 text-center">
            <p className="text-sm opacity-80 mb-2">{t("Your Referral Code", "আপনার রেফারেল কোড")}</p>
            <div className="bg-white/20 rounded-xl py-3 px-6 inline-block">
              <p className="text-2xl font-mono font-bold tracking-widest">{referralCode}</p>
            </div>
            <div className="flex gap-3 mt-4 justify-center">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground gap-2 border-0"
                onClick={() => { navigator.clipboard.writeText(referralCode); toast.success("Copied!"); }}>
                <Copy className="h-4 w-4" /> {t("Copy", "কপি")}
              </Button>
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground gap-2 border-0" onClick={handleShare}>
                <Share2 className="h-4 w-4" /> {t("Share", "শেয়ার")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("Referred", "রেফার"), value: totalReferred },
          { label: t("Earned", "আয়"), value: `৳${totalEarned}` },
          { label: t("Pending", "মুলতুবি"), value: pendingCount },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-3 text-center">
              <p className="text-xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

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
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Referral history */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Referral History", "রেফারেল ইতিহাস")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {referralsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4"><Skeleton className="h-8 w-full" /></div>
              ))
            ) : referrals && referrals.length > 0 ? (
              referrals.map((ref) => (
                <div key={ref.id} className="flex items-center justify-between p-4 touch-target">
                  <div>
                    <p className="text-sm font-medium">{ref.referred_phone}</p>
                    <p className="text-xs text-muted-foreground">{new Date(ref.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ref.status === "completed" ? "bg-nitro-green/10 text-nitro-green" : "bg-nitro-orange/10 text-nitro-orange"}`}>
                      {ref.status}
                    </span>
                    {ref.status === "completed" && (
                      <p className="text-xs text-nitro-green mt-0.5">+৳{Number(ref.reward_amount || 0)}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No referrals yet. Start sharing!", "এখনও কোনো রেফারেল নেই। শেয়ার করুন!")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReferEarn;
