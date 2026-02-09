import { useState } from "react";
import { Eye, EyeOff, Send, Download, Copy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { user } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true);
  const { t } = useLanguage();

  const copyAccount = () => {
    navigator.clipboard.writeText(user.accountNumber);
    toast.success("Account number copied!");
  };

  return (
    <Card className="gradient-primary text-primary-foreground border-0 shadow-2xl overflow-hidden -mx-4 rounded-none sm:mx-0 sm:rounded-xl">
      <CardContent className="p-5 sm:p-6 relative">
        {/* Floating shapes */}
        <div className="absolute -right-8 -bottom-8 h-40 w-40 rounded-full bg-white/10 float-animation" />
        <div className="absolute -right-4 -top-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute left-1/2 -bottom-12 h-24 w-24 rounded-full bg-white/5" />

        <div className="flex justify-between items-start relative z-10">
          <div>
            <p className="text-sm opacity-80">{t("Total Balance", "মোট ব্যালেন্স")}</p>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight">
                {showBalance ? `৳${user.balance.toLocaleString()}` : "৳ •••••"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/20 h-8 w-8"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <button onClick={copyAccount} className="flex items-center gap-1.5 text-xs opacity-70 mt-1 hover:opacity-100 transition-opacity">
              <span>{user.accountNumber}</span>
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
            <TrendingUp className="h-3 w-3" />
            <span className="text-xs font-medium">+12.5%</span>
          </div>
        </div>

        {/* Send/Receive quick buttons */}
        <div className="flex gap-3 mt-4 relative z-10">
          <Link to="/send" className="flex-1">
            <Button variant="ghost" className="w-full bg-white/15 hover:bg-white/25 text-primary-foreground gap-2 h-11">
              <Send className="h-4 w-4" /> {t("Send", "পাঠান")}
            </Button>
          </Link>
          <Link to="/receive" className="flex-1">
            <Button variant="ghost" className="w-full bg-white/15 hover:bg-white/25 text-primary-foreground gap-2 h-11">
              <Download className="h-4 w-4" /> {t("Receive", "গ্রহণ")}
            </Button>
          </Link>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/20 relative z-10">
          <div className="flex-1">
            <p className="text-xs opacity-60">{t("Income", "আয়")}</p>
            <p className="font-semibold text-sm mt-0.5">৳13,500</p>
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-60">{t("Expense", "ব্যয়")}</p>
            <p className="font-semibold text-sm mt-0.5">৳8,449</p>
          </div>
          <div className="flex-1">
            <p className="text-xs opacity-60">{t("Savings", "সঞ্চয়")}</p>
            <p className="font-semibold text-sm mt-0.5">৳5,051</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
