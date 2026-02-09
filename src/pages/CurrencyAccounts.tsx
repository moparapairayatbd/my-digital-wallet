import { useState } from "react";
import { DollarSign, PoundSterling, Plus, ArrowRightLeft, TrendingUp, ChevronRight, ChevronLeft, Globe, CheckCircle2, User, MapPin, FileText, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";

interface CurrencyAccount {
  id: string;
  currency: string;
  currencyCode: string;
  symbol: string;
  balance: number;
  accountNumber: string;
  gradient: string;
  flag: string;
  rate: number;
}

const mockAccounts: CurrencyAccount[] = [
  {
    id: "usd1", currency: "US Dollar", currencyCode: "USD", symbol: "$",
    balance: 250.00, accountNumber: "NTZ-USD-001234",
    gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] to-[hsl(175,70%,42%)]",
    flag: "🇺🇸", rate: 121.50,
  },
];

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
  const [accounts, setAccounts] = useState(mockAccounts);
  const [showOpenFlow, setShowOpenFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCurrency, setSelectedCurrency] = useState<typeof availableCurrencies[0] | null>(null);
  const [formData, setFormData] = useState({ fullName: "Rahim Uddin", nid: "1234567890", dob: "1995-03-15", occupation: "Business", address: "House 12, Road 5, Dhanmondi", city: "Dhaka", postalCode: "1205" });
  const [newAccount, setNewAccount] = useState<CurrencyAccount | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const existingCodes = accounts.map(a => a.currencyCode);

  const handleOpenAccount = () => {
    if (!selectedCurrency) return;
    const acc: CurrencyAccount = {
      id: `${selectedCurrency.code.toLowerCase()}${Date.now()}`,
      currency: selectedCurrency.name,
      currencyCode: selectedCurrency.code,
      symbol: selectedCurrency.symbol,
      balance: 0,
      accountNumber: `NTZ-${selectedCurrency.code}-${String(Math.floor(100000 + Math.random() * 900000))}`,
      gradient: selectedCurrency.gradient,
      flag: selectedCurrency.flag,
      rate: selectedCurrency.rate,
    };
    setAccounts(prev => [...prev, acc]);
    setNewAccount(acc);
    setShowSuccess(true);
  };

  const resetFlow = () => {
    setShowOpenFlow(false);
    setCurrentStep(0);
    setSelectedCurrency(null);
    setNewAccount(null);
    setShowSuccess(false);
  };

  // Success screen
  if (showSuccess && newAccount && selectedCurrency) {
    return (
      <TransactionSuccess
        title={t("Account Opened!", "অ্যাকাউন্ট খোলা হয়েছে!")}
        subtitle={t("Your new currency account is ready", "আপনার নতুন কারেন্সি অ্যাকাউন্ট প্রস্তুত")}
        details={[
          { label: t("Currency", "কারেন্সি"), value: `${selectedCurrency.flag} ${selectedCurrency.name}` },
          { label: t("Account Number", "অ্যাকাউন্ট নম্বর"), value: newAccount.accountNumber, copyable: true },
          { label: t("Account Holder", "অ্যাকাউন্ট হোল্ডার"), value: formData.fullName },
          { label: t("Exchange Rate", "বিনিময় হার"), value: `1 ${selectedCurrency.code} = ৳${selectedCurrency.rate}` },
          { label: t("Opening Balance", "ওপেনিং ব্যালেন্স"), value: `${selectedCurrency.symbol}0.00` },
          { label: t("Monthly Fee", "মাসিক ফি"), value: t("Free", "ফ্রি") },
          { label: t("Status", "স্ট্যাটাস"), value: t("Active", "সক্রিয়") },
        ]}
        primaryAction={{ label: t("Go to My Accounts", "আমার অ্যাকাউন্টে যান"), onClick: resetFlow }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        gradient="gradient-success"
      />
    );
  }

  // Step-by-step opening flow
  if (showOpenFlow) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        {/* Progress bar */}
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

        {/* Step 0: Select Currency */}
        {currentStep === 0 && (
          <div className="space-y-3">
            {availableCurrencies.filter(c => !existingCodes.includes(c.code)).map((cur) => (
              <button
                key={cur.code}
                onClick={() => { setSelectedCurrency(cur); setCurrentStep(1); }}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedCurrency?.code === cur.code ? "border-primary bg-primary/5" : "border-border hover:border-primary/30 hover:bg-muted"}`}
              >
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

        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Full Name", "পূর্ণ নাম")}</label>
                <Input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("National ID (NID)", "জাতীয় পরিচয়পত্র")}</label>
                <Input value={formData.nid} onChange={(e) => setFormData({ ...formData, nid: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Date of Birth", "জন্ম তারিখ")}</label>
                <Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Occupation", "পেশা")}</label>
                <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
              </div>
              <Button className="w-full" onClick={() => setCurrentStep(2)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Address */}
        {currentStep === 2 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Street Address", "ঠিকানা")}</label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("City", "শহর")}</label>
                  <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Postal Code", "পোস্টাল কোড")}</label>
                  <Input value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} />
                </div>
              </div>
              <Button className="w-full" onClick={() => setCurrentStep(3)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verification */}
        {currentStep === 3 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="text-center py-4">
                <div className="h-16 w-16 rounded-full bg-nitro-blue/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-8 w-8 text-nitro-blue" />
                </div>
                <h3 className="font-semibold">{t("Identity Verification", "পরিচয় যাচাই")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("We'll verify your identity using your NID", "আমরা আপনার NID দিয়ে পরিচয় যাচাই করব")}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-nitro-green" />
                  <span className="text-sm">{t("Phone number verified", "ফোন নম্বর যাচাই সম্পন্ন")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-nitro-green" />
                  <span className="text-sm">{t("NID verification complete", "NID যাচাই সম্পন্ন")}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-nitro-green" />
                  <span className="text-sm">{t("KYC approved", "KYC অনুমোদিত")}</span>
                </div>
              </div>
              <Button className="w-full" onClick={() => setCurrentStep(4)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && selectedCurrency && (
          <div className="space-y-4">
            <Card className={`${selectedCurrency.gradient} text-white border-0`}>
              <CardContent className="p-5 text-center">
                <p className="text-3xl mb-1">{selectedCurrency.flag}</p>
                <p className="font-display font-bold text-lg">{selectedCurrency.name} {t("Account", "অ্যাকাউন্ট")}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {[
                  { l: t("Account Holder", "অ্যাকাউন্ট হোল্ডার"), v: formData.fullName },
                  { l: t("NID", "NID"), v: formData.nid },
                  { l: t("Address", "ঠিকানা"), v: `${formData.address}, ${formData.city}` },
                  { l: t("Currency", "কারেন্সি"), v: `${selectedCurrency.code} (${selectedCurrency.symbol})` },
                  { l: t("Exchange Rate", "বিনিময় হার"), v: `1 ${selectedCurrency.code} = ৳${selectedCurrency.rate}` },
                  { l: t("Monthly Fee", "মাসিক ফি"), v: t("Free", "ফ্রি") },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-3">
                    <span className="text-sm text-muted-foreground">{item.l}</span>
                    <span className="text-sm font-medium">{item.v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button className="w-full gradient-primary text-primary-foreground h-12" onClick={handleOpenAccount}>
              {t("Open Account", "অ্যাকাউন্ট খুলুন")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Main accounts view
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("Currency Accounts", "কারেন্সি অ্যাকাউন্ট")}</h1>
          <p className="text-muted-foreground text-sm">{t("Multi-currency banking at your fingertips", "মাল্টি-কারেন্সি ব্যাংকিং আপনার হাতে")}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowOpenFlow(true)}>
          <Plus className="h-4 w-4" />{t("Open Account", "অ্যাকাউন্ট খুলুন")}
        </Button>
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
