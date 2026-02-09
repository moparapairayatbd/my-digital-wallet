import { ArrowLeft, Camera, CheckCircle, ChevronRight, Copy, Edit2, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { user, linkedBanks } from "@/data/mockData";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/">
          <Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-xl font-display font-bold">{t("My Profile", "আমার প্রোফাইল")}</h1>
      </div>

      {/* Avatar & Name */}
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
              {user.name.split(" ").map(n => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center">
          <h2 className="font-display font-bold text-lg">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.phone}</p>
        </div>
        <div className="flex gap-2">
          <Badge className="gradient-success text-primary-foreground gap-1 border-0">
            <CheckCircle className="h-3 w-3" /> {t("KYC Verified", "কেওয়াইসি যাচাইকৃত")}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="h-3 w-3" /> {user.tier}
          </Badge>
        </div>
      </div>

      {/* Personal Details */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {[
            { label: t("Full Name", "পুরো নাম"), value: user.name },
            { label: t("Phone", "ফোন"), value: user.phone },
            { label: t("Email", "ইমেইল"), value: user.email },
            { label: t("NID", "জাতীয় পরিচয়পত্র"), value: `****${user.nid.slice(-4)}` },
            { label: t("Account", "অ্যাকাউন্ট"), value: user.accountNumber },
            { label: t("Member Since", "সদস্য হওয়ার তারিখ"), value: user.joinDate },
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
            {linkedBanks.map((bank) => (
              <div key={bank.id} className="flex items-center justify-between p-4 touch-target">
                <div>
                  <p className="text-sm font-medium">{bank.bank}</p>
                  <p className="text-xs text-muted-foreground">{bank.accountNo} • {bank.type}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <button className="w-full p-4 text-sm text-primary font-medium text-center touch-target">
              + {t("Add Bank Account", "ব্যাংক অ্যাকাউন্ট যোগ করুন")}
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Referral Code */}
      <Card className="gradient-info text-primary-foreground border-0">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs opacity-70">{t("Referral Code", "রেফারেল কোড")}</p>
            <p className="font-bold text-lg font-mono mt-0.5">{user.referralCode}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="bg-white/15 hover:bg-white/25 text-primary-foreground gap-1"
            onClick={() => { navigator.clipboard.writeText(user.referralCode); toast.success("Copied!"); }}
          >
            <Copy className="h-4 w-4" /> {t("Copy", "কপি")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
