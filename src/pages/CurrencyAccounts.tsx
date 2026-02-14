import { useState } from "react";
import { Plus, ArrowRightLeft, TrendingUp, ChevronRight, ChevronLeft, Globe, CheckCircle2, User, MapPin, FileText, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";
import { useCurrencyAccounts, useCreateCurrencyAccount } from "@/hooks/useWallet";

const availableCurrencies = [
  { code: "USD", name: "US Dollar", nameBn: "মার্কিন ডলার", symbol: "$", flag: "🇺🇸", rate: 121.50, gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] to-[hsl(175,70%,42%)]" },
  { code: "GBP", name: "British Pound", nameBn: "ব্রিটিশ পাউন্ড", symbol: "£", flag: "🇬🇧", rate: 153.20, gradient: "bg-gradient-to-br from-[hsl(210,85%,55%)] to-[hsl(240,60%,50%)]" },
  { code: "EUR", name: "Euro", nameBn: "ইউরো", symbol: "€", flag: "🇪🇺", rate: 131.80, gradient: "bg-gradient-to-br from-[hsl(210,85%,55%)] to-[hsl(280,65%,55%)]" },
  { code: "SAR", name: "Saudi Riyal", nameBn: "সৌদি রিয়াল", symbol: "﷼", flag: "🇸🇦", rate: 32.40, gradient: "bg-gradient-to-br from-[hsl(152,68%,35%)] to-[hsl(120,50%,30%)]" },
];

const openingSteps = [
  { title: "Select Currency", titleBn: "কারেন্সি নির্বাচন", icon: Globe },
  { title: "Personal Info", titleBn: "ব্যক্তিগত তথ্য", icon: User },
  { title: "Address", titleBn: "ঠিকানা", icon: MapPin },
  { title: "Verification", titleBn: "যাচাইকরণ", icon: Shield },
  { title: "Review", titleBn: "পর্যালোচনা", icon: FileText },
];

const CurrencyAccounts = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { data: dbAccounts, isLoading } = useCurrencyAccounts();
  const createAccount = useCreateCurrencyAccount();
  const [showOpenFlow, setShowOpenFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<typeof availableCurrencies[0] | null>(null);
  const [formData, setFormData] = useState({ fullName: "", nid: "", dob: "", occupation: "", address: "", city: "Dhaka", postalCode: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [newAccountNumber, setNewAccountNumber] = useState("");

  const accounts = dbAccounts || [];
  const existingCodes = accounts.map(a => a.currency);

  const handleOpenAccount = async () => {
    if (!selectedCurrency) return;
    const accountNumber = `NTZ-${selectedCurrency.code}-${String(Math.floor(100000 + Math.random() * 900000))}`;
    try {
      await createAccount.mutateAsync({
        currency: selectedCurrency.code,
        currencyName: selectedCurrency.name,
        accountNumber,
      });
      setNewAccountNumber(accountNumber);
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
    }
  };

  const resetFlow = () => {
    setShowOpenFlow(false);
    setCurrentStep(0);
    setSelectedCurrency(null);
    setShowSuccess(false);
  };

  if (showSuccess && selectedCurrency) {
    return (
      <TransactionSuccess
        title={t("Account Opened!", "অ্যাকাউন্ট খোলা হয়েছে!")}
        subtitle={t("Your new currency account is ready", "আপনার নতুন কারেন্সি অ্যাকাউন্ট প্রস্তুত")}
        details={[
          { label: t("Currency", "কারেন্সি"), value: `${selectedCurrency.flag} ${selectedCurrency.name}` },
          { label: t("Account Number", "অ্যাকাউন্ট নম্বর"), value: newAccountNumber, copyable: true },
          { label: t("Exchange Rate", "বিনিময় হার"), value: `1 ${selectedCurrency.code} = ৳${selectedCurrency.rate}` },
          { label: t("Status", "স্ট্যাটাস"), value: t("Active", "সক্রিয়") },
        ]}
        primaryAction={{ label: t("Go to My Accounts", "আমার অ্যাকাউন্টে যান"), onClick: resetFlow }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        gradient="gradient-success"
      />
    );
  }

  if (showOpenFlow) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => currentStep === 0 ? resetFlow() : setCurrentStep(currentStep - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> {t("Back", "পেছনে")}
            </Button>
            <span className="text-xs text-muted-foreground">{t("Step", "ধাপ")} {currentStep + 1}/{openingSteps.length}</span>
          </div>
          <div className="flex gap-1.5">
            {openingSteps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentStep ? "gradient-primary" : "bg-muted"}`} />
            ))}
          </div>
          <h2 className="font-display font-bold text-lg mt-4 flex items-center gap-2">
            {(() => { const Icon = openingSteps[currentStep].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
            {t(openingSteps[currentStep].title, openingSteps[currentStep].titleBn)}
          </h2>
        </div>

        {currentStep === 0 && (
          <div className="space-y-3">
            {availableCurrencies.filter(c => !existingCodes.includes(c.code)).map((cur) => (
              <button key={cur.code} onClick={() => { setSelectedCurrency(cur); setCurrentStep(1); }}
                className="w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left border-border hover:border-primary/30 hover:bg-muted">
                <div className={`h-14 w-14 rounded-xl ${cur.gradient} flex items-center justify-center text-white text-2xl shadow-md`}>{cur.flag}</div>
                <div className="flex-1">
                  <p className="font-semibold">{cur.name}</p>
                  <p className="text-sm text-muted-foreground">1 {cur.code} = ৳{cur.rate}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {currentStep === 1 && (
          <Card><CardContent className="p-5 space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">{t("Full Name", "পূর্ণ নাম")}</label><Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{t("National ID", "জাতীয় পরিচয়পত্র")}</label><Input value={formData.nid} onChange={(e) => setFormData({ ...formData, nid: e.target.value })} /></div>
            <div className="space-y-2"><label className="text-sm font-medium">{t("Date of Birth", "জন্ম তারিখ")}</label><Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} /></div>
            <Button className="w-full" onClick={() => setCurrentStep(2)}>{t("Continue", "এগিয়ে যান")}</Button>
          </CardContent></Card>
        )}

        {currentStep === 2 && (
          <Card><CardContent className="p-5 space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium">{t("Address", "ঠিকানা")}</label><Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><label className="text-sm font-medium">{t("City", "শহর")}</label><Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium">{t("Postal Code", "পোস্টাল কোড")}</label><Input value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} /></div>
            </div>
            <Button className="w-full" onClick={() => setCurrentStep(3)}>{t("Continue", "এগিয়ে যান")}</Button>
          </CardContent></Card>
        )}

        {currentStep === 3 && (
          <Card><CardContent className="p-5 space-y-4">
            <div className="text-center py-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"><Shield className="h-8 w-8 text-primary" /></div>
              <h3 className="font-semibold">{t("Identity Verification", "পরিচয় যাচাই")}</h3>
            </div>
            <div className="space-y-3">
              {["Phone number verified", "NID verification complete", "KYC approved"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted"><CheckCircle2 className="h-5 w-5 text-green-600" /><span className="text-sm">{t(text, text)}</span></div>
              ))}
            </div>
            <Button className="w-full" onClick={() => setCurrentStep(4)}>{t("Continue", "এগিয়ে যান")}</Button>
          </CardContent></Card>
        )}

        {currentStep === 4 && selectedCurrency && (
          <div className="space-y-4">
            <Card className={`${selectedCurrency.gradient} text-white border-0`}><CardContent className="p-5 text-center">
              <p className="text-3xl mb-1">{selectedCurrency.flag}</p>
              <p className="font-display font-bold text-lg">{selectedCurrency.name}</p>
            </CardContent></Card>
            <Button className="w-full gradient-primary text-primary-foreground h-12" disabled={createAccount.isPending} onClick={handleOpenAccount}>
              {createAccount.isPending ? t("Opening...", "খোলা হচ্ছে...") : t("Open Account", "অ্যাকাউন্ট খুলুন")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("Currency Accounts", "কারেন্সি অ্যাকাউন্ট")}</h1>
          <p className="text-muted-foreground text-sm">{t("Multi-currency banking", "মাল্টি-কারেন্সি ব্যাংকিং")}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowOpenFlow(true)}>
          <Plus className="h-4 w-4" />{t("Open", "খুলুন")}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("Loading...", "লোড হচ্ছে...")}</p>
      ) : accounts.length === 0 ? (
        <Card><CardContent className="p-8 text-center">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">{t("No currency accounts yet", "এখনও কোনো কারেন্সি অ্যাকাউন্ট নেই")}</p>
          <p className="text-sm text-muted-foreground mt-1">{t("Open your first multi-currency account", "আপনার প্রথম মাল্টি-কারেন্সি অ্যাকাউন্ট খুলুন")}</p>
          <Button className="mt-4" onClick={() => setShowOpenFlow(true)}><Plus className="h-4 w-4 mr-1" />{t("Open Account", "অ্যাকাউন্ট খুলুন")}</Button>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {accounts.map((acc) => {
            const cur = availableCurrencies.find(c => c.code === acc.currency);
            return (
              <Card key={acc.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 p-4">
                    <div className={`h-12 w-12 rounded-xl ${cur?.gradient || "bg-muted"} flex items-center justify-center text-white text-xl`}>{cur?.flag || "💱"}</div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{acc.currency_name}</p>
                      <p className="text-xs text-muted-foreground">{acc.account_number}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold">{cur?.symbol || ""}{Number(acc.balance).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">≈ ৳{(Number(acc.balance) * (cur?.rate || 1)).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex border-t border-border divide-x divide-border">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors"><Plus className="h-3.5 w-3.5" /> {t("Add", "যোগ")}</button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors"><ArrowRightLeft className="h-3.5 w-3.5" /> {t("Convert", "রূপান্তর")}</button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors"><TrendingUp className="h-3.5 w-3.5" /> {t("Details", "বিবরণ")}</button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Live Exchange Rates", "লাইভ এক্সচেঞ্জ রেট")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {availableCurrencies.map((cur) => (
              <div key={cur.code} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{cur.flag}</span>
                  <div><p className="text-sm font-medium">{cur.code}</p><p className="text-xs text-muted-foreground">{cur.name}</p></div>
                </div>
                <p className="text-sm font-semibold">৳{cur.rate}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CurrencyAccounts;
