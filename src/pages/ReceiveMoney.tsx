import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { user, transactions } from "@/data/mockData";
import { QrCode, Copy, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ReceiveMoney = () => {
  const { t } = useLanguage();

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
            <span className="font-mono font-semibold">{user.phone}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(t("Copied!", "কপি হয়েছে!"))}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Recently Received", "সম্প্রতি প্রাপ্ত")}</h2>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {transactions.filter(tx => tx.type === "receive").map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-nitro-green/10 flex items-center justify-center">
                    <ArrowDownLeft className="h-4 w-4 text-nitro-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.from}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <span className="font-semibold text-sm text-nitro-green">+৳{Math.abs(tx.amount).toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReceiveMoney;
