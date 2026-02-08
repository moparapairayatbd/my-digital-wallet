import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { QrCode, Search, CheckCircle } from "lucide-react";

const MerchantPayment = () => {
  const { t } = useLanguage();
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Payment Successful!", "পেমেন্ট সফল!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setAmount(""); setMerchantId(""); }}>
          {t("Pay Again", "আবার পে করুন")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Merchant Payment", "মার্চেন্ট পেমেন্ট")}</h1>
      {/* QR Placeholder */}
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
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!merchantId || !amount} onClick={() => setDone(true)}>
            {t("Pay Now", "এখনই পে করুন")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchantPayment;
