import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";
import { useRemittance, useTransactions } from "@/hooks/useWallet";
import { toast } from "sonner";

const corridors = [
  { from: "🇺🇸", fromCode: "USD", to: "🇧🇩", toCode: "BDT", rate: 121.50 },
  { from: "🇬🇧", fromCode: "GBP", to: "🇧🇩", toCode: "BDT", rate: 153.20 },
  { from: "🇸🇦", fromCode: "SAR", to: "🇧🇩", toCode: "BDT", rate: 32.40 },
  { from: "🇦🇪", fromCode: "AED", to: "🇧🇩", toCode: "BDT", rate: 33.08 },
  { from: "🇲🇾", fromCode: "MYR", to: "🇧🇩", toCode: "BDT", rate: 25.90 },
];

const Remittance = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<"main" | "receive" | "done">("main");
  const [selectedCorridor, setSelectedCorridor] = useState(corridors[0]);
  const [amount, setAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [txData, setTxData] = useState<any>(null);
  const remittance = useRemittance();
  const { data: transactions } = useTransactions();

  const recentRemittances = (transactions || [])
    .filter(tx => tx.type === "remittance")
    .slice(0, 5);

  const handleConfirm = async () => {
    const foreignAmt = Number(amount);
    if (!foreignAmt || !senderName) return;
    const bdtAmount = Math.round(foreignAmt * selectedCorridor.rate);
    try {
      const tx = await remittance.mutateAsync({
        senderName,
        foreignAmount: foreignAmt,
        foreignCurrency: selectedCorridor.fromCode,
        bdtAmount,
        rate: selectedCorridor.rate,
      });
      setTxData(tx);
      setStep("done");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (step === "done" && txData) {
    return (
      <TransactionSuccess
        title={t("Remittance Received!", "রেমিট্যান্স গ্রহণ করা হয়েছে!")}
        subtitle={t("International transfer complete", "আন্তর্জাতিক ট্রান্সফার সম্পন্ন")}
        amount={`৳${Number(txData.amount).toLocaleString()}`}
        details={[
          { label: t("Sender", "প্রেরক"), value: senderName },
          { label: t("Foreign Amount", "বিদেশী পরিমাণ"), value: `${selectedCorridor.fromCode} ${Number(amount).toLocaleString()}` },
          { label: t("Exchange Rate", "বিনিময় হার"), value: `1 ${selectedCorridor.fromCode} = ৳${selectedCorridor.rate}` },
          { label: t("BDT Amount", "BDT পরিমাণ"), value: `৳${Number(txData.amount).toLocaleString()}` },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txData.id?.slice(0, 8), copyable: true },
        ]}
        primaryAction={{ label: t("Done", "সম্পন্ন"), onClick: () => { setStep("main"); setAmount(""); setSenderName(""); setTxData(null); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        gradient="gradient-info"
      />
    );
  }

  if (step === "receive") {
    return (
      <div className="max-w-md mx-auto animate-fade-in space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setStep("main")}>← {t("Back", "পেছনে")}</Button>
        <h1 className="text-xl font-display font-bold">{t("Receive Remittance", "রেমিট্যান্স গ্রহণ")}</h1>
        <Card className="border-0 text-white overflow-hidden" style={{ background: "linear-gradient(135deg, hsl(210, 85%, 55%), hsl(280, 65%, 55%))" }}>
          <CardContent className="p-4 text-center">
            <p className="text-2xl">{selectedCorridor.from} → {selectedCorridor.to}</p>
            <p className="text-sm opacity-80 mt-1">1 {selectedCorridor.fromCode} = ৳{selectedCorridor.rate}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Sender Name", "প্রেরকের নাম")}</label>
              <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder={t("Enter sender name", "প্রেরকের নাম দিন")} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t(`Amount (${selectedCorridor.fromCode})`, `পরিমাণ (${selectedCorridor.fromCode})`)}</label>
              <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="text-xl font-bold h-12" />
            </div>
            {amount && (
              <div className="p-3 rounded-lg bg-muted text-center">
                <p className="text-sm text-muted-foreground">{t("You'll receive", "আপনি পাবেন")}</p>
                <p className="text-2xl font-display font-bold mt-1">৳{(Number(amount) * selectedCorridor.rate).toLocaleString()}</p>
              </div>
            )}
            <Button className="w-full gradient-primary text-primary-foreground h-12" disabled={!amount || !senderName || remittance.isPending} onClick={handleConfirm}>
              {remittance.isPending ? t("Processing...", "প্রক্রিয়াকরণ...") : t("Confirm Receipt", "গ্রহণ নিশ্চিত করুন")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">{t("Remittance", "রেমিট্যান্স")}</h1>
        <p className="text-muted-foreground text-sm">{t("Receive international money transfers", "আন্তর্জাতিক মানি ট্রান্সফার গ্রহণ করুন")}</p>
      </div>

      <div>
        <h2 className="font-display font-semibold mb-3">{t("Exchange Rates", "বিনিময় হার")}</h2>
        <div className="space-y-2">
          {corridors.map((cor) => (
            <button key={cor.fromCode} onClick={() => { setSelectedCorridor(cor); setStep("receive"); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border hover:shadow-md transition-all">
              <span className="text-xl">{cor.from}</span>
              <div className="flex-1 text-left">
                <p className="font-medium text-sm">{cor.fromCode} → {cor.toCode}</p>
                <p className="text-xs text-muted-foreground">1 {cor.fromCode} = ৳{cor.rate}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {recentRemittances.length > 0 && (
        <div>
          <h2 className="font-display font-semibold mb-3">{t("Recent Remittances", "সাম্প্রতিক রেমিট্যান্স")}</h2>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {recentRemittances.map((rem) => (
                <div key={rem.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{rem.sender_name || "International"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(rem.created_at).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-sm text-green-600">+৳{Number(rem.amount).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Remittance;
