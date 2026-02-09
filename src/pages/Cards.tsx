import { useState } from "react";
import { CreditCard, Plus, Eye, EyeOff, Snowflake, Unlock, Copy, Settings, Wifi, Shield, ChevronRight, ChevronLeft, User, MapPin, FileText, Palette, CheckCircle2, Truck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";

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

const cardDesigns = [
  { id: "d1", name: "Aurora", gradient: "bg-gradient-to-br from-[hsl(280,65%,55%)] via-[hsl(330,85%,52%)] to-[hsl(25,95%,55%)]" },
  { id: "d2", name: "Midnight", gradient: "bg-gradient-to-br from-[hsl(210,85%,20%)] via-[hsl(220,80%,30%)] to-[hsl(240,60%,40%)]" },
  { id: "d3", name: "Emerald", gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] via-[hsl(175,70%,42%)] to-[hsl(210,85%,55%)]" },
  { id: "d4", name: "Gold", gradient: "bg-gradient-to-br from-[hsl(45,80%,40%)] via-[hsl(35,70%,30%)] to-[hsl(25,60%,20%)]" },
  { id: "d5", name: "Rose", gradient: "bg-gradient-to-br from-[hsl(330,85%,52%)] via-[hsl(340,70%,60%)] to-[hsl(350,60%,70%)]" },
  { id: "d6", name: "Ocean", gradient: "bg-gradient-to-br from-[hsl(195,85%,40%)] via-[hsl(210,80%,50%)] to-[hsl(230,70%,55%)]" },
];

const creationSteps = [
  { title: "Card Type", titleBn: "কার্ডের ধরন", icon: CreditCard },
  { title: "Design", titleBn: "ডিজাইন", icon: Palette },
  { title: "Personal Info", titleBn: "ব্যক্তিগত তথ্য", icon: User },
  { title: "Delivery", titleBn: "ডেলিভারি", icon: Truck },
  { title: "Review", titleBn: "পর্যালোচনা", icon: FileText },
];

const BankCard = ({ card, showDetails }: { card: CardData; showDetails: boolean }) => (
  <div className={`relative w-full aspect-[1.6/1] max-w-[380px] rounded-2xl ${card.gradient} p-6 text-white shadow-2xl overflow-hidden select-none`}>
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
          {card.frozen && <Snowflake className="h-4 w-4 opacity-80" />}
          <Wifi className="h-5 w-5 opacity-80 rotate-90" />
        </div>
      </div>
      <div className="flex items-center gap-3 my-2">
        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[hsl(45,80%,60%)]/80 to-[hsl(45,80%,40%)]/60 border border-[hsl(45,80%,50%)]/30" />
      </div>
      <p className="text-lg tracking-[0.25em] font-mono">{showDetails ? card.number.replace(/••••/g, "1234") : card.number}</p>
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
          <div className="w-6 h-6 rounded-full bg-[hsl(0,80%,55%)]/80" />
          <div className="w-6 h-6 rounded-full bg-[hsl(45,95%,55%)]/80 -ml-3" />
        </div>
      </div>
    </div>
  </div>
);

const Cards = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cards, setCards] = useState(mockCards);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});
  const [selectedCard, setSelectedCard] = useState(cards[0]);

  // Creation flow state
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [newCardType, setNewCardType] = useState<"virtual" | "physical">("virtual");
  const [selectedDesign, setSelectedDesign] = useState(cardDesigns[0]);
  const [cardForm, setCardForm] = useState({ name: "Rahim Uddin", phone: "01712-345678", address: "House 12, Road 5, Dhanmondi, Dhaka" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [newCard, setNewCard] = useState<CardData | null>(null);

  const toggleFreeze = (cardId: string) => {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c));
    const card = cards.find(c => c.id === cardId);
    toast(card?.frozen ? "Card unfrozen" : "Card frozen");
  };

  const handleCreateCard = () => {
    const card: CardData = {
      id: `c${Date.now()}`,
      type: newCardType,
      name: cardForm.name,
      number: `${newCardType === "virtual" ? "4532" : "5412"} •••• •••• ${Math.floor(1000 + Math.random() * 9000)}`,
      expiry: "02/30",
      cvv: String(Math.floor(100 + Math.random() * 900)),
      balance: 0,
      frozen: false,
      gradient: selectedDesign.gradient,
      currency: "BDT",
    };
    setCards(prev => [...prev, card]);
    setNewCard(card);
    setShowSuccess(true);
  };

  const resetCreateFlow = () => {
    setShowCreateFlow(false);
    setCreateStep(0);
    setNewCardType("virtual");
    setSelectedDesign(cardDesigns[0]);
    setShowSuccess(false);
    setNewCard(null);
  };

  // Success screen
  if (showSuccess && newCard) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="flex flex-col items-center py-6">
          {/* Show the created card */}
          <BankCard card={newCard} showDetails={false} />
        </div>
        <TransactionSuccess
          title={t("Card Created!", "কার্ড তৈরি হয়েছে!")}
          subtitle={newCard.type === "virtual"
            ? t("Your virtual card is ready to use", "আপনার ভার্চুয়াল কার্ড ব্যবহারের জন্য প্রস্তুত")
            : t("Physical card will be delivered in 5-7 days", "ফিজিক্যাল কার্ড ৫-৭ দিনে পৌঁছাবে")}
          details={[
            { label: t("Card Type", "কার্ডের ধরন"), value: newCard.type === "virtual" ? t("Virtual Card", "ভার্চুয়াল কার্ড") : t("Physical Card", "ফিজিক্যাল কার্ড") },
            { label: t("Card Number", "কার্ড নম্বর"), value: newCard.number, copyable: true },
            { label: t("Card Holder", "কার্ড হোল্ডার"), value: newCard.name },
            { label: t("Expiry Date", "মেয়াদ"), value: newCard.expiry },
            { label: t("Design", "ডিজাইন"), value: selectedDesign.name },
            { label: t("Currency", "কারেন্সি"), value: "BDT (৳)" },
            { label: t("Status", "স্ট্যাটাস"), value: newCard.type === "virtual" ? t("Active", "সক্রিয়") : t("Processing", "প্রসেসিং") },
          ]}
          primaryAction={{ label: t("Go to My Cards", "আমার কার্ডে যান"), onClick: resetCreateFlow }}
          secondaryAction={{ label: t("Back to Home", "হোমে ফিরুন"), onClick: () => navigate("/") }}
        />
      </div>
    );
  }

  // Step-by-step creation flow
  if (showCreateFlow) {
    return (
      <div className="max-w-lg mx-auto animate-fade-in space-y-6">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Button variant="ghost" size="sm" onClick={() => createStep === 0 ? resetCreateFlow() : setCreateStep(createStep - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> {t("Back", "পেছনে")}
            </Button>
            <span className="text-xs text-muted-foreground">{t("Step", "ধাপ")} {createStep + 1}/{creationSteps.length}</span>
          </div>
          <div className="flex gap-1.5">
            {creationSteps.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= createStep ? "gradient-primary" : "bg-muted"}`} />
            ))}
          </div>
          <h2 className="font-display font-bold text-lg mt-4 flex items-center gap-2">
            {(() => { const Icon = creationSteps[createStep].icon; return <Icon className="h-5 w-5 text-primary" />; })()}
            {t(creationSteps[createStep].title, creationSteps[createStep].titleBn)}
          </h2>
        </div>

        {/* Step 0: Card Type */}
        {createStep === 0 && (
          <div className="space-y-3">
            {(["virtual", "physical"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setNewCardType(type); setCreateStep(1); }}
                className={`w-full p-5 rounded-xl border-2 text-left transition-all ${newCardType === type ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${type === "virtual" ? "gradient-primary" : "gradient-info"} text-white shadow-md`}>
                    {type === "virtual" ? <CreditCard className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{type === "virtual" ? t("Virtual Card", "ভার্চুয়াল কার্ড") : t("Physical Card", "ফিজিক্যাল কার্ড")}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {type === "virtual"
                        ? t("Instant digital card for online use", "অনলাইন ব্যবহারের জন্য তাত্ক্ষণিক ডিজিটাল কার্ড")
                        : t("Physical card delivered to your door", "আপনার দরজায় ফিজিক্যাল কার্ড ডেলিভারি")}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Design */}
        {createStep === 1 && (
          <div className="space-y-4">
            {/* Preview */}
            <div className="flex justify-center">
              <BankCard card={{ id: "preview", type: newCardType, name: cardForm.name, number: "4532 •••• •••• ••••", expiry: "02/30", cvv: "•••", balance: 0, frozen: false, gradient: selectedDesign.gradient, currency: "BDT" }} showDetails={false} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {cardDesigns.map((design) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className={`h-16 rounded-xl ${design.gradient} border-2 transition-all ${selectedDesign.id === design.id ? "border-primary ring-2 ring-primary/30 scale-105" : "border-transparent"}`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">{selectedDesign.name}</p>
            <Button className="w-full" onClick={() => setCreateStep(2)}>{t("Continue", "এগিয়ে যান")}</Button>
          </div>
        )}

        {/* Step 2: Personal Info */}
        {createStep === 2 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Full Name (on card)", "পূর্ণ নাম (কার্ডে)")}</label>
                <Input value={cardForm.name} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Phone Number", "ফোন নম্বর")}</label>
                <Input value={cardForm.phone} onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })} />
              </div>
              <Button className="w-full" onClick={() => setCreateStep(3)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Delivery (for physical) or PIN (for virtual) */}
        {createStep === 3 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              {newCardType === "physical" ? (
                <>
                  <div className="text-center py-2">
                    <Truck className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("Enter your delivery address", "আপনার ডেলিভারি ঠিকানা দিন")}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t("Delivery Address", "ডেলিভারি ঠিকানা")}</label>
                    <Input value={cardForm.address} onChange={(e) => setCardForm({ ...cardForm, address: e.target.value })} />
                  </div>
                  <div className="p-3 rounded-lg bg-muted text-sm">
                    <p className="font-medium">{t("Estimated Delivery", "আনুমানিক ডেলিভারি")}</p>
                    <p className="text-muted-foreground">{t("5-7 business days", "৫-৭ কার্যদিবস")}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="h-16 w-16 rounded-full bg-nitro-green/10 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="h-8 w-8 text-nitro-green" />
                  </div>
                  <h3 className="font-semibold">{t("Ready to Activate", "সক্রিয় করার জন্য প্রস্তুত")}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{t("Your virtual card will be instantly activated", "আপনার ভার্চুয়াল কার্ড তাত্ক্ষণিকভাবে সক্রিয় হবে")}</p>
                </div>
              )}
              <Button className="w-full" onClick={() => setCreateStep(4)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Review */}
        {createStep === 4 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <BankCard card={{ id: "review", type: newCardType, name: cardForm.name, number: "4532 •••• •••• ••••", expiry: "02/30", cvv: "•••", balance: 0, frozen: false, gradient: selectedDesign.gradient, currency: "BDT" }} showDetails={false} />
            </div>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {[
                  { l: t("Card Type", "কার্ডের ধরন"), v: newCardType === "virtual" ? t("Virtual", "ভার্চুয়াল") : t("Physical", "ফিজিক্যাল") },
                  { l: t("Design", "ডিজাইন"), v: selectedDesign.name },
                  { l: t("Card Holder", "কার্ড হোল্ডার"), v: cardForm.name },
                  { l: t("Phone", "ফোন"), v: cardForm.phone },
                  { l: t("Issuance Fee", "ইস্যু ফি"), v: newCardType === "virtual" ? t("Free", "ফ্রি") : "৳200" },
                  ...(newCardType === "physical" ? [{ l: t("Delivery", "ডেলিভারি"), v: t("5-7 business days", "৫-৭ কার্যদিবস") }] : []),
                ].map((item, i) => (
                  <div key={i} className="flex justify-between p-3">
                    <span className="text-sm text-muted-foreground">{item.l}</span>
                    <span className="text-sm font-medium">{item.v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button className="w-full gradient-primary text-primary-foreground h-12" onClick={handleCreateCard}>
              {t("Create Card", "কার্ড তৈরি করুন")}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Main cards view
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("My Cards", "আমার কার্ড")}</h1>
          <p className="text-muted-foreground text-sm">{t("Manage your virtual & physical cards", "আপনার ভার্চুয়াল ও ফিজিক্যাল কার্ড পরিচালনা করুন")}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowCreateFlow(true)}>
          <Plus className="h-4 w-4" />{t("New Card", "নতুন কার্ড")}
        </Button>
      </div>

      {/* Cards carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
        {cards.map((card) => (
          <div key={card.id} className="snap-center flex-shrink-0 cursor-pointer" onClick={() => setSelectedCard(card)}>
            <BankCard card={card} showDetails={!!showDetails[card.id]} />
          </div>
        ))}
      </div>

      {/* Card Controls */}
      {selectedCard && (
        <div className="space-y-4">
          <h2 className="font-display font-semibold">{t("Card Controls", "কার্ড নিয়ন্ত্রণ")}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setShowDetails(prev => ({ ...prev, [selectedCard.id]: !prev[selectedCard.id] }))}>
              {showDetails[selectedCard.id] ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
              <span className="text-xs">{showDetails[selectedCard.id] ? t("Hide Details", "বিবরণ লুকান") : t("Show Details", "বিবরণ দেখুন")}</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => toggleFreeze(selectedCard.id)}>
              {selectedCard.frozen ? <Unlock className="h-5 w-5 text-nitro-blue" /> : <Snowflake className="h-5 w-5 text-nitro-blue" />}
              <span className="text-xs">{selectedCard.frozen ? t("Unfreeze", "আনফ্রিজ") : t("Freeze", "ফ্রিজ")}</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => { navigator.clipboard.writeText("4532123412347891"); toast("Card number copied"); }}>
              <Copy className="h-5 w-5 text-nitro-green" />
              <span className="text-xs">{t("Copy Number", "নম্বর কপি")}</span>
            </Button>
            <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
              <Settings className="h-5 w-5 text-nitro-orange" />
              <span className="text-xs">{t("Settings", "সেটিংস")}</span>
            </Button>
          </div>

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
