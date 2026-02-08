import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, User, CheckCircle } from "lucide-react";

const SendMoney = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");

  const handleConfirm = () => setStep("done");

  if (step === "done") {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Money Sent!", "টাকা পাঠানো হয়েছে!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()} → {phone}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setStep("form"); setPhone(""); setAmount(""); setReference(""); }}>
          {t("Send Again", "আবার পাঠান")}
        </Button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-md mx-auto animate-fade-in space-y-4">
        <h1 className="text-xl font-display font-bold">{t("Confirm Transfer", "ট্রান্সফার নিশ্চিত করুন")}</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("To", "প্রাপক")}</span><span className="font-medium">{phone}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Amount", "পরিমাণ")}</span><span className="font-bold text-lg">৳{Number(amount).toLocaleString()}</span></div>
            {reference && <div className="flex justify-between"><span className="text-muted-foreground">{t("Reference", "রেফারেন্স")}</span><span>{reference}</span></div>}
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Fee", "ফি")}</span><span className="text-nitro-green font-medium">{t("Free", "ফ্রি")}</span></div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>{t("Back", "পেছনে")}</Button>
          <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleConfirm}>{t("Confirm", "নিশ্চিত করুন")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-4">
      <h1 className="text-xl font-display font-bold">{t("Send Money", "টাকা পাঠান")}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Recipient Number", "প্রাপকের নম্বর")}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="01XXX-XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-2xl font-bold h-14" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Reference (optional)", "রেফারেন্স (ঐচ্ছিক)")}</label>
            <Input placeholder={t("What's this for?", "কিসের জন্য?")} value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
          <Button className="w-full gradient-primary text-primary-foreground h-12 text-base" disabled={!phone || !amount} onClick={() => setStep("confirm")}>
            <Send className="h-4 w-4 mr-2" /> {t("Continue", "এগিয়ে যান")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendMoney;
