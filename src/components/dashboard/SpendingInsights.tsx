import { Card, CardContent } from "@/components/ui/card";
import { spendingCategories } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

export function SpendingInsights() {
  const { t } = useLanguage();
  const total = spendingCategories.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div>
      <h2 className="font-display font-semibold mb-3">{t("Spending Insights", "ব্যয় বিশ্লেষণ")}</h2>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">{t("This Month", "এই মাস")}</p>
            <p className="font-semibold text-sm">৳{total.toLocaleString()}</p>
          </div>

          {/* Ring chart visual */}
          <div className="flex items-center gap-6">
            <div className="relative h-24 w-24 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="transform -rotate-90">
                {(() => {
                  let offset = 0;
                  return spendingCategories.map((cat, i) => {
                    const circumference = 2 * Math.PI * 40;
                    const dash = (cat.percentage / 100) * circumference;
                    const gap = circumference - dash;
                    const strokeOffset = -offset * (circumference / 100);
                    offset += cat.percentage;
                    return (
                      <circle
                        key={i}
                        cx="50" cy="50" r="40"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="8"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={strokeOffset}
                        strokeLinecap="round"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">৳{(total / 1000).toFixed(1)}k</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {spendingCategories.slice(0, 4).map((cat) => (
                <div key={cat.category} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs flex-1">{t(cat.category, cat.categoryBn)}</span>
                  <span className="text-xs font-medium">৳{cat.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
