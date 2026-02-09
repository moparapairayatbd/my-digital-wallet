import { Home, History, QrCode, Wallet, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Send, Download, HandCoins, PlusCircle, ArrowDownToLine, Phone, Receipt,
  PiggyBank, Building2, GraduationCap, Gift, Settings, CreditCard, Globe, Bell, Clock, Scan,
  User, Award, Users, FileText, Shield, HelpCircle
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const mainTabs = [
  { title: "Home", url: "/", icon: Home },
  { title: "History", url: "/history", icon: History },
  { title: "QR", url: "/qr-scan", icon: QrCode, isFab: true },
  { title: "Wallet", url: "/add-money", icon: Wallet },
];

const moreCategories = [
  {
    label: "Money",
    items: [
      { title: "Send Money", url: "/send", icon: Send },
      { title: "Receive", url: "/receive", icon: Download },
      { title: "Request", url: "/request", icon: HandCoins },
      { title: "Cash Out", url: "/cash-out", icon: ArrowDownToLine },
    ],
  },
  {
    label: "Payments",
    items: [
      { title: "Recharge", url: "/recharge", icon: Phone },
      { title: "Pay Bills", url: "/pay-bills", icon: Receipt },
      { title: "Merchant", url: "/merchant", icon: QrCode },
      { title: "Pay Later", url: "/pay-later", icon: Clock },
    ],
  },
  {
    label: "Banking",
    items: [
      { title: "My Cards", url: "/cards", icon: CreditCard },
      { title: "Currency", url: "/currency", icon: Globe },
      { title: "Remittance", url: "/remittance", icon: Globe },
      { title: "Bank Transfer", url: "/bank-transfer", icon: Building2 },
    ],
  },
  {
    label: "More",
    items: [
      { title: "Profile", url: "/profile", icon: User },
      { title: "Rewards", url: "/rewards", icon: Award },
      { title: "Refer & Earn", url: "/refer", icon: Users },
      { title: "Statements", url: "/statements", icon: FileText },
      { title: "Security", url: "/security", icon: Shield },
      { title: "Help", url: "/support", icon: HelpCircle },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

export function BottomNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden safe-bottom">
      <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-around py-1.5 px-2">
        {mainTabs.map((tab) => {
          if (tab.isFab) {
            return (
              <Link
                key={tab.title}
                to={tab.url}
                className="flex flex-col items-center -mt-7"
              >
                <div className="h-14 w-14 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-primary/30 border-4 border-background">
                  <tab.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] font-medium mt-0.5 text-muted-foreground">{tab.title}</span>
              </Link>
            );
          }

          const isActive = tab.url === "/" 
            ? location.pathname === "/" 
            : location.pathname.startsWith(tab.url);

          return (
            <NavLink
              key={tab.title}
              to={tab.url}
              end={tab.url === "/"}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground relative touch-target"
              activeClassName="text-primary"
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.title}</span>
              {isActive && (
                <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground touch-target">
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl pb-8 max-h-[80vh] overflow-y-auto">
            <SheetTitle className="text-center font-display text-lg mb-4">All Services</SheetTitle>
            <div className="space-y-6">
              {moreCategories.map((cat) => (
                <div key={cat.label}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
                    {cat.label}
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {cat.items.map((item) => (
                      <Link
                        key={item.title}
                        to={item.url}
                        onClick={() => setOpen(false)}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-muted transition-colors"
                      >
                        <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-[11px] font-medium text-center leading-tight">{item.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
