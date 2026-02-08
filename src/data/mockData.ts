export const user = {
  name: "Rahim Uddin",
  nameBn: "রহিম উদ্দিন",
  phone: "01712-345678",
  avatar: "",
  balance: 24580.50,
  accountNumber: "NTZ-2024-001234",
};

export interface Transaction {
  id: string;
  type: "send" | "receive" | "payment" | "cashout" | "add" | "recharge";
  title: string;
  titleBn: string;
  amount: number;
  date: string;
  to?: string;
  from?: string;
  status: "completed" | "pending" | "failed";
}

export const transactions: Transaction[] = [
  { id: "1", type: "send", title: "Send Money", titleBn: "টাকা পাঠানো", amount: -500, date: "2026-02-08", to: "01811-223344", status: "completed" },
  { id: "2", type: "receive", title: "Received Money", titleBn: "টাকা প্রাপ্তি", amount: 2000, date: "2026-02-07", from: "01911-556677", status: "completed" },
  { id: "3", type: "payment", title: "Electricity Bill", titleBn: "বিদ্যুৎ বিল", amount: -1250, date: "2026-02-06", to: "DPDC", status: "completed" },
  { id: "4", type: "recharge", title: "Mobile Recharge", titleBn: "মোবাইল রিচার্জ", amount: -99, date: "2026-02-05", to: "01712-345678", status: "completed" },
  { id: "5", type: "cashout", title: "Cash Out", titleBn: "ক্যাশ আউট", amount: -5000, date: "2026-02-04", to: "Agent-4521", status: "completed" },
  { id: "6", type: "add", title: "Add Money", titleBn: "টাকা যোগ", amount: 10000, date: "2026-02-03", from: "DBBL Bank", status: "completed" },
  { id: "7", type: "send", title: "Send Money", titleBn: "টাকা পাঠানো", amount: -350, date: "2026-02-02", to: "01611-889900", status: "completed" },
  { id: "8", type: "payment", title: "Internet Bill", titleBn: "ইন্টারনেট বিল", amount: -800, date: "2026-02-01", to: "Link3", status: "completed" },
  { id: "9", type: "receive", title: "Request Fulfilled", titleBn: "অনুরোধ পূরণ", amount: 1500, date: "2026-01-31", from: "01511-112233", status: "completed" },
  { id: "10", type: "payment", title: "Gas Bill", titleBn: "গ্যাস বিল", amount: -450, date: "2026-01-30", to: "Titas Gas", status: "completed" },
];

export const pendingRequests = [
  { id: "r1", phone: "01811-223344", amount: 500, status: "pending" as const, date: "2026-02-07" },
  { id: "r2", phone: "01911-556677", amount: 1200, status: "pending" as const, date: "2026-02-06" },
  { id: "r3", phone: "01611-889900", amount: 300, status: "completed" as const, date: "2026-02-04" },
];

export const operators = [
  { id: "gp", name: "Grameenphone", nameBn: "গ্রামীণফোন", color: "hsl(152, 68%, 45%)" },
  { id: "robi", name: "Robi", nameBn: "রবি", color: "hsl(0, 80%, 55%)" },
  { id: "bl", name: "Banglalink", nameBn: "বাংলালিংক", color: "hsl(25, 95%, 55%)" },
  { id: "airtel", name: "Airtel", nameBn: "এয়ারটেল", color: "hsl(0, 80%, 45%)" },
  { id: "tt", name: "Teletalk", nameBn: "টেলিটক", color: "hsl(210, 85%, 55%)" },
];

export const billCategories = [
  { id: "electricity", name: "Electricity", nameBn: "বিদ্যুৎ", icon: "Zap", color: "hsl(45, 95%, 55%)" },
  { id: "gas", name: "Gas", nameBn: "গ্যাস", icon: "Flame", color: "hsl(25, 95%, 55%)" },
  { id: "water", name: "Water", nameBn: "পানি", icon: "Droplets", color: "hsl(210, 85%, 55%)" },
  { id: "internet", name: "Internet", nameBn: "ইন্টারনেট", icon: "Wifi", color: "hsl(280, 65%, 55%)" },
  { id: "phone", name: "Phone", nameBn: "ফোন", icon: "Phone", color: "hsl(152, 68%, 45%)" },
  { id: "tv", name: "TV", nameBn: "টিভি", icon: "Tv", color: "hsl(330, 85%, 52%)" },
  { id: "creditcard", name: "Credit Card", nameBn: "ক্রেডিট কার্ড", icon: "CreditCard", color: "hsl(0, 80%, 55%)" },
];

