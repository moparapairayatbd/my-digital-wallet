import { Send, Download, HandCoins, PlusCircle, ArrowDownToLine, Receipt, Phone, QrCode } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const quickActions = [
  { title: "Send", titleBn: "পাঠান", icon: Send, url: "/send", color: "bg-nitro-pink" },
  { title: "Receive", titleBn: "গ্রহণ", icon: Download, url: "/receive", color: "bg-nitro-green" },
  { title: "Request", titleBn: "অনুরোধ", icon: HandCoins, url: "/request", color: "bg-nitro-orange" },
  { title: "Add Money", titleBn: "যোগ করুন", icon: PlusCircle, url: "/add-money", color: "bg-nitro-blue" },
  { title: "Cash Out", titleBn: "ক্যাশ আউট", icon: ArrowDownToLine, url: "/cash-out", color: "bg-nitro-purple" },
  { title: "Pay Bill", titleBn: "বিল পে", icon: Receipt, url: "/pay-bills", color: "bg-nitro-teal" },
  { title: "Recharge", titleBn: "রিচার্জ", icon: Phone, url: "/recharge", color: "bg-nitro-yellow" },
  { title: "QR Pay", titleBn: "QR পে", icon: QrCode, url: "/merchant", color: "bg-nitro-pink" },
];

export function QuickActions() {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="font-display font-semibold mb-3">{t("Quick Actions", "দ্রুত অ্যাকশন")}</h2>
      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x scrollbar-hide sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:overflow-visible">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.url}
            className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-card hover:shadow-md transition-all hover:-translate-y-0.5 min-w-[76px] snap-start active:scale-95"
          >
            <div className={`h-12 w-12 rounded-full ${action.color} flex items-center justify-center shadow-md`}>
              <action.icon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium text-center whitespace-nowrap">{t(action.title, action.titleBn)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
