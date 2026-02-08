import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { operators } from "@/data/mockData";
import { Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const packages = [
  { amount: 29, data: "250MB", validity: "3 days" },
  { amount: 49, data: "1GB", validity: "7 days" },
  { amount: 99, data: "3GB", validity: "15 days" },
  { amount: 199, data: "10GB", validity: "30 days" },
  { amount: 399, data: "25GB", validity: "30 days" },
  { amount: 599, data: "50GB", validity: "30 days" },
];

const MobileRecharge = () => {
  const { t } = useLanguage();
  const [type, setType] = useState<"prepaid" | "postpaid">("prepaid");
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Recharge Successful!", "রিচার্জ সফল!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()} → {phone}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setAmount(""); setPhone(""); }}>
          {t("Recharge Again", "আবার রিচার্জ করুন")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Mobile Recharge", "মোবাইল রিচার্জ")}</h1>
      <div className="flex gap-2">
        <Button variant={type === "prepaid" ? "default" : "outline"} className={type === "prepaid" ? "gradient-primary text-primary-foreground" : ""} onClick={() => setType("prepaid")}>{t("Prepaid", "প্রিপেইড")}</Button>
        <Button variant={type === "postpaid" ? "default" : "outline"} className={type === "postpaid" ? "gradient-primary text-primary-foreground" : ""} onClick={() => setType("postpaid")}>{t("Postpaid", "পোস্টপেইড")}</Button>
      </div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Phone Number", "ফোন নম্বর")}</label>
            <Input placeholder="01XXX-XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Operator", "অপারেটর")}</label>
            <div className="flex gap-2 flex-wrap">
              {operators.map((op) => (
                <Button key={op.id} variant={operator === op.id ? "default" : "outline"} size="sm"
                  className={operator === op.id ? "text-primary-foreground" : ""}
                  style={operator === op.id ? { backgroundColor: op.color } : {}}
                  onClick={() => setOperator(op.id)}>
                  {t(op.name, op.nameBn)}
                </Button>
              ))}
            </div>
          </div>
          {type === "prepaid" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Packages", "প্যাকেজ")}</label>
              <div className="grid grid-cols-2 gap-2">
                {packages.map((pkg) => (
                  <Card key={pkg.amount} className={`cursor-pointer transition-all ${amount === String(pkg.amount) ? "ring-2 ring-primary" : "hover:shadow-sm"}`}
                    onClick={() => setAmount(String(pkg.amount))}>
                    <CardContent className="p-3 text-center">
                      <p className="font-bold text-primary">৳{pkg.amount}</p>
                      <p className="text-xs font-medium">{pkg.data}</p>
                      <p className="text-[10px] text-muted-foreground">{pkg.validity}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
          </div>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!phone || !amount} onClick={() => setDone(true)}>
            <Phone className="h-4 w-4 mr-2" /> {t("Recharge Now", "এখনই রিচার্জ করুন")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileRecharge;
