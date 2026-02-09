import { Home, History, QrCode, Wallet, Menu } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send, Download, HandCoins, PlusCircle, ArrowDownToLine, Phone, Receipt,
  PiggyBank, Building2, GraduationCap, Gift, Settings, CreditCard, Globe
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const mainTabs = [
  { title: "Home", url: "/", icon: Home },
  { title: "History", url: "/history", icon: History },
  { title: "QR Pay", url: "/merchant", icon: QrCode },
  { title: "Wallet", url: "/add-money", icon: Wallet },
];

const moreItems = [
  { title: "Send Money", url: "/send", icon: Send },
  { title: "Receive Money", url: "/receive", icon: Download },
  { title: "Request Money", url: "/request", icon: HandCoins },
  { title: "Cash Out", url: "/cash-out", icon: ArrowDownToLine },
  { title: "My Cards", url: "/cards", icon: CreditCard },
  { title: "Currency", url: "/currency", icon: Globe },
  { title: "Recharge", url: "/recharge", icon: Phone },
  { title: "Pay Bills", url: "/pay-bills", icon: Receipt },
  { title: "Financial", url: "/financial", icon: PiggyBank },
  { title: "Bank Transfer", url: "/bank-transfer", icon: Building2 },
  { title: "Education", url: "/education", icon: GraduationCap },
  { title: "Offers", url: "/offers", icon: Gift },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function BottomNav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border md:hidden">
      <div className="flex items-center justify-around py-2">
        {mainTabs.map((tab) => (
          <NavLink
            key={tab.title}
            to={tab.url}
            end={tab.url === "/"}
            className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground"
            activeClassName="text-primary"
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.title}</span>
          </NavLink>
        ))}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-8">
            <SheetTitle className="text-center font-display mb-4">More Services</SheetTitle>
            <div className="grid grid-cols-3 gap-4">
              {moreItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-center">{item.title}</span>
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
