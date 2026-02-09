import { useState } from "react";
import { DollarSign, PoundSterling, Plus, ArrowRightLeft, TrendingUp, ChevronRight, Globe, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";

interface CurrencyAccount {
  id: string;
  currency: string;
  currencyCode: string;
  symbol: string;
  balance: number;
  accountNumber: string;
  icon: typeof DollarSign;
  gradient: string;
  flag: string;
  rate: number;
}

const mockAccounts: CurrencyAccount[] = [
  {
    id: "usd1", currency: "US Dollar", currencyCode: "USD", symbol: "$",
    balance: 250.00, accountNumber: "NTZ-USD-001234", icon: DollarSign,
    gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] to-[hsl(175,70%,42%)]",
    flag: "🇺🇸", rate: 121.50,
  },
];

const availableCurrencies = [
  { code: "USD", name: "US Dollar", nameBn: "মার্কিন ডলার", symbol: "$", icon: DollarSign, flag: "🇺🇸", rate: 121.50, gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] to-[hsl(175,70%,42%)]" },
  { code: "GBP", name: "British Pound", nameBn: "ব্রিটিশ পাউন্ড", symbol: "£", icon: PoundSterling, flag: "🇬🇧", rate: 153.20, gradient: "bg-gradient-to-br from-[hsl(210,85%,55%)] to-[hsl(240,60%,50%)]" },
  { code: "EUR", name: "Euro", nameBn: "ইউরো", symbol: "€", icon: Globe, flag: "🇪🇺", rate: 131.80, gradient: "bg-gradient-to-br from-[hsl(210,85%,55%)] to-[hsl(280,65%,55%)]" },
  { code: "SAR", name: "Saudi Riyal", nameBn: "সৌদি রিয়াল", symbol: "﷼", icon: Globe, flag: "🇸🇦", rate: 32.40, gradient: "bg-gradient-to-br from-[hsl(152,68%,35%)] to-[hsl(120,50%,30%)]" },
];

