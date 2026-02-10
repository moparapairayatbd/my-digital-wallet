import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const { t } = useLanguage();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!form.fullName || !form.phone) {
          toast.error(t("Please fill all fields", "সব ক্ষেত্র পূরণ করুন"));
          setLoading(false);
          return;
        }
        const { error } = await signUp(form.email, form.password, form.fullName, form.phone);
        if (error) throw error;
        toast.success(t("Account created! Welcome to Nitrozix!", "অ্যাকাউন্ট তৈরি! নাইট্রোজিক্সে স্বাগতম!"));
      } else {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success(t("Welcome back!", "স্বাগতম!"));
      }
    } catch (error: any) {
      toast.error(error.message || t("Something went wrong", "কিছু ভুল হয়েছে"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-lg">
          <span className="text-primary-foreground font-bold text-xl">N</span>
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl">Nitrozix</h1>
          <p className="text-xs text-muted-foreground">{t("Digital Banking & E-Wallet", "ডিজিটাল ব্যাংকিং ও ই-ওয়ালেট")}</p>
        </div>
      </div>

      <Card className="w-full max-w-md shadow-xl border-0">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-display font-bold">
              {isSignUp ? t("Create Account", "অ্যাকাউন্ট তৈরি করুন") : t("Welcome Back", "স্বাগতম")}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp
                ? t("Join Nitrozix and start your journey", "নাইট্রোজিক্সে যোগ দিন")
                : t("Sign in to your account", "আপনার অ্যাকাউন্টে প্রবেশ করুন")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Full Name", "পূর্ণ নাম")}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Phone (01XXX-XXXXXX)", "ফোন (01XXX-XXXXXX)")}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="pl-10 h-12"
                    required
                  />
                </div>
              </>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={t("Email Address", "ইমেইল ঠিকানা")}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="pl-10 h-12"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder={t("Password", "পাসওয়ার্ড")}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="pl-10 pr-10 h-12"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 gradient-primary text-primary-foreground text-base gap-2"
              disabled={loading}
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? t("Create Account", "অ্যাকাউন্ট তৈরি") : t("Sign In", "সাইন ইন")}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary font-medium hover:underline"
            >
              {isSignUp
                ? t("Already have an account? Sign In", "ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন")
                : t("Don't have an account? Sign Up", "অ্যাকাউন্ট নেই? সাইন আপ করুন")}
            </button>
          </div>

          {/* Demo hint */}
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <p className="text-xs text-muted-foreground">
              {t("🎉 New users get ৳10,000 demo balance!", "🎉 নতুন ব্যবহারকারীরা ৳১০,০০০ ডেমো ব্যালেন্স পাবেন!")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
