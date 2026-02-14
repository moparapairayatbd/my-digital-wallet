import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCreateMoneyRequest, useMoneyRequests } from "@/hooks/useWallet";
import { HandCoins, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const RequestMoney = () => {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const createRequest = useCreateMoneyRequest();
  const { data: requests, isLoading } = useMoneyRequests();

  const handleRequest = async () => {
    if (!phone || !amount) return;
    try {
      await createRequest.mutateAsync({ phone, amount: Number(amount), note: note || undefined });
      toast.success(t("Request sent!", "অনুরোধ পাঠানো হয়েছে!"));
      setPhone(""); setAmount(""); setNote("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send request");
    }
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
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Note (optional)", "নোট (ঐচ্ছিক)")}</label>
            <Input placeholder={t("What's this for?", "এটি কিসের জন্য?")} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!phone || !amount || createRequest.isPending} onClick={handleRequest}>
            {createRequest.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <HandCoins className="h-4 w-4 mr-2" />}
            {t("Send Request", "অনুরোধ পাঠান")}
          </Button>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Your Requests", "আপনার অনুরোধ")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-3 items-center">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : requests && requests.length > 0 ? (
              requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center ${req.status === "pending" ? "bg-nitro-orange/10" : "bg-nitro-green/10"}`}>
                      {req.status === "pending" ? <Clock className="h-4 w-4 text-nitro-orange" /> : <CheckCircle className="h-4 w-4 text-nitro-green" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{req.target_phone}</p>
                      <p className="text-xs text-muted-foreground">{new Date(req.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">৳{Number(req.amount).toLocaleString()}</span>
                    <Badge variant={req.status === "pending" ? "secondary" : "default"} className={req.status === "completed" ? "bg-nitro-green" : ""}>
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No requests yet", "এখনও কোনো অনুরোধ নেই")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestMoney;
