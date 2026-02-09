import { useState } from "react";
import { ArrowLeft, Fingerprint, Key, Monitor, Shield, ShieldAlert, ShieldCheck, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { activeSessions, loginHistory } from "@/data/mockData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const SecurityCenter = () => {
  const { t } = useLanguage();
  const [biometric, setBiometric] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Security Center", "নিরাপত্তা কেন্দ্র")}</h1>
      </div>

      {/* Security Score */}
      <Card className="gradient-success text-primary-foreground border-0">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm opacity-80">{t("Security Score", "নিরাপত্তা স্কোর")}</p>
            <p className="text-3xl font-display font-bold">92/100</p>
            <p className="text-xs opacity-70">{t("Excellent", "চমৎকার")}</p>
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          <div className="flex items-center justify-between p-4 touch-target">
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-nitro-orange" />
              <div>
                <p className="text-sm font-medium">{t("Change PIN", "PIN পরিবর্তন")}</p>
                <p className="text-xs text-muted-foreground">{t("Last changed 30 days ago", "৩০ দিন আগে পরিবর্তিত")}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info("PIN change flow would open here")}>
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
            <Switch checked={biometric} onCheckedChange={setBiometric} />
          </div>
          <div className="flex items-center justify-between p-4 touch-target">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-nitro-blue" />
              <div>
                <p className="text-sm font-medium">{t("Two-Factor Auth", "টু-ফ্যাক্টর প্রমাণীকরণ")}</p>
                <p className="text-xs text-muted-foreground">{t("SMS verification", "এসএমএস যাচাইকরণ")}</p>
              </div>
            </div>
            <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Active Sessions", "সক্রিয় সেশন")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 touch-target">
                <div className="flex items-center gap-3">
                  {session.device.includes("Mac") ? <Monitor className="h-5 w-5 text-muted-foreground" /> : <Smartphone className="h-5 w-5 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{session.device}</p>
                    <p className="text-xs text-muted-foreground">{session.os} • {session.location}</p>
                  </div>
                </div>
                {session.current ? (
                  <Badge className="gradient-success text-primary-foreground border-0 text-[10px]">{t("Current", "বর্তমান")}</Badge>
                ) : (
                  <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => toast.success("Session ended")}>
                    {t("End", "শেষ")}
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Login History */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Login History", "লগইন ইতিহাস")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {loginHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 touch-target">
                <div>
                  <p className="text-sm font-medium">{entry.device}</p>
                  <p className="text-xs text-muted-foreground">{entry.date}</p>
                </div>
                <Badge variant={entry.status === "blocked" ? "destructive" : "outline"} className="text-[10px]">
                  {entry.status === "blocked" ? (
                    <><ShieldAlert className="h-3 w-3 mr-1" /> {t("Blocked", "ব্লক")}</>
                  ) : t("Success", "সফল")}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Block Account */}
      <Button variant="destructive" className="w-full h-12" onClick={() => toast.info("Account block flow would open here")}>
        {t("Block My Account", "আমার অ্যাকাউন্ট ব্লক করুন")}
      </Button>
    </div>
  );
};

export default SecurityCenter;
