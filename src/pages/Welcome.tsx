import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, ChevronRight } from "lucide-react";
import onboardingWallet from "@/assets/onboarding-wallet.png";
import onboardingTransfer from "@/assets/onboarding-transfer.png";
import onboardingSecurity from "@/assets/onboarding-security.png";
import onboardingRewards from "@/assets/onboarding-rewards.png";

const SPLASH_DURATION = 2400;

const slides = [
  {
    image: onboardingWallet,
    title: "Your Digital Wallet",
    titleBn: "আপনার ডিজিটাল ওয়ালেট",
    desc: "Send, receive, and manage money instantly from your phone.",
    descBn: "ফোন থেকে তাৎক্ষণিকভাবে টাকা পাঠান, গ্রহণ করুন এবং পরিচালনা করুন।",
  },
  {
    image: onboardingTransfer,
    title: "Lightning-Fast Transfers",
    titleBn: "বিদ্যুৎ-গতির ট্রান্সফার",
    desc: "Pay bills, recharge mobile, and transfer to anyone in seconds.",
    descBn: "বিল পরিশোধ করুন, মোবাইল রিচার্জ এবং যেকোনো ব্যক্তিকে সেকেন্ডে ট্রান্সফার করুন।",
  },
  {
    image: onboardingSecurity,
    title: "Bank-Grade Security",
    titleBn: "ব্যাংক-গ্রেড নিরাপত্তা",
    desc: "Your money is protected with advanced encryption and biometric locks.",
    descBn: "আপনার টাকা উন্নত এনক্রিপশন এবং বায়োমেট্রিক লক দিয়ে সুরক্ষিত।",
  },
  {
    image: onboardingRewards,
    title: "Earn Rewards Daily",
    titleBn: "প্রতিদিন রিওয়ার্ড অর্জন করুন",
    desc: "Get cashback, loyalty points, and exclusive offers with every transaction.",
    descBn: "প্রতিটি লেনদেনে ক্যাশব্যাক, লয়ালটি পয়েন্ট এবং এক্সক্লুসিভ অফার পান।",
  },
];

const Welcome = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<"splash" | "onboarding">("splash");
  const [current, setCurrent] = useState(0);
  const [slideDir, setSlideDir] = useState<"in" | "out">("in");
  const [dragX, setDragX] = useState(0);
  const touchStartX = useRef(0);
  const isDragging = useRef(false);

  // Splash → onboarding
  useEffect(() => {
    const timer = setTimeout(() => setPhase("onboarding"), SPLASH_DURATION);
    return () => clearTimeout(timer);
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem("nitrozix-onboarded", "1");
    navigate("/auth", { replace: true });
  }, [navigate]);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= slides.length || index === current) return;
    setSlideDir("out");
    setTimeout(() => {
      setCurrent(index);
      setSlideDir("in");
    }, 200);
  }, [current]);

  const goNext = () => {
    if (current === slides.length - 1) { finish(); return; }
    goTo(current + 1);
  };

  const goPrev = () => { goTo(current - 1); };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
    setDragX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    // Resist at edges
    if ((current === 0 && diff > 0) || (current === slides.length - 1 && diff < 0)) {
      setDragX(diff * 0.2);
    } else {
      setDragX(diff);
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 50;
    if (dragX < -threshold) {
      if (current < slides.length - 1) goTo(current + 1);
      else finish();
    } else if (dragX > threshold) {
      goPrev();
    }
    setDragX(0);
  };

  // ── Splash Screen ──
  if (phase === "splash") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background safe-top safe-bottom overflow-hidden">
        {/* Animated rings */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-48 w-48 rounded-full border-2 border-primary/10 animate-[ping_2s_ease-out_infinite]" />
          <div className="absolute h-36 w-36 rounded-full border-2 border-primary/20 animate-[ping_2s_ease-out_0.4s_infinite]" />

          {/* Logo */}
          <div className="relative h-20 w-20 rounded-3xl gradient-primary flex items-center justify-center shadow-2xl animate-[scale-in_0.6s_ease-out]">
            <span className="text-primary-foreground font-display font-extrabold text-4xl">N</span>
          </div>
        </div>

        <div className="mt-10 text-center animate-[fade-in_0.8s_ease-out_0.4s_both]">
          <h1 className="font-display font-extrabold text-3xl tracking-tight">Nitrozix</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("Digital Banking & E-Wallet", "ডিজিটাল ব্যাংকিং ও ই-ওয়ালেট")}</p>
        </div>

        {/* Loading bar */}
        <div className="mt-12 w-40 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full gradient-primary"
            style={{
              animation: `splashLoad ${SPLASH_DURATION}ms ease-in-out forwards`,
            }}
          />
        </div>

        <style>{`
          @keyframes splashLoad {
            from { width: 0%; }
            to   { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // ── Onboarding Carousel ──
  const slide = slides[current];

  return (
    <div className="min-h-screen flex flex-col bg-background safe-top safe-bottom">
      {/* Skip */}
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={finish}>
          {t("Skip", "স্কিপ")}
        </Button>
      </div>

      {/* Slide content */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 touch-none select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          key={current}
          className={`flex flex-col items-center text-center ${
            dragX !== 0
              ? ""
              : `transition-all duration-300 ${slideDir === "in" ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`
          }`}
          style={dragX !== 0 ? { transform: `translateX(${dragX}px)`, opacity: Math.max(0.3, 1 - Math.abs(dragX) / 300) } : undefined}
        >
          {/* Illustration */}
          <div className="relative mb-10">
            <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-125" />
            <img
              src={slide.image}
              alt={slide.title}
              className="relative h-56 w-56 object-contain float-animation drop-shadow-2xl"
            />
          </div>

          <h2 className="font-display font-bold text-2xl leading-tight max-w-xs">
            {t(slide.title, slide.titleBn)}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-sm text-sm leading-relaxed">
            {t(slide.desc, slide.descBn)}
          </p>
        </div>
      </div>

      {/* Pagination + CTA */}
      <div className="p-6 pb-8 space-y-6">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 gradient-primary" : "w-2 bg-muted-foreground/25"
              }`}
            />
          ))}
        </div>

        <Button
          className="w-full h-14 gradient-primary text-primary-foreground text-base font-semibold gap-2 rounded-2xl shadow-lg"
          onClick={goNext}
        >
          {current === slides.length - 1 ? (
            <>
              {t("Get Started", "শুরু করুন")}
              <ArrowRight className="h-5 w-5" />
            </>
          ) : (
            <>
              {t("Next", "পরবর্তী")}
              <ChevronRight className="h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
