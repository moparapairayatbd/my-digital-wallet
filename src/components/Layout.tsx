import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BottomNav } from "@/components/BottomNav";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { user } from "@/data/mockData";
import { Link } from "react-router-dom";

export function Layout({ children }: { children: ReactNode }) {
  const { lang, toggleLang } = useLanguage();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border">
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
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLang}
                  className="text-xs font-semibold gap-1"
                >
                  <Globe className="h-4 w-4" />
                  {lang === "en" ? "বাং" : "EN"}
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <Link to="/settings">
                  <Avatar className="h-8 w-8 cursor-pointer">
                    <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-bold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 pb-20 md:pb-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </SidebarProvider>
  );
}
