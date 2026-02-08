import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { offers, lifestyleCategories } from "@/data/mockData";
import { Ticket, UtensilsCrossed, ShoppingBag, Plane } from "lucide-react";

const iconMap: Record<string, any> = { Ticket, UtensilsCrossed, ShoppingBag, Plane };

const OffersLifestyle = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <h1 className="text-xl font-display font-bold">{t("Offers & Lifestyle", "অফার ও লাইফস্টাইল")}</h1>

      {/* Offers Grid */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Cashback & Offers", "ক্যাশব্যাক ও অফার")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offers.map((offer) => (
            <Card key={offer.id} className={`${offer.color} text-primary-foreground border-0 cursor-pointer hover:shadow-lg transition-all`}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{t(offer.title, offer.titleBn)}</h3>
                <p className="text-sm opacity-80 mt-1">{offer.description}</p>
                <Badge className="mt-2 bg-white/20 text-primary-foreground border-0 text-[10px]">
                  {t("Valid till", "কার্যকর")}: {offer.validTill}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Lifestyle */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Lifestyle Services", "লাইফস্টাইল সেবা")}</h2>
        <div className="grid grid-cols-2 gap-3">
          {lifestyleCategories.map((cat) => {
            const Icon = iconMap[cat.icon];
            return (
              <Card key={cat.id} className="cursor-pointer hover:shadow-md transition-all">
                <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
                    {Icon && <Icon className="h-7 w-7 text-primary" />}
                  </div>
                  <span className="font-medium text-sm">{t(cat.name, cat.nameBn)}</span>
                  <Badge variant="secondary" className="text-[10px]">{t("Coming Soon", "শীঘ্রই আসছে")}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OffersLifestyle;
