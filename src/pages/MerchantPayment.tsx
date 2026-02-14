import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { QrCode, Search, Loader2 } from "lucide-react";
import { useMerchantPayment, useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import TransactionSuccess from "@/components/TransactionSuccess";
import { toast } from "sonner";

const MerchantPayment = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const merchantPay = useMerchantPayment();
  const { data: wallet } = useWallet();

  const handleConfirm = async () => {
    try {
      const tx = await merchantPay.mutateAsync({
        merchantId,
        merchantName: merchantId,
        amount: Number(amount),
      });
      setTxId(tx?.id || "");
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    }
  };

  if (step === "done") {
    return (
      <TransactionSuccess
        title={t("Payment Successful!", "পেমেন্ট সফল!")}
        subtitle={t("Merchant payment complete", "মার্চেন্ট পেমেন্ট সম্পন্ন")}
        amount={`৳${Number(amount).toLocaleString()}`}
        details={[
          { label: t("Merchant", "মার্চেন্ট"), value: merchantId },
          { label: t("Amount", "পরিমাণ"), value: `৳${Number(amount).toLocaleString()}` },
          { label: t("Fee", "ফি"), value: t("Free", "ফ্রি") },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txId.slice(0, 8).toUpperCase(), copyable: true },
          { label: t("Date", "তারিখ"), value: new Date().toLocaleDateString() },
        ]}
        primaryAction={{ label: t("Pay Again", "আবার পে করুন"), onClick: () => { setStep("form"); setAmount(""); setMerchantId(""); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
      />
    );
  }

  if (step === "confirm") {
    return (
      <div className="max-w-md mx-auto animate-fade-in space-y-4">
        <h1 className="text-xl font-display font-bold">{t("Confirm Payment", "পেমেন্ট নিশ্চিত করুন")}</h1>
        <Card>
          <CardContent className="p-6 space-y-3">
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Merchant", "মার্চেন্ট")}</span><span className="font-medium">{merchantId}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Amount", "পরিমাণ")}</span><span className="font-bold text-lg">৳{Number(amount).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Fee", "ফি")}</span><span className="text-nitro-green font-medium">{t("Free", "ফ্রি")}</span></div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>{t("Back", "পেছনে")}</Button>
          <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleConfirm} disabled={merchantPay.isPending}>
            {merchantPay.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Confirm", "নিশ্চিত করুন")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Merchant Payment", "মার্চেন্ট পেমেন্ট")}</h1>
      <Card className="gradient-info text-primary-foreground border-0">
        <CardContent className="p-8 flex flex-col items-center gap-3">
          <QrCode className="h-16 w-16 opacity-80" />
          <p className="font-medium">{t("Scan QR Code", "QR কোড স্ক্যান করুন")}</p>
          <p className="text-xs opacity-70">{t("Point your camera at a merchant QR", "মার্চেন্টের QR কোডে ক্যামেরা তাক করুন")}</p>
        </CardContent>
      </Card>
      <div className="text-center text-sm text-muted-foreground">{t("or enter manually", "অথবা ম্যানুয়ালি লিখুন")}</div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Merchant ID / Number", "মার্চেন্ট আইডি / নম্বর")}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("Search merchant...", "মার্চেন্ট খুঁজুন...")} value={merchantId} onChange={(e) => setMerchantId(e.target.value)} className="pl-10" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
          </div>
          <p className="text-xs text-muted-foreground">{t("Available Balance", "উপলব্ধ ব্যালেন্স")}: ৳{wallet?.balance ? Number(wallet.balance).toLocaleString() : "0"}</p>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!merchantId || !amount} onClick={() => setStep("confirm")}>
            {t("Pay Now", "এখনই পে করুন")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantPayment;
