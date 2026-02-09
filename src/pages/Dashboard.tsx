import { useState } from "react";
import { Eye, EyeOff, Send, Download, HandCoins, PlusCircle, ArrowDownToLine, Receipt, Phone, QrCode, ArrowUpRight, ArrowDownLeft, ChevronRight, CreditCard, Globe, Wifi, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { user, transactions, offers } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const quickActions = [
  { title: "Send", titleBn: "পাঠান", icon: Send, url: "/send", color: "bg-nitro-pink" },
  { title: "Receive", titleBn: "গ্রহণ", icon: Download, url: "/receive", color: "bg-nitro-green" },
  { title: "Request", titleBn: "অনুরোধ", icon: HandCoins, url: "/request", color: "bg-nitro-orange" },
  { title: "Add Money", titleBn: "যোগ করুন", icon: PlusCircle, url: "/add-money", color: "bg-nitro-blue" },
  { title: "Cash Out", titleBn: "ক্যাশ আউট", icon: ArrowDownToLine, url: "/cash-out", color: "bg-nitro-purple" },
  { title: "Pay Bill", titleBn: "বিল পে", icon: Receipt, url: "/pay-bills", color: "bg-nitro-teal" },
  { title: "Recharge", titleBn: "রিচার্জ", icon: Phone, url: "/recharge", color: "bg-nitro-yellow" },
  { title: "QR Pay", titleBn: "QR পে", icon: QrCode, url: "/merchant", color: "bg-nitro-pink" },
];

const Dashboard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-display font-bold">
          {t("Hello", "হ্যালো")}, {t(user.name.split(" ")[0], "রহিম")} 👋
        </h1>
        <p className="text-muted-foreground text-sm">{t("Welcome back to Nitrozix", "নাইট্রোজিক্সে স্বাগতম")}</p>
      </div>

      {/* Balance Card - Enhanced */}
      <Card className="gradient-primary text-primary-foreground border-0 shadow-2xl overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm opacity-80">{t("Total Balance", "মোট ব্যালেন্স")}</p>
              <div className="flex items-center gap-3 mt-1">
                <h2 className="text-4xl font-display font-bold tracking-tight">
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
              <p className="text-xs opacity-70 mt-1">{user.accountNumber}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/15 rounded-full px-2.5 py-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-medium">+12.5%</span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex gap-4 mt-5 pt-4 border-t border-white/20">
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
          <div className="absolute -right-6 -bottom-6 h-36 w-36 rounded-full bg-white/10" />
          <div className="absolute -right-2 -top-8 h-28 w-28 rounded-full bg-white/5" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Quick Actions", "দ্রুত অ্যাকশন")}</h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.url}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <div className={`h-11 w-11 rounded-full ${action.color} flex items-center justify-center shadow-md`}>
                <action.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xs font-medium text-center">{t(action.title, action.titleBn)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* My Card & Currency - Side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card Preview */}
        <Link to="/cards" className="block group">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="relative h-44 bg-gradient-to-br from-[hsl(280,65%,55%)] via-[hsl(330,85%,52%)] to-[hsl(25,95%,55%)] p-5 text-white">
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
                  <p className="text-xs font-semibold">{user.name.toUpperCase()}</p>
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

        {/* Currency Accounts Preview */}
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
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(152,68%,45%)] to-[hsl(175,70%,42%)] flex items-center justify-center text-white text-sm">🇺🇸</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">USD Account</p>
                      <p className="text-xs text-muted-foreground">$250.00</p>
                    </div>
                    <p className="text-xs text-nitro-green font-medium">+0.3%</p>
                  </div>
                  <div className="flex items-center gap-3 opacity-50">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[hsl(210,85%,55%)] to-[hsl(240,60%,50%)] flex items-center justify-center text-white text-sm">🇬🇧</div>
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

      {/* Offers Carousel */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Offers & Promotions", "অফার ও প্রমোশন")}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          {offers.map((offer) => (
            <Card key={offer.id} className={`min-w-[260px] snap-start ${offer.color} text-primary-foreground border-0 flex-shrink-0`}>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm">{t(offer.title, offer.titleBn)}</h3>
                <p className="text-xs opacity-80 mt-1">{offer.description}</p>
                <p className="text-[10px] opacity-60 mt-2">{t("Valid till", "কার্যকর")}: {offer.validTill}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">{t("Recent Transactions", "সাম্প্রতিক লেনদেন")}</h2>
          <Link to="/history" className="text-sm text-primary font-medium flex items-center gap-1">
            {t("See All", "সব দেখুন")} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-nitro-green/10" : "bg-nitro-pink/10"}`}>
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="h-4 w-4 text-nitro-green" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 text-nitro-pink" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(tx.title, tx.titleBn)}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.amount > 0 ? "text-nitro-green" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : ""}৳{Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
