import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { banks } from "@/data/mockData";
import { Building2, Loader2 } from "lucide-react";
import { useBankTransfer, useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import TransactionSuccess from "@/components/TransactionSuccess";
import { toast } from "sonner";

const BankTransfer = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const bankTransfer = useBankTransfer();
  const { data: wallet } = useWallet();

  const bankName = banks.find(b => b.id === bank)?.name || bank;

  const handleConfirm = async () => {
    try {
      const tx = await bankTransfer.mutateAsync({
        bankName,
        accountNumber: account,
        amount: Number(amount),
      });
      setTxId(tx?.id || "");
      setStep("done");
    } catch (err: any) {
      toast.error(err.message || "Transfer failed");
    }
  };

  if (step === "done") {
    return (
      <TransactionSuccess
        title={t("Transfer Successful!", "ট্রান্সফার সফল!")}
        subtitle={t("Bank transfer complete", "ব্যাংক ট্রান্সফার সম্পন্ন")}
        amount={`৳${Number(amount).toLocaleString()}`}
        details={[
          { label: t("Bank", "ব্যাংক"), value: bankName },
          { label: t("Account", "অ্যাকাউন্ট"), value: account },
          { label: t("Amount", "পরিমাণ"), value: `৳${Number(amount).toLocaleString()}` },
          { label: t("Fee", "ফি"), value: "৳10" },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txId.slice(0, 8).toUpperCase(), copyable: true },
          { label: t("Date", "তারিখ"), value: new Date().toLocaleDateString() },
        ]}
        primaryAction={{ label: t("Transfer Again", "আবার ট্রান্সফার করুন"), onClick: () => { setStep("form"); setAmount(""); setAccount(""); setBank(""); } }}
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
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Bank", "ব্যাংক")}</span><span className="font-medium">{bankName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Account", "অ্যাকাউন্ট")}</span><span className="font-medium">{account}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Amount", "পরিমাণ")}</span><span className="font-bold text-lg">৳{Number(amount).toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">{t("Fee", "ফি")}</span><span>৳10</span></div>
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>{t("Back", "পেছনে")}</Button>
          <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handleConfirm} disabled={bankTransfer.isPending}>
            {bankTransfer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Confirm", "নিশ্চিত করুন")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Bank Transfer", "ব্যাংক ট্রান্সফার")}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Select Bank", "ব্যাংক নির্বাচন করুন")}</label>
            <Select value={bank} onValueChange={setBank}>
              <SelectTrigger><SelectValue placeholder={t("Choose a bank", "একটি ব্যাংক বাছুন")} /></SelectTrigger>
              <SelectContent>
                {banks.map((b) => (
                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Account Number", "অ্যাকাউন্ট নম্বর")}</label>
            <Input placeholder="XXXX XXXX XXXX" value={account} onChange={(e) => setAccount(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
          </div>
          <p className="text-xs text-muted-foreground">{t("Available Balance", "উপলব্ধ ব্যালেন্স")}: ৳{wallet?.balance ? Number(wallet.balance).toLocaleString() : "0"}</p>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!bank || !account || !amount} onClick={() => setStep("confirm")}>
            <Building2 className="h-4 w-4 mr-2" /> {t("Transfer", "ট্রান্সফার করুন")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankTransfer;
