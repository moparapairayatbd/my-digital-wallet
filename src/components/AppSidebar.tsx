import { 
  Home, Send, Download, HandCoins, PlusCircle, Banknote, Phone, Receipt, 
  QrCode, ArrowDownToLine, History, PiggyBank, Building2, GraduationCap, 
  Gift, Settings, ChevronRight, Wallet
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const moneyServices = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Send Money", url: "/send", icon: Send },
  { title: "Receive Money", url: "/receive", icon: Download },
  { title: "Request Money", url: "/request", icon: HandCoins },
  { title: "Add Money", url: "/add-money", icon: PlusCircle },
  { title: "Cash Out", url: "/cash-out", icon: ArrowDownToLine },
];

const payments = [
  { title: "Mobile Recharge", url: "/recharge", icon: Phone },
  { title: "Pay Bills", url: "/pay-bills", icon: Receipt },
  { title: "Merchant Payment", url: "/merchant", icon: QrCode },
];

const financial = [
  { title: "Financial Products", url: "/financial", icon: PiggyBank },
  { title: "Bank Transfer", url: "/bank-transfer", icon: Building2 },
];

const more = [
  { title: "Transaction History", url: "/history", icon: History },
  { title: "Education & Donations", url: "/education", icon: GraduationCap },
  { title: "Offers & Lifestyle", url: "/offers", icon: Gift },
  { title: "Settings", url: "/settings", icon: Settings },
];

const groups = [
  { label: "Money Services", items: moneyServices },
  { label: "Payments", items: payments },
  { label: "Financial Products", items: financial },
  { label: "More", items: more },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold bg-clip-text text-transparent gradient-primary bg-gradient-to-r from-primary to-accent">
            Nitrozix
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-4">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                        activeClassName="bg-sidebar-accent text-primary font-semibold"
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