export const banks = [
  { id: "dbbl", name: "Dutch-Bangla Bank" },
  { id: "brac", name: "BRAC Bank" },
  { id: "city", name: "City Bank" },
  { id: "ebl", name: "Eastern Bank" },
  { id: "ucb", name: "United Commercial Bank" },
  { id: "mtb", name: "Mutual Trust Bank" },
];

export const savingsPlans = [
  { id: "s1", name: "Weekly DPS", nameBn: "সাপ্তাহিক ডিপিএস", amount: 500, duration: "1 Year", rate: "7.5%", maturity: 27500 },
  { id: "s2", name: "Monthly DPS", nameBn: "মাসিক ডিপিএস", amount: 2000, duration: "2 Years", rate: "8.0%", maturity: 52000 },
  { id: "s3", name: "Premium Savings", nameBn: "প্রিমিয়াম সঞ্চয়", amount: 5000, duration: "3 Years", rate: "9.0%", maturity: 198000 },
];

export const loanOffers = [
  { id: "l1", name: "Nano Credit", nameBn: "ন্যানো ক্রেডিট", amount: 5000, interest: "9%", tenure: "30 days", eligible: true },
  { id: "l2", name: "Emergency Loan", nameBn: "জরুরী ঋণ", amount: 20000, interest: "12%", tenure: "90 days", eligible: true },
  { id: "l3", name: "Business Loan", nameBn: "ব্যবসায়িক ঋণ", amount: 100000, interest: "15%", tenure: "1 Year", eligible: false },
];

export const offers = [
  { id: "o1", title: "20% Cashback on Recharge", titleBn: "রিচার্জে ২০% ক্যাশব্যাক", description: "Get 20% cashback on mobile recharge above ৳100", validTill: "Feb 28, 2026", color: "gradient-primary" },
  { id: "o2", title: "Free Transfer Weekend", titleBn: "ফ্রি ট্রান্সফার উইকেন্ড", description: "Send money for free every Saturday & Sunday", validTill: "Mar 15, 2026", color: "gradient-secondary" },
  { id: "o3", title: "Bill Pay Bonus", titleBn: "বিল পে বোনাস", description: "Pay 3 bills and get ৳50 bonus", validTill: "Feb 20, 2026", color: "gradient-success" },
  { id: "o4", title: "New User Bonus ৳100", titleBn: "নতুন ব্যবহারকারী বোনাস ৳১০০", description: "Refer a friend and both get ৳100", validTill: "Mar 31, 2026", color: "gradient-info" },
];

export const lifestyleCategories = [
  { id: "tickets", name: "Ticket Booking", nameBn: "টিকেট বুকিং", icon: "Ticket" },
  { id: "food", name: "Food Delivery", nameBn: "ফুড ডেলিভারি", icon: "UtensilsCrossed" },
  { id: "shopping", name: "Shopping", nameBn: "শপিং", icon: "ShoppingBag" },
  { id: "travel", name: "Travel", nameBn: "ভ্রমণ", icon: "Plane" },
];

export const agentPoints = [
  { id: "a1", name: "Rahim Store", nameBn: "রহিম স্টোর", distance: "0.3 km", phone: "01712-111111" },
  { id: "a2", name: "Karim Enterprise", nameBn: "করিম এন্টারপ্রাইজ", distance: "0.5 km", phone: "01812-222222" },
  { id: "a3", name: "City Cash Point", nameBn: "সিটি ক্যাশ পয়েন্ট", distance: "0.8 km", phone: "01912-333333" },
  { id: "a4", name: "Digital Corner", nameBn: "ডিজিটাল কর্নার", distance: "1.2 km", phone: "01612-444444" },
];

export const educationInstitutions = [
  { id: "e1", name: "Dhaka University", nameBn: "ঢাকা বিশ্ববিদ্যালয়" },
  { id: "e2", name: "BUET", nameBn: "বুয়েট" },
  { id: "e3", name: "Dhaka College", nameBn: "ঢাকা কলেজ" },
  { id: "e4", name: "Viqarunnisa School", nameBn: "ভিকারুননিসা স্কুল" },
];

export const donationCategories = [
  { id: "d1", name: "Mosque & Madrasa", nameBn: "মসজিদ ও মাদ্রাসা" },
  { id: "d2", name: "Disaster Relief", nameBn: "দুর্যোগ ত্রাণ" },
  { id: "d3", name: "Orphanage", nameBn: "এতিমখানা" },
  { id: "d4", name: "Health & Medical", nameBn: "স্বাস্থ্য ও চিকিৎসা" },
];