const CurrencyAccounts = () => {
  const { t } = useLanguage();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [showOpen, setShowOpen] = useState(false);
  const [openStep, setOpenStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<typeof availableCurrencies[0] | null>(null);
  const [showExchange, setShowExchange] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState("");

  const handleOpenAccount = () => {
    if (!selectedCurrency) return;
    const newAcc: CurrencyAccount = {
      id: `${selectedCurrency.code.toLowerCase()}${Date.now()}`,
      currency: selectedCurrency.name,
      currencyCode: selectedCurrency.code,
      symbol: selectedCurrency.symbol,
      balance: 0,
      accountNumber: `NTZ-${selectedCurrency.code}-${String(Math.floor(100000 + Math.random() * 900000))}`,
      icon: selectedCurrency.icon,
      gradient: selectedCurrency.gradient,
      flag: selectedCurrency.flag,
      rate: selectedCurrency.rate,
    };
    setAccounts(prev => [...prev, newAcc]);
    setOpenStep(2);
    toast(t(`${selectedCurrency.code} account opened!`, `${selectedCurrency.code} অ্যাকাউন্ট খোলা হয়েছে!`));
  };

  const existingCodes = accounts.map(a => a.currencyCode);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("Currency Accounts", "কারেন্সি অ্যাকাউন্ট")}</h1>
          <p className="text-muted-foreground text-sm">{t("Multi-currency banking at your fingertips", "মাল্টি-কারেন্সি ব্যাংকিং আপনার হাতে")}</p>
        </div>
        <Dialog open={showOpen} onOpenChange={(v) => { setShowOpen(v); if (!v) { setOpenStep(0); setSelectedCurrency(null); } }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("Open Account", "অ্যাকাউন্ট খুলুন")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{t("Open Currency Account", "কারেন্সি অ্যাকাউন্ট খুলুন")}</DialogTitle>
            </DialogHeader>

            {openStep === 0 && (
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">{t("Select currency", "কারেন্সি নির্বাচন করুন")}</p>
                {availableCurrencies.filter(c => !existingCodes.includes(c.code)).map((cur) => (
                  <button
                    key={cur.code}
                    onClick={() => { setSelectedCurrency(cur); setOpenStep(1); }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-2xl">{cur.flag}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{cur.name}</p>
                      <p className="text-xs text-muted-foreground">1 {cur.code} = ৳{cur.rate}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
                {availableCurrencies.filter(c => !existingCodes.includes(c.code)).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">{t("All available currencies opened!", "সব কারেন্সি খোলা হয়েছে!")}</p>
                )}
              </div>
            )}

            {openStep === 1 && selectedCurrency && (
              <div className="space-y-4 pt-2">
                <Card className={`${selectedCurrency.gradient} text-white border-0`}>
                  <CardContent className="p-5 text-center">
                    <p className="text-3xl mb-2">{selectedCurrency.flag}</p>
                    <p className="font-display font-bold text-lg">{selectedCurrency.name}</p>
                    <p className="text-sm opacity-80 mt-1">1 {selectedCurrency.code} = ৳{selectedCurrency.rate}</p>
                  </CardContent>
                </Card>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>✓ {t("Zero opening balance required", "জিরো ওপেনিং ব্যালেন্স")}</p>
                  <p>✓ {t("No monthly maintenance fee", "কোনো মাসিক ফি নেই")}</p>
                  <p>✓ {t("Instant currency conversion", "তাত্ক্ষণিক কারেন্সি রূপান্তর")}</p>
                  <p>✓ {t("Receive international remittance", "আন্তর্জাতিক রেমিট্যান্স গ্রহণ")}</p>
                </div>
                <Button className="w-full" onClick={handleOpenAccount}>{t("Open Account", "অ্যাকাউন্ট খুলুন")}</Button>
              </div>
            )}

            {openStep === 2 && (
              <div className="text-center space-y-4 py-4">
                <div className="h-16 w-16 rounded-full bg-nitro-green/10 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-nitro-green" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg">{t("Account Opened!", "অ্যাকাউন্ট খোলা হয়েছে!")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("Your new currency account is ready to use", "আপনার নতুন কারেন্সি অ্যাকাউন্ট ব্যবহারের জন্য প্রস্তুত")}</p>
                </div>
                <Button className="w-full" onClick={() => setShowOpen(false)}>{t("Done", "সম্পন্ন")}</Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Accounts */}
      <div className="space-y-3">
        {accounts.map((acc) => (
          <Card key={acc.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 p-4">
                <div className={`h-12 w-12 rounded-xl ${acc.gradient} flex items-center justify-center text-white text-xl`}>
                  {acc.flag}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{acc.currency}</p>
                  <p className="text-xs text-muted-foreground">{acc.accountNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold">{acc.symbol}{acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  <p className="text-xs text-muted-foreground">≈ ৳{(acc.balance * (availableCurrencies.find(c => c.code === acc.currencyCode)?.rate || 1)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                </div>
              </div>
              <div className="flex border-t border-border divide-x divide-border">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors">
                  <Plus className="h-3.5 w-3.5" /> {t("Add Funds", "ফান্ড যোগ")}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors">
                  <ArrowRightLeft className="h-3.5 w-3.5" /> {t("Convert", "রূপান্তর")}
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors">
                  <TrendingUp className="h-3.5 w-3.5" /> {t("Details", "বিবরণ")}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exchange Rates */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Live Exchange Rates", "লাইভ এক্সচেঞ্জ রেট")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {availableCurrencies.map((cur) => (
              <div key={cur.code} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cur.flag}</span>
                  <div>
                    <p className="text-sm font-medium">{cur.code}</p>
                    <p className="text-xs text-muted-foreground">{cur.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">৳{cur.rate}</p>
                  <p className="text-xs text-nitro-green">+0.3%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyAccounts;
