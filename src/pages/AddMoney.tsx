import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, CreditCard, Landmark, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const sources = [
  { id: "bank", name: "Bank Account", nameBn: "ব্যাংক অ্যাকাউন্ট", icon: Landmark },
  { id: "debit", name: "Debit Card", nameBn: "ডেবিট কার্ড", icon: CreditCard },
  { id: "credit", name: "Credit Card", nameBn: "ক্রেডিট কার্ড", icon: CreditCard },
];

const AddMoney = () => {
  const { t } = useLanguage();
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Money Added!", "টাকা যোগ হয়েছে!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setAmount(""); setSelected(""); }}>
          {t("Add More", "আরও যোগ করুন")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Add Money", "টাকা যোগ করুন")}</h1>
      <div className="grid grid-cols-3 gap-3">
        {sources.map((src) => (
          <Card key={src.id} className={`cursor-pointer transition-all ${selected === src.id ? "ring-2 ring-primary shadow-md" : "hover:shadow-sm"}`} onClick={() => setSelected(src.id)}>
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <src.icon className={`h-6 w-6 ${selected === src.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-xs font-medium">{t(src.name, src.nameBn)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      {selected && (
        <Card className="animate-fade-in">
          <CardContent className="p-6 space-y-4">
            {selected === "bank" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Account Number", "অ্যাকাউন্ট নম্বর")}</label>
                <Input placeholder="XXXX XXXX XXXX" />
              </div>
            )}
            {(selected === "debit" || selected === "credit") && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t("Card Number", "কার্ড নম্বর")}</label>
                  <Input placeholder="XXXX XXXX XXXX XXXX" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Expiry", "মেয়াদ")}</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CVV</label>
                    <Input placeholder="•••" type="password" />
                  </div>
                </div>
              </>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground" disabled={!amount} onClick={() => setDone(true)}>
              {t("Add Money", "টাকা যোগ করুন")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddMoney;
