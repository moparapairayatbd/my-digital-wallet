import { ChevronRight, Globe, PlusCircle, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProfile } from "@/hooks/useWallet";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export function BankingPreview() {
  const { t } = useLanguage();
  const { data: profile } = useProfile();
  const name = profile?.full_name || "User";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link to="/cards" className="block group">
        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
          <div className="relative h-44 bg-gradient-to-br from-accent via-primary to-secondary p-5 text-primary-foreground">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-1/3 translate-x-1/4" />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] uppercase tracking-widest opacity-70">Virtual Card</p>
                <p className="text-xs opacity-60 mt-0.5">Nitrozix</p>
              </div>
              <Wifi className="h-4 w-4 opacity-70 rotate-90" />
            </div>
            <p className="text-sm tracking-[0.2em] font-mono mt-6">4532 •••• •••• 7891</p>
            <div className="flex justify-between items-end mt-4">
              <div>
                <p className="text-[9px] uppercase opacity-50">Holder</p>
                <p className="text-xs font-semibold">{name.toUpperCase()}</p>
              </div>
              <p className="text-xs font-semibold">09/28</p>
            </div>
          </div>
          <CardContent className="p-3 flex items-center justify-between">
            <span className="text-sm font-medium">{t("Manage Cards", "কার্ড পরিচালনা")}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </CardContent>
        </Card>
      </Link>

      <Link to="/currency" className="block group">
        <Card className="overflow-hidden h-full">
          <CardContent className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{t("Currency Accounts", "কারেন্সি অ্যাকাউন্ট")}</h3>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full gradient-success flex items-center justify-center text-sm">🇺🇸</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">USD Account</p>
                    <p className="text-xs text-muted-foreground">$250.00</p>
                  </div>
                  <p className="text-xs text-nitro-green font-medium">+0.3%</p>
                </div>
                <div className="flex items-center gap-3 opacity-50">
                  <div className="h-9 w-9 rounded-full gradient-info flex items-center justify-center text-sm">🇬🇧</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">GBP Account</p>
                    <p className="text-xs text-muted-foreground">{t("Open now", "এখন খুলুন")}</p>
                  </div>
                  <PlusCircle className="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              <span className="text-sm font-medium">{t("View All", "সব দেখুন")}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
