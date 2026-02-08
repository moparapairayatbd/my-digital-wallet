import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { savingsPlans, loanOffers } from "@/data/mockData";
import { PiggyBank, Banknote, CalendarClock, Globe, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const FinancialProducts = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Financial Products", "আর্থিক পণ্য")}</h1>
      <Tabs defaultValue="savings">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="savings">{t("Savings", "সঞ্চয়")}</TabsTrigger>
          <TabsTrigger value="loans">{t("Loans", "ঋণ")}</TabsTrigger>
          <TabsTrigger value="paylater">{t("Pay Later", "পে লেটার")}</TabsTrigger>
          <TabsTrigger value="remittance">{t("Remittance", "রেমিটেন্স")}</TabsTrigger>
        </TabsList>

        <TabsContent value="savings" className="space-y-3 mt-4">
          {savingsPlans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-nitro-green/10 flex items-center justify-center">
                    <PiggyBank className="h-5 w-5 text-nitro-green" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t(plan.name, plan.nameBn)}</p>
                    <p className="text-xs text-muted-foreground">৳{plan.amount.toLocaleString()}/{t("installment", "কিস্তি")} • {plan.duration} • {plan.rate}</p>
                    <p className="text-xs text-nitro-green font-medium">{t("Maturity", "ম্যাচুরিটি")}: ৳{plan.maturity.toLocaleString()}</p>
                  </div>
                </div>
                <Button size="sm" className="gradient-primary text-primary-foreground" onClick={() => toast.success(t("Enrolled!", "তালিকাভুক্ত!"))}>
                  {t("Enroll", "যোগ দিন")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="loans" className="space-y-3 mt-4">
          {loanOffers.map((loan) => (
            <Card key={loan.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-nitro-orange/10 flex items-center justify-center">
                    <Banknote className="h-5 w-5 text-nitro-orange" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{t(loan.name, loan.nameBn)}</p>
                    <p className="text-xs text-muted-foreground">{t("Up to", "সর্বোচ্চ")} ৳{loan.amount.toLocaleString()} • {loan.interest} • {loan.tenure}</p>
                  </div>
                </div>
                <Button size="sm" disabled={!loan.eligible} className={loan.eligible ? "gradient-primary text-primary-foreground" : ""}>
                  {loan.eligible ? t("Apply", "আবেদন") : t("Not Eligible", "যোগ্য নয়")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="paylater" className="space-y-3 mt-4">
          {[3, 6, 12].map((months) => (
            <Card key={months}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-nitro-purple/10 flex items-center justify-center">
                    <CalendarClock className="h-5 w-5 text-nitro-purple" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{months} {t("Month Installment", "মাসের কিস্তি")}</p>
                    <p className="text-xs text-muted-foreground">{t("0% interest on select merchants", "নির্বাচিত মার্চেন্টে ০% সুদ")}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-nitro-purple/10 text-nitro-purple">{t("Available", "উপলব্ধ")}</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="remittance" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-11 w-11 rounded-xl bg-nitro-blue/10 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-nitro-blue" />
                </div>
                <div>
                  <p className="font-semibold">{t("Receive International Funds", "আন্তর্জাতিক তহবিল গ্রহণ")}</p>
                  <p className="text-xs text-muted-foreground">{t("Receive money from abroad instantly", "বিদেশ থেকে তাৎক্ষণিক টাকা গ্রহণ")}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Sender Reference", "প্রেরকের রেফারেন্স")}</label>
                <Input placeholder={t("Enter reference number", "রেফারেন্স নম্বর দিন")} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground">{t("Track Transfer", "ট্রান্সফার ট্র্যাক করুন")}</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialProducts;
