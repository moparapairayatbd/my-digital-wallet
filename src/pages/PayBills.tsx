import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { billCategories } from "@/data/mockData";
import { Zap, Flame, Droplets, Wifi, Phone, Tv, CreditCard, CheckCircle, ArrowLeft } from "lucide-react";

const iconMap: Record<string, any> = { Zap, Flame, Droplets, Wifi, Phone, Tv, CreditCard };

const PayBills = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<string | null>(null);
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  const selectedCat = billCategories.find(c => c.id === selected);

  if (done && selectedCat) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Bill Paid!", "বিল পরিশোধ হয়েছে!")}</h2>
        <p className="text-muted-foreground mt-1">{t(selectedCat.name, selectedCat.nameBn)} — ৳{Number(amount).toLocaleString()}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setSelected(null); setAmount(""); setAccountNo(""); }}>
          {t("Pay Another Bill", "আরেকটি বিল দিন")}
        </Button>
      </div>
    );
  }

  if (selected && selectedCat) {
    const Icon = iconMap[selectedCat.icon];
    return (
      <div className="max-w-md mx-auto animate-fade-in space-y-4">
        <Button variant="ghost" className="gap-2" onClick={() => setSelected(null)}><ArrowLeft className="h-4 w-4" /> {t("Back", "পেছনে")}</Button>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: selectedCat.color + "20" }}>
            {Icon && <Icon className="h-6 w-6" style={{ color: selectedCat.color }} />}
          </div>
          <h1 className="text-xl font-display font-bold">{t(selectedCat.name + " Bill", selectedCat.nameBn + " বিল")}</h1>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Account/Meter Number", "অ্যাকাউন্ট/মিটার নম্বর")}</label>
              <Input placeholder="Enter number" value={accountNo} onChange={(e) => setAccountNo(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground" disabled={!accountNo || !amount} onClick={() => setDone(true)}>
              {t("Pay Bill", "বিল পরিশোধ করুন")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Pay Bills", "বিল পরিশোধ করুন")}</h1>
      <div className="grid grid-cols-3 gap-3">
        {billCategories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelected(cat.id)}>
              <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: cat.color + "20" }}>
                  {Icon && <Icon className="h-6 w-6" style={{ color: cat.color }} />}
                </div>
                <span className="text-xs font-medium">{t(cat.name, cat.nameBn)}</span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PayBills;
