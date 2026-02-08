import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { pendingRequests } from "@/data/mockData";
import { HandCoins, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RequestMoney = () => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");

  const handleRequest = () => {
    toast.success(t("Request sent!", "অনুরোধ পাঠানো হয়েছে!"));
    setPhone(""); setAmount("");
  };

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Request Money", "টাকা অনুরোধ করুন")}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Phone Number", "ফোন নম্বর")}</label>
            <Input placeholder="01XXX-XXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
          </div>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!phone || !amount} onClick={handleRequest}>
            <HandCoins className="h-4 w-4 mr-2" /> {t("Send Request", "অনুরোধ পাঠান")}
          </Button>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Pending Requests", "মুলতুবি অনুরোধ")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {pendingRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-full flex items-center justify-center ${req.status === "pending" ? "bg-nitro-orange/10" : "bg-nitro-green/10"}`}>
                    {req.status === "pending" ? <Clock className="h-4 w-4 text-nitro-orange" /> : <CheckCircle className="h-4 w-4 text-nitro-green" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{req.phone}</p>
                    <p className="text-xs text-muted-foreground">{req.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">৳{req.amount.toLocaleString()}</span>
                  <Badge variant={req.status === "pending" ? "secondary" : "default"} className={req.status === "completed" ? "bg-nitro-green" : ""}>
                    {req.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestMoney;
