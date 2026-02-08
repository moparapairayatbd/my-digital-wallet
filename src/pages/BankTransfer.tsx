import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { banks } from "@/data/mockData";
import { Building2, CheckCircle } from "lucide-react";

const BankTransfer = () => {
  const { t } = useLanguage();
  const [bank, setBank] = useState("");
  const [account, setAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Transfer Successful!", "ট্রান্সফার সফল!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setAmount(""); setAccount(""); setBank(""); }}>
          {t("Transfer Again", "আবার ট্রান্সফার করুন")}
        </Button>
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
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!bank || !account || !amount} onClick={() => setDone(true)}>
            <Building2 className="h-4 w-4 mr-2" /> {t("Transfer", "ট্রান্সফার করুন")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankTransfer;
