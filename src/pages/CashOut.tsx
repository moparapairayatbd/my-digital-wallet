import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { agentPoints } from "@/data/mockData";
import { ArrowDownToLine, MapPin, Phone, CheckCircle, Loader2 } from "lucide-react";
import { useCashOut, useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

const CashOut = () => {
  const { t } = useLanguage();
  const [agentNo, setAgentNo] = useState("");
  const [amount, setAmount] = useState("");
  const [done, setDone] = useState(false);
  const cashOut = useCashOut();
  const { data: wallet } = useWallet();

  const handleCashOut = async () => {
    if (!agentNo || !amount) return;
    try {
      await cashOut.mutateAsync({ amount: Number(amount), agent: agentNo });
      setDone(true);
    } catch (err: any) {
      toast.error(err.message || "Cash out failed");
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4">
          <CheckCircle className="h-10 w-10 text-nitro-green" />
        </div>
        <h2 className="font-display text-xl font-bold">{t("Cash Out Successful!", "ক্যাশ আউট সফল!")}</h2>
        <p className="text-muted-foreground mt-1">৳{Number(amount).toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">{t("Remaining Balance", "অবশিষ্ট ব্যালেন্স")}: ৳{wallet?.balance ? Number(wallet.balance).toLocaleString() : "..."}</p>
        <Button className="mt-6 gradient-primary text-primary-foreground" onClick={() => { setDone(false); setAmount(""); setAgentNo(""); }}>
          {t("Cash Out Again", "আবার ক্যাশ আউট করুন")}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Cash Out", "ক্যাশ আউট")}</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Agent Number", "এজেন্ট নম্বর")}</label>
            <Input placeholder="01XXX-XXXXXX" value={agentNo} onChange={(e) => setAgentNo(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("Amount (৳)", "পরিমাণ (৳)")}</label>
            <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="text-xl font-bold h-12" />
          </div>
          <p className="text-xs text-muted-foreground">{t("Available Balance", "উপলব্ধ ব্যালেন্স")}: ৳{wallet?.balance ? Number(wallet.balance).toLocaleString() : "0"}</p>
          <Button className="w-full gradient-primary text-primary-foreground" disabled={!agentNo || !amount || cashOut.isPending} onClick={handleCashOut}>
            {cashOut.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowDownToLine className="h-4 w-4 mr-2" />}
            {t("Cash Out", "ক্যাশ আউট করুন")}
          </Button>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Nearby Agents", "নিকটস্থ এজেন্ট")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {agentPoints.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-nitro-blue/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-nitro-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t(agent.name, agent.nameBn)}</p>
                    <p className="text-xs text-muted-foreground">{agent.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {agent.phone}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CashOut;
