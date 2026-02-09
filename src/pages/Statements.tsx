import { ArrowLeft, Download, FileText, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { monthlyStatements } from "@/data/mockData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Statements = () => {
  const { t } = useLanguage();
  const current = monthlyStatements[0];

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Statements", "স্টেটমেন্ট")}</h1>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="gradient-success text-primary-foreground border-0">
          <CardContent className="p-3 text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 opacity-80" />
            <p className="font-bold text-lg">৳{current.totalIn.toLocaleString()}</p>
            <p className="text-[10px] opacity-70">{t("Total In", "মোট আয়")}</p>
          </CardContent>
        </Card>
        <Card className="gradient-primary text-primary-foreground border-0">
          <CardContent className="p-3 text-center">
            <TrendingDown className="h-4 w-4 mx-auto mb-1 opacity-80" />
            <p className="font-bold text-lg">৳{current.totalOut.toLocaleString()}</p>
            <p className="text-[10px] opacity-70">{t("Total Out", "মোট ব্যয়")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <FileText className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="font-bold text-lg text-nitro-green">৳{(current.totalIn - current.totalOut).toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground">{t("Net", "নেট")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Statements */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Monthly Statements", "মাসিক স্টেটমেন্ট")}</h2>
        <div className="space-y-3">
          {monthlyStatements.map((stmt, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center justify-between touch-target">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{stmt.month}</p>
                    <p className="text-xs text-muted-foreground">
                      {stmt.transactions} {t("transactions", "লেনদেন")} • {t("Net", "নেট")}: ৳{(stmt.totalIn - stmt.totalOut).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-9 w-9"
                  onClick={() => toast.success("Statement downloaded!")}>
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statements;
