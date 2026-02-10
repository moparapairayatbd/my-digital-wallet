import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile } from "@/hooks/useWallet";
import { Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  const { lang, toggleLang } = useLanguage();
  const { data: profile } = useProfile();

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border safe-top">
            <div className="flex items-center justify-between px-4 h-14">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="hidden md:flex" />
                <div className="md:hidden flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">N</span>
                  </div>
                  <span className="font-display font-bold text-lg">Nitrozix</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLang}
                  className="text-xs font-semibold gap-1 h-9 w-9 p-0 md:w-auto md:px-3"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden md:inline">{lang === "en" ? "বাং" : "EN"}</span>
                </Button>
                <Link to="/notifications">
                  <Button variant="ghost" size="icon" className="relative h-9 w-9">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary pulse-dot" />
                  </Button>
                </Link>
                <Link to="/profile">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 pb-24 md:pb-4 md:p-6 overflow-auto scroll-smooth">
            <div className="page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
