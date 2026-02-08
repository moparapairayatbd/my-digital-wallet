import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { educationInstitutions, donationCategories } from "@/data/mockData";
import { GraduationCap, Heart, Search, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const quickAmounts = [100, 500, 1000, 5000];

const EducationDonations = () => {
  const { t } = useLanguage();
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-md mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Education & Donations", "শিক্ষা ও দান")}</h1>
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
          {educationInstitutions.filter(i => i.name.toLowerCase().includes(search.toLowerCase())).map((inst) => (
            <Card key={inst.id} className="cursor-pointer hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-nitro-blue/10 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-nitro-blue" />
                  </div>
                  <span className="font-medium text-sm">{t(inst.name, inst.nameBn)}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast.success(t("Fee payment page would open", "ফি পেমেন্ট পেজ খুলবে"))}>
                  {t("Pay Fee", "ফি দিন")}
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
                  <div className="h-10 w-10 rounded-full bg-nitro-pink/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-nitro-pink" />
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
                  <Button className="gradient-primary text-primary-foreground" onClick={() => toast.success(t("Donated!", "দান করা হয়েছে!"))}>
                    {t("Donate", "দান করুন")}
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
