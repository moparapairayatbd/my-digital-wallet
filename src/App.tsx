import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout";
import Auth from "./pages/Auth";
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
import Remittance from "./pages/Remittance";
import PayLater from "./pages/PayLater";
import Notifications from "./pages/Notifications";
import QRScanner from "./pages/QRScanner";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import ReferEarn from "./pages/ReferEarn";
import Statements from "./pages/Statements";
import SecurityCenter from "./pages/SecurityCenter";
import HelpSupport from "./pages/HelpSupport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
    <Route path="/" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
    <Route path="/send" element={<ProtectedRoute><Layout><SendMoney /></Layout></ProtectedRoute>} />
    <Route path="/receive" element={<ProtectedRoute><Layout><ReceiveMoney /></Layout></ProtectedRoute>} />
    <Route path="/request" element={<ProtectedRoute><Layout><RequestMoney /></Layout></ProtectedRoute>} />
    <Route path="/add-money" element={<ProtectedRoute><Layout><AddMoney /></Layout></ProtectedRoute>} />
    <Route path="/recharge" element={<ProtectedRoute><Layout><MobileRecharge /></Layout></ProtectedRoute>} />
    <Route path="/pay-bills" element={<ProtectedRoute><Layout><PayBills /></Layout></ProtectedRoute>} />
    <Route path="/merchant" element={<ProtectedRoute><Layout><MerchantPayment /></Layout></ProtectedRoute>} />
    <Route path="/cash-out" element={<ProtectedRoute><Layout><CashOut /></Layout></ProtectedRoute>} />
    <Route path="/history" element={<ProtectedRoute><Layout><TransactionHistory /></Layout></ProtectedRoute>} />
    <Route path="/financial" element={<ProtectedRoute><Layout><FinancialProducts /></Layout></ProtectedRoute>} />
    <Route path="/bank-transfer" element={<ProtectedRoute><Layout><BankTransfer /></Layout></ProtectedRoute>} />
    <Route path="/education" element={<ProtectedRoute><Layout><EducationDonations /></Layout></ProtectedRoute>} />
    <Route path="/offers" element={<ProtectedRoute><Layout><OffersLifestyle /></Layout></ProtectedRoute>} />
    <Route path="/cards" element={<ProtectedRoute><Layout><Cards /></Layout></ProtectedRoute>} />
    <Route path="/currency" element={<ProtectedRoute><Layout><CurrencyAccounts /></Layout></ProtectedRoute>} />
    <Route path="/remittance" element={<ProtectedRoute><Layout><Remittance /></Layout></ProtectedRoute>} />
    <Route path="/pay-later" element={<ProtectedRoute><Layout><PayLater /></Layout></ProtectedRoute>} />
    <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
    <Route path="/qr-scan" element={<ProtectedRoute><Layout><QRScanner /></Layout></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
    <Route path="/rewards" element={<ProtectedRoute><Layout><Rewards /></Layout></ProtectedRoute>} />
    <Route path="/refer" element={<ProtectedRoute><Layout><ReferEarn /></Layout></ProtectedRoute>} />
    <Route path="/statements" element={<ProtectedRoute><Layout><Statements /></Layout></ProtectedRoute>} />
    <Route path="/security" element={<ProtectedRoute><Layout><SecurityCenter /></Layout></ProtectedRoute>} />
    <Route path="/support" element={<ProtectedRoute><Layout><HelpSupport /></Layout></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
