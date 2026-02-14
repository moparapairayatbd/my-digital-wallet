import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile, useTransactions } from "@/hooks/useWallet";
import { QrCode, Copy, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const ReceiveMoney = () => {
  const { t } = useLanguage();
  const { data: profile } = useProfile();
  const { data: transactions, isLoading } = useTransactions();

  const phone = profile?.phone || "...";
  const receivedTxs = transactions?.filter(tx => tx.type === "receive" || tx.type === "add_money") || [];

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Receive Money", "টাকা গ্রহণ করুন")}</h1>
      <Card className="text-center">
        <CardContent className="p-6 space-y-4">
          <div className="h-48 w-48 mx-auto bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-border">
            <QrCode className="h-24 w-24 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t("Show this QR code to receive money", "টাকা পেতে এই QR কোড দেখান")}</p>
          <div className="flex items-center justify-center gap-2 bg-muted rounded-lg p-3">
            <span className="font-mono font-semibold">{phone}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(phone); toast.success(t("Copied!", "কপি হয়েছে!")); }}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Recently Received", "সম্প্রতি প্রাপ্ত")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-3 items-center">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-1"><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : receivedTxs.length > 0 ? (
              receivedTxs.slice(0, 10).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-nitro-green/10 flex items-center justify-center">
                      <ArrowDownLeft className="h-4 w-4 text-nitro-green" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.sender_name || tx.description || "Received"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm text-nitro-green">+৳{Number(tx.amount).toLocaleString()}</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground text-sm">
                {t("No received transactions yet", "এখনও কোনো প্রাপ্তি নেই")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiveMoney;
