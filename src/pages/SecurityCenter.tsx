import { useState } from "react";
import { ArrowLeft, Fingerprint, Key, Monitor, Shield, ShieldAlert, ShieldCheck, Smartphone, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useActiveSessions, useProfile } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SecurityCenter = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const { data: sessions, isLoading: sessionsLoading } = useActiveSessions();
  const [togglingBiometric, setTogglingBiometric] = useState(false);
  const [toggling2FA, setToggling2FA] = useState(false);

  const handleToggleBiometric = async (val: boolean) => {
    if (!user) return;
    setTogglingBiometric(true);
    await supabase.from("profiles").update({ biometric_enabled: val }).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    setTogglingBiometric(false);
    toast.success(val ? t("Biometric enabled", "বায়োমেট্রিক সক্রিয়") : t("Biometric disabled", "বায়োমেট্রিক নিষ্ক্রিয়"));
  };

  const handleToggle2FA = async (val: boolean) => {
    if (!user) return;
    setToggling2FA(true);
    await supabase.from("profiles").update({ two_factor_enabled: val }).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    setToggling2FA(false);
    toast.success(val ? t("2FA enabled", "২FA সক্রিয়") : t("2FA disabled", "২FA নিষ্ক্রিয়"));
  };

  const handleEndSession = async (sessionId: string) => {
    if (!user) return;
    await supabase.from("active_sessions").delete().eq("id", sessionId).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["active_sessions", user.id] });
    toast.success(t("Session ended", "সেশন শেষ হয়েছে"));
  };

  const securityScore = [
    profile?.biometric_enabled ? 25 : 0,
    profile?.two_factor_enabled ? 25 : 0,
    profile?.kyc_status === "verified" ? 25 : 0,
    25, // base for having a PIN
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Security Center", "নিরাপত্তা কেন্দ্র")}</h1>
      </div>

      {profileLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : (
        <Card className="gradient-success text-primary-foreground border-0">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm opacity-80">{t("Security Score", "নিরাপত্তা স্কোর")}</p>
              <p className="text-3xl font-display font-bold">{securityScore}/100</p>
              <p className="text-xs opacity-70">{securityScore >= 75 ? t("Excellent", "চমৎকার") : securityScore >= 50 ? t("Good", "ভালো") : t("Needs Improvement", "উন্নতি প্রয়োজন")}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          <div className="flex items-center justify-between p-4 touch-target">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-nitro-orange" />
              <div>
                <p className="text-sm font-medium">{t("Change PIN", "PIN পরিবর্তন")}</p>
                <p className="text-xs text-muted-foreground">{t("Update your security PIN", "আপনার নিরাপত্তা PIN আপডেট করুন")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info(t("PIN change coming soon", "PIN পরিবর্তন শীঘ্রই আসছে"))}>
              {t("Change", "পরিবর্তন")}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 touch-target">
            <div className="flex items-center gap-3">
              <Fingerprint className="h-5 w-5 text-nitro-green" />
              <div>
                <p className="text-sm font-medium">{t("Biometric Login", "বায়োমেট্রিক লগইন")}</p>
                <p className="text-xs text-muted-foreground">{t("Fingerprint & Face ID", "ফিঙ্গারপ্রিন্ট ও ফেস আইডি")}</p>
              </div>
            </div>
            <Switch checked={!!profile?.biometric_enabled} disabled={togglingBiometric} onCheckedChange={handleToggleBiometric} />
          </div>
          <div className="flex items-center justify-between p-4 touch-target">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-nitro-blue" />
              <div>
                <p className="text-sm font-medium">{t("Two-Factor Auth", "টু-ফ্যাক্টর প্রমাণীকরণ")}</p>
                <p className="text-xs text-muted-foreground">{t("SMS verification", "এসএমএস যাচাইকরণ")}</p>
              </div>
            </div>
            <Switch checked={!!profile?.two_factor_enabled} disabled={toggling2FA} onCheckedChange={handleToggle2FA} />
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Active Sessions", "সক্রিয় সেশন")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {sessionsLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4"><Skeleton className="h-10 w-full" /></div>
              ))
            ) : sessions && sessions.length > 0 ? (
              sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 touch-target">
                  <div className="flex items-center gap-3">
                    {session.device.toLowerCase().includes("mobile") ? <Smartphone className="h-5 w-5 text-muted-foreground" /> : <Monitor className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.location || "Unknown"} • {new Date(session.last_active).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {session.is_current ? (
                    <Badge className="gradient-success text-primary-foreground border-0 text-[10px]">{t("Current", "বর্তমান")}</Badge>
                  ) : (
                    <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => handleEndSession(session.id)}>
                      {t("End", "শেষ")}
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No active sessions", "কোনো সক্রিয় সেশন নেই")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Button variant="destructive" className="w-full h-12" onClick={() => toast.info(t("Account block coming soon", "অ্যাকাউন্ট ব্লক শীঘ্রই আসছে"))}>
        {t("Block My Account", "আমার অ্যাকাউন্ট ব্লক করুন")}
      </Button>
    </div>
  );
};

export default SecurityCenter;
