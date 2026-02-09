import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Layout } from "@/components/Layout";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";
import ReceiveMoney from "./pages/ReceiveMoney";
import RequestMoney from "./pages/RequestMoney";
import AddMoney from "./pages/AddMoney";
import MobileRecharge from "./pages/MobileRecharge";
import PayBills from "./pages/PayBills";
import MerchantPayment from "./pages/MerchantPayment";
import CashOut from "./pages/CashOut";
import TransactionHistory from "./pages/TransactionHistory";
import FinancialProducts from "./pages/FinancialProducts";
import BankTransfer from "./pages/BankTransfer";
import EducationDonations from "./pages/EducationDonations";
import OffersLifestyle from "./pages/OffersLifestyle";
import SettingsPage from "./pages/Settings";
import Cards from "./pages/Cards";
import CurrencyAccounts from "./pages/CurrencyAccounts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/send" element={<SendMoney />} />
              <Route path="/receive" element={<ReceiveMoney />} />
              <Route path="/request" element={<RequestMoney />} />
              <Route path="/add-money" element={<AddMoney />} />
              <Route path="/recharge" element={<MobileRecharge />} />
              <Route path="/pay-bills" element={<PayBills />} />
              <Route path="/merchant" element={<MerchantPayment />} />
              <Route path="/cash-out" element={<CashOut />} />
              <Route path="/history" element={<TransactionHistory />} />
              <Route path="/financial" element={<FinancialProducts />} />
              <Route path="/bank-transfer" element={<BankTransfer />} />
              <Route path="/education" element={<EducationDonations />} />
              <Route path="/offers" element={<OffersLifestyle />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/currency" element={<CurrencyAccounts />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
