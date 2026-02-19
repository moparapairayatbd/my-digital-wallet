import { useState, useEffect, useCallback } from "react";
import { CreditCard, Plus, Eye, EyeOff, Snowflake, Unlock, Copy, Ban, Wifi, Shield, ChevronRight, ChevronLeft, User, FileText, Palette, CheckCircle2, Truck, Loader2, DollarSign, ArrowDownToLine, History, AlertTriangle, Activity, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/components/ui/sonner";
import TransactionSuccess from "@/components/TransactionSuccess";
import { useNavigate } from "react-router-dom";
import { useCards, useCreateCard, useProfile, useFreezeCard, useFundCard, useCardDetails, useWallet, useWithdrawFromCard, useBlockCard, useCardTransactions } from "@/hooks/useWallet";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const cardDesigns = [
  { id: "d1", name: "Aurora", gradient: "bg-gradient-to-br from-[hsl(280,65%,55%)] via-[hsl(330,85%,52%)] to-[hsl(25,95%,55%)]" },
  { id: "d2", name: "Midnight", gradient: "bg-gradient-to-br from-[hsl(210,85%,20%)] via-[hsl(220,80%,30%)] to-[hsl(240,60%,40%)]" },
  { id: "d3", name: "Emerald", gradient: "bg-gradient-to-br from-[hsl(152,68%,45%)] via-[hsl(175,70%,42%)] to-[hsl(210,85%,55%)]" },
  { id: "d4", name: "Gold", gradient: "bg-gradient-to-br from-[hsl(45,80%,40%)] via-[hsl(35,70%,30%)] to-[hsl(25,60%,20%)]" },
  { id: "d5", name: "Rose", gradient: "bg-gradient-to-br from-[hsl(330,85%,52%)] via-[hsl(340,70%,60%)] to-[hsl(350,60%,70%)]" },
  { id: "d6", name: "Ocean", gradient: "bg-gradient-to-br from-[hsl(195,85%,40%)] via-[hsl(210,80%,50%)] to-[hsl(230,70%,55%)]" },
];

const designGradientMap: Record<string, string> = {};
cardDesigns.forEach(d => { designGradientMap[d.id] = d.gradient; });

const creationSteps = [
  { title: "Card Type", titleBn: "কার্ডের ধরন", icon: CreditCard },
  { title: "Design", titleBn: "ডিজাইন", icon: Palette },
  { title: "Personal Info", titleBn: "ব্যক্তিগত তথ্য", icon: User },
  { title: "Delivery", titleBn: "ডেলিভারি", icon: Truck },
  { title: "Review", titleBn: "পর্যালোচনা", icon: FileText },
];

interface DisplayCard {
  id: string;
  type: "virtual" | "physical";
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  frozen: boolean;
  gradient: string;
  status: string;
  strowallet_card_id?: string;
  balance?: number | null;
}

const BankCard = ({ card, showDetails }: { card: DisplayCard; showDetails: boolean }) => (
  <div className={`relative w-full aspect-[1.6/1] max-w-[380px] rounded-2xl ${card.gradient} p-6 text-white shadow-2xl overflow-hidden select-none`}>
    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
    <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/4" />
    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[10px] uppercase tracking-widest opacity-70">{card.type === "virtual" ? "Virtual Card" : "Physical Card"}</p>
          <p className="text-xs opacity-60 mt-0.5">Nitrozix • BDT</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            {card.frozen && <Snowflake className="h-4 w-4 opacity-80" />}
            <Wifi className="h-5 w-5 opacity-80 rotate-90" />
          </div>
          {card.balance !== undefined && card.balance !== null && (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1 mt-1">
              <p className="text-[10px] uppercase tracking-wider opacity-70">Balance</p>
              <p className="text-sm font-bold font-mono">${Number(card.balance).toFixed(2)}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 my-2">
        <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[hsl(45,80%,60%)]/80 to-[hsl(45,80%,40%)]/60 border border-[hsl(45,80%,50%)]/30" />
      </div>
      <p className="text-lg tracking-[0.25em] font-mono">{showDetails ? card.number : card.number.replace(/\d{4}(?=\s)/g, "••••").replace(/(\d{4})$/, (m) => m)}</p>
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
  const { user } = useAuth();
  const { data: dbCards, isLoading: cardsLoading } = useCards();
  const { data: profile } = useProfile();
  const createCard = useCreateCard();
  const freezeCard = useFreezeCard();
  const fundCard = useFundCard();
  const cardDetails = useCardDetails();
  const withdrawFromCard = useWithdrawFromCard();
  const blockCard = useBlockCard();
  const cardTransactions = useCardTransactions();

  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  // Creation flow state
  const [showCreateFlow, setShowCreateFlow] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [newCardType, setNewCardType] = useState<"virtual" | "physical">("virtual");
  const [selectedDesign, setSelectedDesign] = useState(cardDesigns[0]);
  const [cardForm, setCardForm] = useState({ name: "", phone: "", address: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdCard, setCreatedCard] = useState<DisplayCard | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [cardTxns, setCardTxns] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("cards");
  const [newEventCount, setNewEventCount] = useState(0);
  const [latestEventIds, setLatestEventIds] = useState<Set<string>>(new Set());

  const { data: wallet } = useWallet();

  const [cardBalances, setCardBalances] = useState<Record<string, number | null>>({});

  // Webhook activity logs
  const [webhookLogs, setWebhookLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const fetchWebhookLogs = useCallback(async () => {
    if (!user) return;
    setLogsLoading(true);
    const { data } = await supabase
      .from("card_webhook_logs")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setWebhookLogs(data || []);
    setLogsLoading(false);
  }, [user]);

  useEffect(() => {
    if (activeTab === "activity") fetchWebhookLogs();
  }, [activeTab, fetchWebhookLogs]);

  // Realtime subscription for webhook logs
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("card-webhook-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "card_webhook_logs", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const newLog = payload.new as any;
          setWebhookLogs((prev) => [newLog, ...prev].slice(0, 50));
          setLatestEventIds((prev) => new Set([...prev, newLog.id]));
          // If user is not on the Activity tab, increment badge counter
          setActiveTab((current) => {
            if (current !== "activity") {
              setNewEventCount((n) => n + 1);
              const eventLabel = newLog.event_type?.includes("authorization") ? "Card authorization request"
                : newLog.event_type?.includes("refund") ? "Card refund received"
                : newLog.event_type?.includes("declined") ? "Card transaction declined"
                : "Card transaction";
              const amountStr = newLog.amount != null ? ` • $${Number(newLog.amount).toFixed(2)}` : "";
              toast.info(`${eventLabel}${amountStr}`, {
                action: { label: "View", onClick: () => setActiveTab("activity") },
              });
            }
            return current;
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Fetch real balances from Strowallet for all cards
  const fetchCardBalances = useCallback(async () => {
    if (!dbCards || dbCards.length === 0) return;
    for (const c of dbCards) {
      const sId = (c as any).strowallet_card_id;
      if (sId) {
        try {
          const details = await cardDetails.mutateAsync({ strowalletCardId: sId });
          const bal = details?.balance ?? details?.data?.balance ?? details?.card_balance ?? details?.data?.card_balance ?? null;
          if (bal !== null && bal !== undefined) {
            setCardBalances(prev => ({ ...prev, [c.id]: Number(bal) }));
          }
        } catch {
          // silently skip
        }
      }
    }
  }, [dbCards]);

  useEffect(() => {
    fetchCardBalances();
  }, [fetchCardBalances]);

  // Map DB cards to display cards
  const cards: DisplayCard[] = (dbCards || []).map(c => ({
    id: c.id,
    type: c.card_type,
    name: c.card_name,
    number: c.card_number,
    expiry: c.expiry_date,
    cvv: c.cvv,
    frozen: c.status === "frozen",
    gradient: designGradientMap[c.design || "d1"] || cardDesigns[0].gradient,
    status: c.status,
    strowallet_card_id: (c as any).strowallet_card_id || "",
    balance: cardBalances[c.id] ?? null,
  }));

  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0] || null;

  // Prefill form from profile
  const prefillName = cardForm.name || profile?.full_name || "";
  const prefillPhone = cardForm.phone || profile?.phone || "";

  const handleCreateCard = async () => {
    try {
      const result = await createCard.mutateAsync({
        card_type: newCardType,
        card_name: cardForm.name || prefillName,
        design: selectedDesign.id,
      });
      setCreatedCard({
        id: result.id,
        type: result.card_type,
        name: result.card_name,
        number: result.card_number,
        expiry: result.expiry_date,
        cvv: result.cvv,
        frozen: false,
        gradient: designGradientMap[result.design || "d1"] || cardDesigns[0].gradient,
        status: result.status,
      });
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to create card");
    }
  };

  const resetCreateFlow = () => {
    setShowCreateFlow(false);
    setCreateStep(0);
    setNewCardType("virtual");
    setSelectedDesign(cardDesigns[0]);
    setShowSuccess(false);
    setCreatedCard(null);
    setCardForm({ name: "", phone: "", address: "" });
  };

  // Success screen
  if (showSuccess && createdCard) {
    return (
      <div className="max-w-md mx-auto animate-fade-in">
        <div className="flex flex-col items-center py-6">
          <BankCard card={createdCard} showDetails={false} />
        </div>
        <TransactionSuccess
          title={t("Card Created!", "কার্ড তৈরি হয়েছে!")}
          subtitle={createdCard.type === "virtual"
            ? t("Your virtual card is ready to use", "আপনার ভার্চুয়াল কার্ড ব্যবহারের জন্য প্রস্তুত")
            : t("Physical card will be delivered in 5-7 days", "ফিজিক্যাল কার্ড ৫-৭ দিনে পৌঁছাবে")}
          details={[
            { label: t("Card Type", "কার্ডের ধরন"), value: createdCard.type === "virtual" ? t("Virtual Card", "ভার্চুয়াল কার্ড") : t("Physical Card", "ফিজিক্যাল কার্ড") },
            { label: t("Card Number", "কার্ড নম্বর"), value: createdCard.number, copyable: true },
            { label: t("Card Holder", "কার্ড হোল্ডার"), value: createdCard.name },
            { label: t("Expiry Date", "মেয়াদ"), value: createdCard.expiry },
            { label: t("Design", "ডিজাইন"), value: selectedDesign.name },
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

        {createStep === 1 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <BankCard card={{ id: "preview", type: newCardType, name: cardForm.name || prefillName, number: "4532 •••• •••• ••••", expiry: "02/30", cvv: "•••", frozen: false, gradient: selectedDesign.gradient, status: "active" }} showDetails={false} />
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

        {createStep === 2 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Full Name (on card)", "পূর্ণ নাম (কার্ডে)")}</label>
                <Input value={cardForm.name || prefillName} onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("Phone Number", "ফোন নম্বর")}</label>
                <Input value={cardForm.phone || prefillPhone} onChange={(e) => setCardForm({ ...cardForm, phone: e.target.value })} />
              </div>
              <Button className="w-full" onClick={() => setCreateStep(3)}>{t("Continue", "এগিয়ে যান")}</Button>
            </CardContent>
          </Card>
        )}

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

        {createStep === 4 && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <BankCard card={{ id: "review", type: newCardType, name: cardForm.name || prefillName, number: "4532 •••• •••• ••••", expiry: "02/30", cvv: "•••", frozen: false, gradient: selectedDesign.gradient, status: "active" }} showDetails={false} />
            </div>
            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {[
                  { l: t("Card Type", "কার্ডের ধরন"), v: newCardType === "virtual" ? t("Virtual", "ভার্চুয়াল") : t("Physical", "ফিজিক্যাল") },
                  { l: t("Design", "ডিজাইন"), v: selectedDesign.name },
                  { l: t("Card Holder", "কার্ড হোল্ডার"), v: cardForm.name || prefillName },
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
            <Button className="w-full gradient-primary text-primary-foreground h-12" disabled={createCard.isPending} onClick={handleCreateCard}>
              {createCard.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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
    <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); if (v === "activity") { setNewEventCount(0); setLatestEventIds(new Set()); } }} className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="cards" className="flex-1 gap-1.5">
          <CreditCard className="h-4 w-4" />
          {t("My Cards", "আমার কার্ড")}
        </TabsTrigger>
        <TabsTrigger value="activity" className="flex-1 gap-1.5 relative">
          <Activity className="h-4 w-4" />
          {t("Activity", "কার্যকলাপ")}
          {newEventCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
              {newEventCount > 9 ? "9+" : newEventCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="cards">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("My Cards", "আমার কার্ড")}</h1>
          <p className="text-muted-foreground text-sm">{t("Manage your virtual & physical cards", "আপনার ভার্চুয়াল ও ফিজিক্যাল কার্ড পরিচালনা করুন")}</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={() => setShowCreateFlow(true)}>
          <Plus className="h-4 w-4" />{t("New Card", "নতুন কার্ড")}
        </Button>
      </div>

      {cardsLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
          {[1, 2].map(i => <Skeleton key={i} className="w-[380px] aspect-[1.6/1] rounded-2xl flex-shrink-0" />)}
        </div>
      ) : cards.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">{t("No cards yet. Create your first card!", "এখনও কোনো কার্ড নেই। আপনার প্রথম কার্ড তৈরি করুন!")}</p>
            <Button className="mt-4" onClick={() => setShowCreateFlow(true)}>{t("Create Card", "কার্ড তৈরি করুন")}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {cards.map((card) => (
              <div key={card.id} className="snap-center flex-shrink-0 cursor-pointer" onClick={() => setSelectedCardId(card.id)}>
                <BankCard card={card} showDetails={!!showDetails[card.id]} />
              </div>
            ))}
          </div>

          {selectedCard && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold">{t("Card Controls", "কার্ড নিয়ন্ত্রণ")}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={async () => {
                  if (selectedCard.strowallet_card_id) {
                    try {
                      const details = await cardDetails.mutateAsync({ strowalletCardId: selectedCard.strowallet_card_id });
                      console.log("Card details:", details);
                    } catch {}
                  }
                  setShowDetails(prev => ({ ...prev, [selectedCard.id]: !prev[selectedCard.id] }));
                }}>
                  {showDetails[selectedCard.id] ? <EyeOff className="h-5 w-5 text-primary" /> : <Eye className="h-5 w-5 text-primary" />}
                  <span className="text-xs">{showDetails[selectedCard.id] ? t("Hide Details", "বিবরণ লুকান") : t("Show Details", "বিবরণ দেখুন")}</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" disabled={freezeCard.isPending || selectedCard.status === "blocked"} onClick={async () => {
                  if (selectedCard.strowallet_card_id) {
                    try {
                      await freezeCard.mutateAsync({ cardId: selectedCard.id, strowalletCardId: selectedCard.strowallet_card_id, freeze: !selectedCard.frozen });
                      toast(selectedCard.frozen ? t("Card unfrozen", "কার্ড আনফ্রিজ") : t("Card frozen", "কার্ড ফ্রিজ"));
                    } catch (e: any) {
                      const msg = e?.message || "Failed to update card";
                      if (msg.includes("untrusted source IP")) {
                        toast.error(t("Service temporarily unavailable", "সেবা সাময়িকভাবে অনুপলব্ধ"));
                      } else {
                        toast.error(msg);
                      }
                    }
                  } else {
                    toast(selectedCard.frozen ? t("Card unfrozen", "কার্ড আনফ্রিজ") : t("Card frozen", "কার্ড ফ্রিজ"));
                  }
                }}>
                  {selectedCard.frozen ? <Unlock className="h-5 w-5 text-nitro-blue" /> : <Snowflake className="h-5 w-5 text-nitro-blue" />}
                  <span className="text-xs">{selectedCard.frozen ? t("Unfreeze", "আনফ্রিজ") : t("Freeze", "ফ্রিজ")}</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => { setFundAmount(""); setShowFundDialog(true); }} disabled={selectedCard.status === "blocked"}>
                  <DollarSign className="h-5 w-5 text-nitro-green" />
                  <span className="text-xs">{t("Fund Card", "কার্ড ফান্ড")}</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => { setWithdrawAmount(""); setShowWithdrawDialog(true); }} disabled={selectedCard.status === "blocked"}>
                  <ArrowDownToLine className="h-5 w-5 text-nitro-orange" />
                  <span className="text-xs">{t("Withdraw", "উত্তোলন")}</span>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => { navigator.clipboard.writeText(selectedCard.number); toast(t("Card number copied", "কার্ড নম্বর কপি হয়েছে")); }}>
                  <Copy className="h-5 w-5 text-muted-foreground" />
                  <span className="text-xs">{t("Copy Number", "নম্বর কপি")}</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4" onClick={async () => {
                  if (selectedCard.strowallet_card_id) {
                    try {
                      const result = await cardTransactions.mutateAsync({ strowalletCardId: selectedCard.strowallet_card_id });
                      setCardTxns(result.data || result.transactions || result || []);
                      setShowTransactions(true);
                    } catch (e: any) {
                      toast.error(e?.message || t("Failed to fetch transactions", "লেনদেন আনতে ব্যর্থ"));
                    }
                  } else {
                    toast.info(t("No transaction history available", "কোনো লেনদেনের ইতিহাস নেই"));
                  }
                }}>
                  {cardTransactions.isPending ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <History className="h-5 w-5 text-primary" />}
                  <span className="text-xs">{t("Transactions", "লেনদেন")}</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 border-destructive/30 hover:bg-destructive/5" onClick={() => setShowBlockDialog(true)} disabled={selectedCard.status === "blocked"}>
                  <Ban className="h-5 w-5 text-destructive" />
                  <span className="text-xs text-destructive">{selectedCard.status === "blocked" ? t("Blocked", "ব্লক") : t("Block Card", "কার্ড ব্লক")}</span>
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
        </>
      )}
      </TabsContent>

      <TabsContent value="activity">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-display font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t("Card Activity", "কার্ড কার্যকলাপ")}
                {/* Live indicator */}
                <span className="flex items-center gap-1 text-xs font-normal text-nitro-green">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nitro-green opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-nitro-green" />
                  </span>
                  Live
                </span>
              </h2>
              <p className="text-muted-foreground text-sm">{t("Real-time webhook events for your cards", "আপনার কার্ডের রিয়েল-টাইম ইভেন্ট")}</p>
            </div>
            <Button variant="outline" size="sm" onClick={fetchWebhookLogs} disabled={logsLoading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${logsLoading ? "animate-spin" : ""}`} />
              {t("Refresh", "রিফ্রেশ")}
            </Button>
          </div>

          {logsLoading && webhookLogs.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
            </div>
          ) : webhookLogs.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">{t("No activity yet", "এখনো কোনো কার্যকলাপ নেই")}</p>
                <p className="text-sm text-muted-foreground mt-1">{t("Card events will appear here in real-time", "কার্ড ইভেন্ট এখানে রিয়েল-টাইমে দেখা যাবে")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {webhookLogs.map((log: any) => {
                const isNew = latestEventIds.has(log.id);
                const eventIcon = log.event_type?.includes("authorization") ? "💳"
                  : log.event_type?.includes("refund") ? "↩️"
                  : log.event_type?.includes("declined") ? "❌"
                  : log.event_type?.includes("crossborder") ? "🌍"
                  : "✅";
                const statusColor = log.status === "success" || log.status === "completed" ? "bg-nitro-green/10 text-nitro-green border-nitro-green/20"
                  : log.status === "failed" || log.status === "declined" ? "bg-destructive/10 text-destructive border-destructive/20"
                  : log.status === "pending" ? "bg-nitro-orange/10 text-nitro-orange border-nitro-orange/20"
                  : "bg-muted text-muted-foreground border-border";

                return (
                  <Card
                    key={log.id}
                    className={`overflow-hidden transition-all duration-300 ${isNew ? "border-primary/40 bg-primary/5 animate-fade-in" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <span className="text-xl mt-0.5">{eventIcon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold">{log.event_type?.replace(/\./g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Event"}</p>
                              {log.status && (
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColor}`}>
                                  {log.status}
                                </Badge>
                              )}
                              {isNew && (
                                <Badge className="text-[10px] px-1.5 py-0 bg-primary text-primary-foreground">
                                  New
                                </Badge>
                              )}
                            </div>
                            {log.narrative && <p className="text-sm text-muted-foreground truncate mt-0.5">{log.narrative}</p>}
                            <p className="text-xs text-muted-foreground mt-1">
                              {log.card_id && <span className="font-mono">Card: ...{log.card_id.slice(-6)} • </span>}
                              {new Date(log.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {log.amount != null && (
                          <p className="text-sm font-bold whitespace-nowrap">${Number(log.amount).toFixed(2)}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>

      {/* Fund Card Dialog */}
      <Dialog open={showFundDialog} onOpenChange={setShowFundDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {t("Fund Card", "কার্ড ফান্ড করুন")}
            </DialogTitle>
            <DialogDescription>
              {t("Add funds from your wallet to this card", "আপনার ওয়ালেট থেকে এই কার্ডে ফান্ড যোগ করুন")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedCard && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">{t("Card", "কার্ড")}</p>
                <p className="font-medium font-mono">{selectedCard.number}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Amount (USD)", "পরিমাণ (USD)")}</label>
              <Input
                type="number"
                min="3"
                placeholder="Enter amount"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
              />
            </div>
            {wallet && (
              <p className="text-xs text-muted-foreground">
                {t("Wallet Balance", "ওয়ালেট ব্যালেন্স")}: ৳{Number(wallet.balance).toLocaleString()}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFundDialog(false)}>
              {t("Cancel", "বাতিল")}
            </Button>
            <Button
              disabled={!fundAmount || Number(fundAmount) < 3 || fundCard.isPending}
              onClick={async () => {
                if (!selectedCard) return;
                try {
                  await fundCard.mutateAsync({
                    cardId: selectedCard.id,
                    strowalletCardId: selectedCard.strowallet_card_id || "",
                    amount: Number(fundAmount),
                  });
                  toast.success(t("Card funded successfully!", "কার্ড সফলভাবে ফান্ড করা হয়েছে!"));
                  setShowFundDialog(false);
                } catch (e: any) {
                  const msg = e?.message || "Failed to fund card";
                  if (msg.includes("Insufficient balance")) {
                    toast.error(t("Insufficient wallet balance", "অপর্যাপ্ত ওয়ালেট ব্যালেন্স"));
                  } else if (msg.includes("untrusted source IP")) {
                    toast.error(t("Service temporarily unavailable. Please try again later.", "সেবা সাময়িকভাবে অনুপলব্ধ। অনুগ্রহ করে পরে আবার চেষ্টা করুন।"));
                  } else if (msg.includes("at least")) {
                    toast.error(t("Minimum funding amount is $3 USD", "সর্বনিম্ন ফান্ডিং পরিমাণ $৩ USD"));
                  } else {
                    toast.error(msg);
                  }
                }
              }}
            >
              {fundCard.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("Fund Card", "কার্ড ফান্ড করুন")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ArrowDownToLine className="h-5 w-5 text-primary" />
              {t("Withdraw from Card", "কার্ড থেকে উত্তোলন")}
            </DialogTitle>
            <DialogDescription>
              {t("Withdraw funds from your card back to your wallet", "আপনার কার্ড থেকে ওয়ালেটে ফান্ড উত্তোলন করুন")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {selectedCard && (
              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="text-muted-foreground">{t("Card", "কার্ড")}</p>
                <p className="font-medium font-mono">{selectedCard.number}</p>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("Amount (USD)", "পরিমাণ (USD)")}</label>
              <Input
                type="number"
                min="3"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {t("Minimum withdrawal: $3 USD. Funds will be added to your wallet.", "সর্বনিম্ন উত্তোলন: $৩ USD। ফান্ড আপনার ওয়ালেটে যোগ হবে।")}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
              {t("Cancel", "বাতিল")}
            </Button>
            <Button
              disabled={!withdrawAmount || Number(withdrawAmount) < 3 || withdrawFromCard.isPending}
              onClick={async () => {
                if (!selectedCard) return;
                try {
                  await withdrawFromCard.mutateAsync({
                    cardId: selectedCard.id,
                    strowalletCardId: selectedCard.strowallet_card_id || "",
                    amount: Number(withdrawAmount),
                  });
                  toast.success(t("Withdrawal successful! Funds added to wallet.", "উত্তোলন সফল! ফান্ড ওয়ালেটে যোগ হয়েছে।"));
                  setShowWithdrawDialog(false);
                } catch (e: any) {
                  const msg = e?.message || "Failed to withdraw";
                  toast.error(msg);
                }
              }}
            >
              {withdrawFromCard.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("Withdraw", "উত্তোলন করুন")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block Card Confirmation Dialog */}
      <Dialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              {t("Block Card", "কার্ড ব্লক করুন")}
            </DialogTitle>
            <DialogDescription>
              {t("This action is permanent and cannot be undone. Your card will be permanently deactivated.", "এই কাজটি স্থায়ী এবং পূর্বাবস্থায় ফেরানো যাবে না। আপনার কার্ড স্থায়ীভাবে নিষ্ক্রিয় হবে।")}
            </DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="p-3 rounded-lg bg-destructive/10 text-sm border border-destructive/20">
              <p className="text-muted-foreground">{t("Card to block", "ব্লক করার কার্ড")}</p>
              <p className="font-medium font-mono">{selectedCard.number}</p>
              <p className="text-xs text-destructive mt-1">{t("⚠️ Please withdraw any remaining balance before blocking.", "⚠️ ব্লক করার আগে অনুগ্রহ করে অবশিষ্ট ব্যালেন্স উত্তোলন করুন।")}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlockDialog(false)}>
              {t("Cancel", "বাতিল")}
            </Button>
            <Button
              variant="destructive"
              disabled={blockCard.isPending}
              onClick={async () => {
                if (!selectedCard) return;
                try {
                  await blockCard.mutateAsync({
                    cardId: selectedCard.id,
                    strowalletCardId: selectedCard.strowallet_card_id || "",
                  });
                  toast.success(t("Card blocked permanently", "কার্ড স্থায়ীভাবে ব্লক করা হয়েছে"));
                  setShowBlockDialog(false);
                } catch (e: any) {
                  toast.error(e?.message || t("Failed to block card", "কার্ড ব্লক করতে ব্যর্থ"));
                }
              }}
            >
              {blockCard.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {t("Block Card Permanently", "স্থায়ীভাবে কার্ড ব্লক করুন")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Card Transactions Dialog */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {t("Card Transactions", "কার্ড লেনদেন")}
            </DialogTitle>
            <DialogDescription>
              {t("Recent transactions on this card", "এই কার্ডের সাম্প্রতিক লেনদেন")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            {Array.isArray(cardTxns) && cardTxns.length > 0 ? (
              cardTxns.map((txn: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{txn.narrative || txn.description || txn.merchant || t("Transaction", "লেনদেন")}</p>
                    <p className="text-xs text-muted-foreground">{txn.date || txn.created_at || txn.createdAt || ""}</p>
                    <p className="text-xs text-muted-foreground capitalize">{txn.type || txn.channel || ""}</p>
                  </div>
                  <div className="text-right ml-3">
                    <p className={`text-sm font-semibold ${txn.type === "credit" ? "text-nitro-green" : ""}`}>
                      {txn.type === "credit" ? "+" : "-"}${Number(txn.amount || 0).toFixed(2)}
                    </p>
                    <p className={`text-xs capitalize ${txn.status === "success" ? "text-nitro-green" : txn.status === "failed" ? "text-destructive" : "text-muted-foreground"}`}>
                      {txn.status || ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t("No transactions found", "কোনো লেনদেন পাওয়া যায়নি")}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cards;
