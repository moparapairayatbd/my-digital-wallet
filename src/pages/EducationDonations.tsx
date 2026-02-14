import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { educationInstitutions, donationCategories } from "@/data/mockData";
import { GraduationCap, Heart, Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useEducationPayment, useDonation, useWallet } from "@/hooks/useWallet";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";

const quickAmounts = [100, 500, 1000, 5000];

const EducationDonations = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [feeAmount, setFeeAmount] = useState("");
  const [selectedInst, setSelectedInst] = useState<typeof educationInstitutions[0] | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txData, setTxData] = useState<any>(null);
  const [successType, setSuccessType] = useState<"education" | "donation">("education");

  const eduPayment = useEducationPayment();
  const donation = useDonation();
  const { data: wallet } = useWallet();

  const handleFeePayment = async (inst: typeof educationInstitutions[0]) => {
    setSelectedInst(inst);
    const amt = Number(feeAmount);
    if (!amt || amt <= 0) {
      toast.error(t("Enter a valid amount", "সঠিক পরিমাণ দিন"));
      return;
    }
    if (wallet && wallet.balance < amt) {
      toast.error(t("Insufficient balance", "অপর্যাপ্ত ব্যালেন্স"));
      return;
    }
    try {
      const tx = await eduPayment.mutateAsync({ institutionName: inst.name, amount: amt });
      setTxData(tx);
      setSuccessType("education");
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDonation = async (cat: typeof donationCategories[0]) => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error(t("Enter a valid amount", "সঠিক পরিমাণ দিন"));
      return;
    }
    if (wallet && wallet.balance < amt) {
      toast.error(t("Insufficient balance", "অপর্যাপ্ত ব্যালেন্স"));
      return;
    }
    try {
      const tx = await donation.mutateAsync({ categoryName: cat.name, amount: amt });
      setTxData(tx);
      setSuccessType("donation");
      setSelectedInst(null);
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (showSuccess && txData) {
    return (
      <TransactionSuccess
        title={successType === "education" ? t("Fee Paid!", "ফি প্রদান সম্পন্ন!") : t("Donated Successfully!", "দান সফল!")}
        subtitle={successType === "education" ? t("Education fee payment complete", "শিক্ষা ফি পেমেন্ট সম্পন্ন") : t("Your donation has been sent", "আপনার দান পাঠানো হয়েছে")}
        amount={`৳${Number(txData.amount).toLocaleString()}`}
        details={[
          { label: t("Recipient", "প্রাপক"), value: txData.recipient_name || "N/A" },
          { label: t("Amount", "পরিমাণ"), value: `৳${Number(txData.amount).toLocaleString()}` },
          { label: t("Transaction ID", "লেনদেন আইডি"), value: txData.id?.slice(0, 8), copyable: true },
          { label: t("Date", "তারিখ"), value: new Date().toLocaleDateString() },
        ]}
        primaryAction={{ label: t("Done", "সম্পন্ন"), onClick: () => { setShowSuccess(false); setTxData(null); setAmount(""); setFeeAmount(""); } }}
        secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        gradient="gradient-success"
      />
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Education & Donations", "শিক্ষা ও দান")}</h1>
      {wallet && <p className="text-xs text-muted-foreground">{t("Balance", "ব্যালেন্স")}: ৳{wallet.balance.toLocaleString()}</p>}
      <Tabs defaultValue="education">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="education">{t("Education", "শিক্ষা")}</TabsTrigger>
          <TabsTrigger value="donations">{t("Donations", "দান")}</TabsTrigger>
        </TabsList>

        <TabsContent value="education" className="space-y-4 mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t("Search institution...", "প্রতিষ্ঠান খুঁজুন...")} value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Fee Amount (৳)", "ফি পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} />
          </div>
          {educationInstitutions.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((inst) => (
            <Card key={inst.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{t(inst.name, inst.nameBn)}</span>
                </div>
                <Button size="sm" variant="outline" disabled={eduPayment.isPending} onClick={() => handleFeePayment(inst)}>
                  {eduPayment.isPending ? "..." : t("Pay Fee", "ফি দিন")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="donations" className="space-y-4 mt-4">
          {donationCategories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-destructive" />
                  </div>
                  <span className="font-medium text-sm">{t(cat.name, cat.nameBn)}</span>
                </div>
                <div className="flex gap-2">
                  {quickAmounts.map((amt) => (
                    <Button key={amt} variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setAmount(String(amt))}>
                      ৳{amt}
                    </Button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input type="number" placeholder="৳ Custom" className="flex-1" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <Button className="gradient-primary text-primary-foreground" disabled={donation.isPending} onClick={() => handleDonation(cat)}>
                    {donation.isPending ? "..." : t("Donate", "দান করুন")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationDonations;
