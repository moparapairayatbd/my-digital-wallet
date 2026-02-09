import { CheckCircle2, Copy, Download, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";

interface SuccessDetail {
  label: string;
  value: string;
  copyable?: boolean;
}

interface TransactionSuccessProps {
  title: string;
  subtitle?: string;
  amount?: string;
  details: SuccessDetail[];
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
  gradient?: string;
}

const TransactionSuccess = ({
  title,
  subtitle,
  amount,
  details,
  primaryAction,
  secondaryAction,
  gradient = "gradient-primary",
}: TransactionSuccessProps) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto animate-fade-in flex flex-col items-center min-h-[60vh]">
      {/* Success animation area */}
      <div className="relative py-8 flex flex-col items-center">
        {/* Decorative rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border-2 border-nitro-green/10 animate-ping" style={{ animationDuration: "2s" }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border-2 border-nitro-green/20" />
        </div>

        <div className="relative h-20 w-20 rounded-full bg-nitro-green/10 flex items-center justify-center mb-4 z-10">
          <div className="h-16 w-16 rounded-full bg-nitro-green/20 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-nitro-green" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-center z-10">{title}</h2>
        {subtitle && <p className="text-muted-foreground text-sm mt-1 z-10">{subtitle}</p>}

        {amount && (
          <div className="mt-4 z-10">
            <p className="text-4xl font-display font-bold tracking-tight">{amount}</p>
          </div>
        )}
      </div>

      {/* Details card */}
      <Card className="w-full mt-4">
        <CardContent className="p-0 divide-y divide-border">
          {details.map((detail, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <span className="text-sm text-muted-foreground">{detail.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-right max-w-[180px] truncate">{detail.value}</span>
                {detail.copyable && (
                  <button
                    onClick={() => { navigator.clipboard.writeText(detail.value); toast(t("Copied!", "কপি হয়েছে!")); }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="flex gap-3 mt-4 w-full">
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <Download className="h-3.5 w-3.5" /> {t("Receipt", "রসিদ")}
        </Button>
        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
          <Share2 className="h-3.5 w-3.5" /> {t("Share", "শেয়ার")}
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-6 w-full">
        <Button className={`w-full h-12 ${gradient} text-primary-foreground`} onClick={primaryAction.onClick}>
          {primaryAction.label}
        </Button>
        {secondaryAction && (
          <Button variant="ghost" className="w-full" onClick={secondaryAction.onClick}>
            <ArrowLeft className="h-4 w-4 mr-2" /> {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionSuccess;
