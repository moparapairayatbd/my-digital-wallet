import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";
import { usePayLaterActivate, useTransactions } from "@/hooks/useWallet";
import { toast } from "sonner";

const payLaterOffers = [
  { id: "pl1", merchant: "Daraz", icon: "🛒", amount: 5000, installments: 3, monthly: 1700, interest: "0%", available: true },
  { id: "pl2", merchant: "Chaldal", icon: "🛒", amount: 2000, installments: 2, monthly: 1000, interest: "0%", available: true },
  { id: "pl3", merchant: "Rokomari", icon: "📚", amount: 3000, installments: 3, monthly: 1050, interest: "5%", available: true },
  { id: "pl4", merchant: "Electronics Hub", icon: "📱", amount: 25000, installments: 6, monthly: 4350, interest: "4%", available: false },
];

const PayLater = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState<typeof payLaterOffers[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txData, setTxData] = useState<any>(null);
  const payLater = usePayLaterActivate();
  const { data: transactions } = useTransactions();

  const activeInstallments = (transactions || [])
    .filter(tx => tx.category === "pay_later")
    .slice(0, 5);

  const handleActivate = async (offer: typeof payLaterOffers[0]) => {
    try {
      const tx = await payLater.mutateAsync({
        merchantName: offer.merchant,
        amount: offer.amount,
        installments: offer.installments,
        monthly: offer.monthly,
      });
      setSelectedOffer(offer);
      setTxData(tx);
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (showSuccess && selectedOffer) {
    return (
      <TransactionSuccess
        title={t("Pay Later Activated!", "পে লেটার সক্রিয়!")}
        subtitle={t("Your installment plan is set up", "আপনার কিস্তি পরিকল্পনা সেট আপ হয়েছে")}
        details={[
          { label: t("Merchant", "মার্চেন্ট"), value: selectedOffer.merchant },
          { label: t("Total Amount", "মোট পরিমাণ"), value: `৳${selectedOffer.amount.toLocaleString()}` },
          { label: t("Installments", "কিস্তি"), value: `${selectedOffer.installments}x ৳${selectedOffer.monthly.toLocaleString()}` },
          { label: t("Interest", "সুদ"), value: selectedOffer.interest },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txData?.id?.slice(0, 8), copyable: true },
        ]}
        primaryAction={{ label: t("Done", "সম্পন্ন"), onClick: () => { setShowSuccess(false); setSelectedOffer(null); setTxData(null); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        gradient="gradient-secondary"
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">{t("Pay Later", "পে লেটার")}</h1>
        <p className="text-muted-foreground text-sm">{t("Buy now, pay in installments", "এখন কিনুন, কিস্তিতে পরিশোধ করুন")}</p>
      </div>

      <Card className="gradient-secondary text-primary-foreground border-0">
        <CardContent className="p-5">
          <p className="text-sm opacity-80">{t("Available Credit", "উপলব্ধ ক্রেডিট")}</p>
          <p className="text-3xl font-display font-bold mt-1">৳25,000</p>
          <div className="h-2 bg-white/20 rounded-full mt-3 overflow-hidden">
            <div className="h-full w-[20%] bg-white rounded-full" />
          </div>
          <p className="text-xs opacity-70 mt-1">৳5,000 {t("used", "ব্যবহৃত")} / ৳30,000 {t("total", "মোট")}</p>
        </CardContent>
      </Card>

      {activeInstallments.length > 0 && (
        <div>
          <h2 className="font-display font-semibold mb-3">{t("Active Plans", "সক্রিয় পরিকল্পনা")}</h2>
          {activeInstallments.map((inst) => (
            <Card key={inst.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{inst.recipient_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(inst.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">{t("Active", "সক্রিয়")}</span>
                </div>
                <p className="text-sm font-medium mt-2">৳{Number(inst.amount).toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Available Offers", "উপলব্ধ অফার")}</h2>
        <div className="space-y-3">
          {payLaterOffers.map((offer) => (
            <Card key={offer.id} className={!offer.available ? "opacity-50" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{offer.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{offer.merchant}</p>
                    <p className="text-xs text-muted-foreground">{offer.installments}x ৳{offer.monthly.toLocaleString()} • {offer.interest} {t("interest", "সুদ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-sm">৳{offer.amount.toLocaleString()}</p>
                    <Button size="sm" className="mt-1 h-7 text-xs" disabled={!offer.available || payLater.isPending} onClick={() => handleActivate(offer)}>
                      {t("Activate", "সক্রিয়")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PayLater;
