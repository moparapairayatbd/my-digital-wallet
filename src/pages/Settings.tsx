import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/contexts/LanguageContext";
import { user } from "@/data/mockData";
import { Globe, Bell, Shield, Smartphone, ChevronRight } from "lucide-react";

const SettingsPage = () => {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Settings", "সেটিংস")}</h1>

      {/* Profile */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-display font-bold text-lg">{t(user.name, user.nameBn)}</h2>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
            <p className="text-xs text-muted-foreground">{user.accountNumber}</p>
          </div>
        </CardContent>
      </Card>

      {/* Settings List */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-nitro-blue" />
              <div>
                <p className="text-sm font-medium">{t("Language", "ভাষা")}</p>
                <p className="text-xs text-muted-foreground">{lang === "en" ? "English" : "বাংলা"}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleLang}>
              {lang === "en" ? "বাংলা" : "English"}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-nitro-orange" />
              <div>
                <p className="text-sm font-medium">{t("Notifications", "বিজ্ঞপ্তি")}</p>
                <p className="text-xs text-muted-foreground">{t("Push & SMS alerts", "পুশ ও এসএমএস সতর্কতা")}</p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-nitro-green" />
              <div>
                <p className="text-sm font-medium">{t("Security", "নিরাপত্তা")}</p>
                <p className="text-xs text-muted-foreground">{t("PIN & biometric settings", "পিন ও বায়োমেট্রিক সেটিংস")}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-nitro-purple" />
              <div>
                <p className="text-sm font-medium">{t("Linked Devices", "সংযুক্ত ডিভাইস")}</p>
                <p className="text-xs text-muted-foreground">{t("1 device connected", "১টি ডিভাইস সংযুক্ত")}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
