import { ArrowLeft, HelpCircle, Mail, MessageCircle, Phone, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLanguage } from "@/contexts/LanguageContext";
import { faqData } from "@/data/mockData";
import { Link } from "react-router-dom";
import { useState } from "react";

const popularTopics = [
  { title: "Send Money", titleBn: "টাকা পাঠানো", icon: "💸" },
  { title: "Card Issues", titleBn: "কার্ড সমস্যা", icon: "💳" },
  { title: "Refund", titleBn: "রিফান্ড", icon: "🔄" },
  { title: "KYC Help", titleBn: "কেওয়াইসি সাহায্য", icon: "📋" },
  { title: "Limits", titleBn: "সীমা", icon: "📊" },
  { title: "Fees", titleBn: "ফি", icon: "💰" },
];

const HelpSupport = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-lg mx-auto space-y-6 page-enter">
      <div className="flex items-center gap-3">
        <Link to="/"><Button variant="ghost" size="icon" className="h-9 w-9"><ArrowLeft className="h-5 w-5" /></Button></Link>
        <h1 className="text-xl font-display font-bold">{t("Help & Support", "সাহায্য ও সহায়তা")}</h1>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("Search for help...", "সাহায্য খুঁজুন...")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-12"
        />
      </div>

      {/* Popular Topics */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Popular Topics", "জনপ্রিয় বিষয়")}</h2>
        <div className="grid grid-cols-3 gap-3">
          {popularTopics.map((topic) => (
            <Card key={topic.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3 text-center">
                <span className="text-2xl">{topic.icon}</span>
                <p className="text-xs font-medium mt-1">{t(topic.title, topic.titleBn)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("FAQ", "প্রশ্নোত্তর")}</h2>
        {faqData.map((section) => (
          <div key={section.category} className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">{t(section.category, section.categoryBn)}</p>
            <Accordion type="single" collapsible>
              {section.items.map((item, i) => (
                <AccordionItem key={i} value={`${section.category}-${i}`}>
                  <AccordionTrigger className="text-sm text-left">{t(item.q, item.qBn)}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{t(item.a, item.aBn)}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div>
        <h2 className="font-display font-semibold mb-3">{t("Contact Us", "যোগাযোগ করুন")}</h2>
        <div className="grid grid-cols-1 gap-3">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3 touch-target">
              <div className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("Live Chat", "লাইভ চ্যাট")}</p>
                <p className="text-xs text-muted-foreground">{t("Chat with our support team", "আমাদের সাপোর্ট টিমের সাথে চ্যাট করুন")}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3 touch-target">
              <div className="h-10 w-10 rounded-full gradient-success flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("Call Support", "কল সাপোর্ট")}</p>
                <p className="text-xs text-muted-foreground">16789 ({t("24/7", "২৪/৭")})</p>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3 touch-target">
              <div className="h-10 w-10 rounded-full gradient-info flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t("Email Support", "ইমেইল সাপোর্ট")}</p>
                <p className="text-xs text-muted-foreground">support@nitrozix.com</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
