import { useState } from "react";
import { QrCode, Flashlight, Camera, Search, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";

const recentMerchants = [
  { id: "m1", name: "Shwapno", category: "Grocery", icon: "🛒" },
  { id: "m2", name: "Pathao", category: "Ride", icon: "🏍️" },
  { id: "m3", name: "Foodpanda", category: "Food", icon: "🍕" },
  { id: "m4", name: "Daraz", category: "Shopping", icon: "📦" },
  { id: "m5", name: "Nagad Store", category: "General", icon: "🏪" },
];

const QRScanner = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"scan" | "merchant" | "amount" | "done">("scan");
  const [merchantId, setMerchantId] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState<typeof recentMerchants[0] | null>(null);

  const handleMerchantSelect = (merchant: typeof recentMerchants[0]) => {
    setSelectedMerchant(merchant);
    setMode("amount");
  };

  if (mode === "done" && selectedMerchant) {
    return (
      <TransactionSuccess
        title={t("Payment Successful!", "পেমেন্ট সফল!")}
        subtitle={t("Merchant payment complete", "মার্চেন্ট পেমেন্ট সম্পন্ন")}
        amount={`৳${Number(amount).toLocaleString()}`}
        details={[
          { label: t("Merchant", "মার্চেন্ট"), value: selectedMerchant.name },
          { label: t("Category", "ক্যাটাগরি"), value: selectedMerchant.category },
          { label: t("Amount", "পরিমাণ"), value: `৳${Number(amount).toLocaleString()}` },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: `QR${Date.now().toString().slice(-8)}`, copyable: true },
          { label: t("Date", "তারিখ"), value: new Date().toLocaleDateString() },
        ]}
        primaryAction={{ label: t("Done", "সম্পন্ন"), onClick: () => { setMode("scan"); setAmount(""); setSelectedMerchant(null); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
      />
    );
  }

  if (mode === "amount" && selectedMerchant) {
    return (
      <div className="max-w-md mx-auto animate-fade-in space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setMode("scan")}>← {t("Back", "পেছনে")}</Button>
        <div className="text-center">
          <span className="text-4xl">{selectedMerchant.icon}</span>
          <h2 className="font-display font-bold text-lg mt-2">{selectedMerchant.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedMerchant.category}</p>
        </div>
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
              <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-2xl font-bold h-14 text-center" />
            </div>
            <Button className="w-full gradient-primary text-primary-foreground h-12" disabled={!amount} onClick={() => setMode("done")}>
              {t("Pay", "পে করুন")} ৳{amount || "0"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold">{t("QR Scanner", "QR স্ক্যানার")}</h1>
        <p className="text-muted-foreground text-sm">{t("Scan to pay any merchant", "যেকোনো মার্চেন্টে পে করতে স্ক্যান করুন")}</p>
      </div>

      {/* Scanner Area */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square max-h-[300px] bg-gradient-to-b from-[hsl(240,10%,10%)] to-[hsl(240,10%,15%)] flex items-center justify-center">
          {/* Scanner frame */}
          <div className="relative h-48 w-48">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white rounded-tl-lg" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white rounded-tr-lg" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white rounded-bl-lg" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white rounded-br-lg" />
            {/* Scanning line animation */}
            <div className="absolute left-2 right-2 h-0.5 bg-primary animate-bounce" style={{ top: "50%" }} />
          </div>
          <div className="absolute bottom-4 flex gap-4">
            <Button variant="ghost" size="icon" className="text-white bg-white/10 rounded-full"><Flashlight className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon" className="text-white bg-white/10 rounded-full"><Camera className="h-5 w-5" /></Button>
          </div>
        </div>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("Position QR code within the frame", "ফ্রেমের মধ্যে QR কোড রাখুন")}</p>
        </CardContent>
      </Card>

      {/* Search Merchant */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder={t("Search merchant...", "মার্চেন্ট খুঁজুন...")} value={merchantId} onChange={(e) => setMerchantId(e.target.value)} className="pl-10" />
      </div>

      {/* Recent Merchants */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Recent Merchants", "সাম্প্রতিক মার্চেন্ট")}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {recentMerchants.map((m) => (
            <button key={m.id} onClick={() => handleMerchantSelect(m)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card hover:shadow-md transition-all">
              <span className="text-2xl">{m.icon}</span>
              <span className="text-xs font-medium text-center">{m.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
