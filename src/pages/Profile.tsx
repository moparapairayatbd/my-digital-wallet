import { ArrowLeft, Camera, CheckCircle, ChevronRight, Copy, Edit2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProfile, useBankAccounts } from "@/hooks/useWallet";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { t } = useLanguage();
  const { data: profile, isLoading } = useProfile();
  const { data: bankAccounts } = useBankAccounts();

  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto space-y-6 p-4">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-6 w-40 mx-auto" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
    : "U";

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-xl font-display font-bold">{t("My Profile", "আমার প্রোফাইল")}</h1>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-lg">{profile?.full_name || "User"}</h2>
          <p className="text-sm text-muted-foreground">{profile?.phone || ""}</p>
        </div>
        <div className="flex gap-2">
          <Badge className={`gap-1 border-0 ${profile?.kyc_status === "verified" ? "gradient-success text-primary-foreground" : "bg-muted"}`}>
            <CheckCircle className="h-3 w-3" />
            {profile?.kyc_status === "verified" ? t("KYC Verified", "কেওয়াইসি যাচাইকৃত") : t("Unverified", "অযাচাইকৃত")}
          </Badge>
          <Badge variant="outline" className="gap-1 capitalize">
            <Shield className="h-3 w-3" /> {profile?.account_tier || "basic"}
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {[
            { label: t("Full Name", "পুরো নাম"), value: profile?.full_name || "" },
            { label: t("Phone", "ফোন"), value: profile?.phone || "" },
            { label: t("Email", "ইমেইল"), value: profile?.email || "" },
            { label: t("NID", "জাতীয় পরিচয়পত্র"), value: profile?.nid ? `****${profile.nid.slice(-4)}` : "Not set" },
            { label: t("Member Since", "সদস্য হওয়ার তারিখ"), value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 touch-target">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium mt-0.5">{item.value}</p>
              </div>
              <Edit2 className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Linked Banks */}
      <div>
        <h3 className="font-display font-semibold mb-3">{t("Linked Banks", "সংযুক্ত ব্যাংক")}</h3>
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {bankAccounts && bankAccounts.length > 0 ? (
              bankAccounts.map((bank) => (
                <div key={bank.id} className="flex items-center justify-between p-4 touch-target">
                  <div>
                    <p className="text-sm font-medium">{bank.bank_name}</p>
                    <p className="text-xs text-muted-foreground">****{bank.account_number.slice(-4)} • {bank.account_type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("No linked banks yet", "এখনো কোনো ব্যাংক সংযুক্ত নেই")}
              </div>
            )}
            <button className="w-full p-4 text-sm text-primary font-medium text-center touch-target">
              + {t("Add Bank Account", "ব্যাংক অ্যাকাউন্ট যোগ করুন")}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      {profile?.referral_code && (
        <Card className="gradient-info text-primary-foreground border-0">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70">{t("Referral Code", "রেফারেল কোড")}</p>
              <p className="font-bold text-lg font-mono mt-0.5">{profile.referral_code}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="bg-white/15 hover:bg-white/25 text-primary-foreground gap-1"
              onClick={() => { navigator.clipboard.writeText(profile.referral_code || ""); toast.success("Copied!"); }}
            >
              <Copy className="h-4 w-4" /> {t("Copy", "কপি")}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
