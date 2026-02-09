import { useState } from "react";
import { CreditCard, Plus, Eye, EyeOff, Lock, Unlock, Snowflake, Copy, Settings, Wifi, Shield, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";

interface CardData {
  id: string;
  type: "virtual" | "physical";
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  balance: number;
  frozen: boolean;
  gradient: string;
  currency: string;
}

const mockCards: CardData[] = [
  {
    id: "c1", type: "virtual", name: "Rahim Uddin", number: "4532 •••• •••• 7891",
    expiry: "09/28", cvv: "432", balance: 12500, frozen: false,
    gradient: "bg-gradient-to-br from-[hsl(280,65%,55%)] via-[hsl(330,85%,52%)] to-[hsl(25,95%,55%)]",
    currency: "BDT",
  },
  {
    id: "c2", type: "physical", name: "Rahim Uddin", number: "5412 •••• •••• 3456",
    expiry: "03/29", cvv: "891", balance: 24580.50, frozen: false,
    gradient: "bg-gradient-to-br from-[hsl(210,85%,20%)] via-[hsl(220,80%,30%)] to-[hsl(240,60%,40%)]",
    currency: "BDT",
  },
];

const BankCard = ({ card, showDetails, onToggleDetails }: { card: CardData; showDetails: boolean; onToggleDetails: () => void }) => (
  <div className={`relative w-full aspect-[1.6/1] max-w-[380px] rounded-2xl ${card.gradient} p-6 text-white shadow-2xl overflow-hidden select-none`}>
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
    <div className="absolute top-1/2 right-1/4 w-20 h-20 rounded-full bg-white/5" />

    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-70">{card.type === "virtual" ? "Virtual Card" : "Physical Card"}</p>
          <p className="text-xs opacity-60 mt-0.5">Nitrozix • {card.currency}</p>
        </div>
        <div className="flex items-center gap-2">
          {card.frozen && <Snowflake className="h-4 w-4 text-blue-200" />}
          <Wifi className="h-5 w-5 opacity-80 rotate-90" />
        </div>
      </div>

      {/* Chip */}
      <div className="flex items-center gap-3 my-2">
        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-yellow-300/80 to-yellow-500/60 border border-yellow-400/30" />
      </div>

      <div>
        <p className="text-lg tracking-[0.25em] font-mono">
          {showDetails ? card.number.replace(/••••/g, "1234") : card.number}
        </p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-[10px] uppercase opacity-60 tracking-wider">Card Holder</p>
          <p className="text-sm font-semibold tracking-wide">{card.name.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase opacity-60 tracking-wider">Expires</p>
          <p className="text-sm font-semibold">{card.expiry}</p>
        </div>
        <div className="flex gap-1">
          <div className="w-6 h-6 rounded-full bg-red-500/80" />
          <div className="w-6 h-6 rounded-full bg-yellow-400/80 -ml-3" />
        </div>
      </div>
    </div>
  </div>
);

const Cards = () => {
  const { t } = useLanguage();
  const [cards, setCards] = useState(mockCards);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [showNewCardDialog, setShowNewCardDialog] = useState(false);
  const [newCardType, setNewCardType] = useState<"virtual" | "physical">("virtual");
  const [selectedCard, setSelectedCard] = useState(cards[0]);

  const toggleFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c));
    const card = cards.find(c => c.id === cardId);
    toast(card?.frozen ? "Card unfrozen" : "Card frozen");
  };

  const handleCreateCard = () => {
    const newCard: CardData = {
      id: `c${Date.now()}`,
      type: newCardType,
      name: "Rahim Uddin",
      number: `${newCardType === "virtual" ? "4532" : "5412"} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: "02/30",
      cvv: String(Math.floor(100 + Math.random() * 900)),
      balance: 0,
      frozen: false,
      gradient: newCardType === "virtual"
        ? "bg-gradient-to-br from-[hsl(152,68%,45%)] via-[hsl(175,70%,42%)] to-[hsl(210,85%,55%)]"
        : "bg-gradient-to-br from-[hsl(45,10%,20%)] via-[hsl(40,15%,30%)] to-[hsl(35,20%,25%)]",
      currency: "BDT",
    };
    setCards(prev => [...prev, newCard]);
    setShowNewCardDialog(false);
    toast(t("Card created successfully!", "কার্ড সফলভাবে তৈরি হয়েছে!"));
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("My Cards", "আমার কার্ড")}</h1>
          <p className="text-muted-foreground text-sm">{t("Manage your virtual & physical cards", "আপনার ভার্চুয়াল ও ফিজিক্যাল কার্ড পরিচালনা করুন")}</p>
        </div>
        <Dialog open={showNewCardDialog} onOpenChange={setShowNewCardDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />{t("New Card", "নতুন কার্ড")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">{t("Create New Card", "নতুন কার্ড তৈরি")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Tabs value={newCardType} onValueChange={(v) => setNewCardType(v as "virtual" | "physical")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="virtual">{t("Virtual Card", "ভার্চুয়াল কার্ড")}</TabsTrigger>
                  <TabsTrigger value="physical">{t("Physical Card", "ফিজিক্যাল কার্ড")}</TabsTrigger>
                </TabsList>
              </Tabs>
              <Card className="border-dashed">
                <CardContent className="p-4 text-center text-sm text-muted-foreground">
                  {newCardType === "virtual"
                    ? t("Instant virtual card for online transactions. No delivery needed.", "অনলাইন লেনদেনের জন্য তাত্ক্ষণিক ভার্চুয়াল কার্ড।")
                    : t("Physical card delivered to your address in 5-7 business days.", "৫-৭ কার্যদিবসে আপনার ঠিকানায় ফিজিক্যাল কার্ড পৌঁছাবে।")}
                </CardContent>
              </Card>
              <Button className="w-full" onClick={handleCreateCard}>{t("Create Card", "কার্ড তৈরি করুন")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {cards.map((card) => (
          <div key={card.id} className="snap-center flex-shrink-0 cursor-pointer" onClick={() => setSelectedCard(card)}>
            <BankCard
              card={card}
              showDetails={!!showDetails[card.id]}
              onToggleDetails={() => setShowDetails(prev => ({ ...prev, [card.id]: !prev[card.id] }))}
            />
          </div>
        ))}
      </div>

      {/* Card Controls */}
      {selectedCard && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold">{t("Card Controls", "কার্ড নিয়ন্ত্রণ")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => setShowDetails(prev => ({ ...prev, [selectedCard.id]: !prev[selectedCard.id] }))}
            >
              {showDetails[selectedCard.id] ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
              <span className="text-xs">{showDetails[selectedCard.id] ? t("Hide Details", "বিবরণ লুকান") : t("Show Details", "বিবরণ দেখুন")}</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => toggleFreeze(selectedCard.id)}
            >
              {selectedCard.frozen ? <Unlock className="h-5 w-5 text-nitro-blue" /> : <Snowflake className="h-5 w-5 text-nitro-blue" />}
              <span className="text-xs">{selectedCard.frozen ? t("Unfreeze", "আনফ্রিজ") : t("Freeze", "ফ্রিজ")}</span>
            </Button>
            <Button
              variant="outline"
              className="flex flex-col items-center gap-2 h-auto py-4"
              onClick={() => { navigator.clipboard.writeText("4532123412347891"); toast("Card number copied"); }}
            >
              <Copy className="h-5 w-5 text-nitro-green" />
              <span className="text-xs">{t("Copy Number", "নম্বর কপি")}</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Settings className="h-5 w-5 text-nitro-orange" />
              <span className="text-xs">{t("Settings", "সেটিংস")}</span>
            </Button>
          </div>

          {/* Card limits and settings */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">{t("Card Settings", "কার্ড সেটিংস")}</h3>
              {[
                { label: t("Online Payments", "অনলাইন পেমেন্ট"), icon: Shield, defaultOn: true },
                { label: t("International Transactions", "আন্তর্জাতিক লেনদেন"), icon: CreditCard, defaultOn: false },
                { label: t("Contactless Payment", "কন্টাক্টলেস পেমেন্ট"), icon: Wifi, defaultOn: true },
              ].map((setting, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <setting.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{setting.label}</span>
                  </div>
                  <Switch defaultChecked={setting.defaultOn} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Spending limit */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm">{t("Spending Limits", "খরচের সীমা")}</h3>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("Daily Limit", "দৈনিক সীমা")}</span>
                  <span className="font-semibold">৳50,000</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[35%] gradient-primary rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground">{t("৳17,500 of ৳50,000 used today", "আজ ৳১৭,৫০০ / ৳৫০,০০০ ব্যবহৃত")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Cards;
