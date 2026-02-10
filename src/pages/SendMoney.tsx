import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSendMoney } from "@/hooks/useWallet";
import { Send, User } from "lucide-react";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SendMoney = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const sendMoney = useSendMoney();
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [txId, setTxId] = useState("");

  const handleConfirm = async () => {
    try {
      const tx = await sendMoney.mutateAsync({
        phone,
        amount: Number(amount),
        reference: reference || undefined,
      });
      setTxId(tx?.id || "");
      setStep("done");
    } catch (error: any) {
      toast.error(error.message || "Transfer failed");
    }
  };

  if (step === "done") {
    return (
      <TransactionSuccess
        title={t("Money Sent!", "টাকা পাঠানো হয়েছে!")}
        subtitle={t("Your transfer was successful", "আপনার ট্রান্সফার সফল হয়েছে")}
        amount={`৳${Number(amount).toLocaleString()}`}
        details={[
          { label: t("To", "প্রাপক"), value: phone },
          { label: t("Amount", "পরিমাণ"), value: `৳${Number(amount).toLocaleString()}` },
          { label: t("Fee", "ফি"), value: t("Free", "ফ্রি") },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txId.slice(0, 8).toUpperCase(), copyable: true },
          { label: t("Date", "তারিখ"), value: new Date().toLocaleDateString() },
          ...(reference ? [{ label: t("Reference", "রেফারেন্স"), value: reference }] : []),
        ]}
        primaryAction={{ label: t("Send Again", "আবার পাঠান"), onClick: () => { setStep("form"); setPhone(""); setAmount(""); setReference(""); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
      />
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
          <Button
            className="flex-1 gradient-primary text-primary-foreground"
            onClick={handleConfirm}
            disabled={sendMoney.isPending}
          >
            {sendMoney.isPending ? (
              <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              t("Confirm", "নিশ্চিত করুন")
            )}
          </Button>
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
              <Input placeholder="01XXX-XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-2xl font-bold h-14" />
            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map((q) => (
                <Button key={q} variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setAmount(String(q))}>৳{q.toLocaleString()}</Button>
              ))}
            </div>
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
