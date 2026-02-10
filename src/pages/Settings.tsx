import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useWallet";
import { useAuth } from "@/contexts/AuthContext";
import { Globe, Bell, Shield, Smartphone, ChevronRight, LogOut, FileText, HelpCircle, Info, Camera, User, Award, Users, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const settingsSections = [
  {
    label: "Account",
    items: [
      { title: "Profile", titleBn: "প্রোফাইল", icon: User, color: "text-nitro-blue", url: "/profile" },
      { title: "My Cards", titleBn: "আমার কার্ড", icon: CreditCard, color: "text-nitro-purple", url: "/cards" },
      { title: "Rewards", titleBn: "রিওয়ার্ডস", icon: Award, color: "text-nitro-orange", url: "/rewards" },
      { title: "Refer & Earn", titleBn: "রেফার ও আয়", icon: Users, color: "text-nitro-green", url: "/refer" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { title: "Language", titleBn: "ভাষা", icon: Globe, color: "text-nitro-blue", toggle: "lang" as const },
      { title: "Notifications", titleBn: "বিজ্ঞপ্তি", icon: Bell, color: "text-nitro-orange", toggle: "notif" as const },
    ],
  },
  {
    label: "Security & Privacy",
    items: [
      { title: "Security Center", titleBn: "নিরাপত্তা কেন্দ্র", icon: Shield, color: "text-nitro-green", url: "/security" },
      { title: "Linked Devices", titleBn: "সংযুক্ত ডিভাইস", icon: Smartphone, color: "text-nitro-purple" },
    ],
  },
  {
    label: "Support",
    items: [
      { title: "Help & Support", titleBn: "সাহায্য ও সহায়তা", icon: HelpCircle, color: "text-nitro-teal", url: "/support" },
      { title: "Statements", titleBn: "স্টেটমেন্ট", icon: FileText, color: "text-nitro-blue", url: "/statements" },
      { title: "About Nitrozix", titleBn: "নাইট্রোজিক্স সম্পর্কে", icon: Info, color: "text-muted-foreground" },
    ],
  },
];

const SettingsPage = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { signOut } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
    toast.success(t("Logged out successfully", "সফলভাবে লগ আউট হয়েছে"));
  };

  return (
    <div className="max-w-lg mx-auto page-enter space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Settings", "সেটিংস")}</h1>

      <Link to="/profile">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center gap-4 touch-target">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="gradient-primary text-primary-foreground text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-lg">{profile?.full_name || "User"}</h2>
              <p className="text-sm text-muted-foreground">{profile?.phone || ""}</p>
              <Badge variant="outline" className="mt-1 text-[10px] capitalize">{profile?.account_tier || "basic"}</Badge>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      {settingsSections.map((section) => (
        <div key={section.label}>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">{section.label}</p>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {section.items.map((item) => {
                const content = (
                  <div className="flex items-center justify-between p-4 touch-target">
                    <div className="flex items-center gap-3">
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                      <p className="text-sm font-medium">{t(item.title, item.titleBn)}</p>
                    </div>
                    {"toggle" in item ? (
                      item.toggle === "lang" ? (
                        <Button variant="outline" size="sm" onClick={(e) => { e.preventDefault(); toggleLang(); }}>
                          {lang === "en" ? "বাংলা" : "English"}
                        </Button>
                      ) : (
                        <Switch defaultChecked />
                      )
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                );

                if ("url" in item && item.url) {
                  return <Link key={item.title} to={item.url}>{content}</Link>;
                }
                return <div key={item.title}>{content}</div>;
              })}
            </CardContent>
          </Card>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full h-12 gap-2 text-destructive border-destructive/20 hover:bg-destructive/5"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4" /> {t("Log Out", "লগ আউট")}
      </Button>

      <p className="text-center text-xs text-muted-foreground pb-4">
        Nitrozix v2.1.0 • © 2026
      </p>
    </div>
  );
};

export default SettingsPage;
