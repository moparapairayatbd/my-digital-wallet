
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.transaction_type AS ENUM ('send', 'receive', 'request', 'bill_pay', 'recharge', 'cashout', 'add_money', 'merchant', 'remittance', 'reward');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.card_status AS ENUM ('active', 'frozen', 'blocked', 'pending');
CREATE TYPE public.card_type AS ENUM ('virtual', 'physical');
CREATE TYPE public.kyc_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE public.account_tier AS ENUM ('basic', 'silver', 'gold', 'platinum');
CREATE TYPE public.notification_type AS ENUM ('transaction', 'promo', 'security', 'system');
CREATE TYPE public.reward_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  nid TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  kyc_status public.kyc_status NOT NULL DEFAULT 'unverified',
  account_tier public.account_tier NOT NULL DEFAULT 'basic',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  pin_hash TEXT DEFAULT '',
  biometric_enabled BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- WALLETS
-- ============================================================
CREATE TABLE public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance NUMERIC(15,2) NOT NULL DEFAULT 10000.00,
  currency TEXT NOT NULL DEFAULT 'BDT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet" ON public.wallets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert wallet" ON public.wallets FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRANSACTIONS
-- ============================================================
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.transaction_type NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'completed',
  amount NUMERIC(15,2) NOT NULL,
  fee NUMERIC(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'BDT',
  recipient_phone TEXT,
  recipient_name TEXT,
  recipient_user_id UUID REFERENCES auth.users(id),
  sender_phone TEXT,
  sender_name TEXT,
  reference TEXT,
  description TEXT,
  category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- CARDS
-- ============================================================
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_type public.card_type NOT NULL DEFAULT 'virtual',
  status public.card_status NOT NULL DEFAULT 'active',
  card_number TEXT NOT NULL,
  card_name TEXT NOT NULL,
  expiry_date TEXT NOT NULL,
  cvv TEXT NOT NULL,
  design TEXT DEFAULT 'gradient-1',
  spending_limit NUMERIC(15,2) DEFAULT 50000,
  daily_spent NUMERIC(15,2) DEFAULT 0,
  online_enabled BOOLEAN DEFAULT true,
  international_enabled BOOLEAN DEFAULT false,
  contactless_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cards" ON public.cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON public.cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON public.cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON public.cards FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- BANK ACCOUNTS
-- ============================================================
CREATE TABLE public.bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'savings',
  currency TEXT NOT NULL DEFAULT 'BDT',
  balance NUMERIC(15,2) DEFAULT 0,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bank accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bank accounts" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bank accounts" ON public.bank_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bank accounts" ON public.bank_accounts FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- CURRENCY ACCOUNTS
-- ============================================================
CREATE TABLE public.currency_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currency TEXT NOT NULL,
  currency_name TEXT NOT NULL,
  balance NUMERIC(15,2) DEFAULT 0,
  account_number TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.currency_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own currency accounts" ON public.currency_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own currency accounts" ON public.currency_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own currency accounts" ON public.currency_accounts FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================
-- BILL PAYMENTS
-- ============================================================
CREATE TABLE public.bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  biller_name TEXT NOT NULL,
  biller_category TEXT NOT NULL,
  account_number TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bills" ON public.bill_payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bills" ON public.bill_payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- MOBILE RECHARGES
-- ============================================================
CREATE TABLE public.mobile_recharges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  operator TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  recharge_type TEXT DEFAULT 'prepaid',
  status public.transaction_status NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mobile_recharges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recharges" ON public.mobile_recharges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recharges" ON public.mobile_recharges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REWARDS
-- ============================================================
CREATE TABLE public.rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 500,
  tier public.reward_tier NOT NULL DEFAULT 'bronze',
  total_earned INTEGER NOT NULL DEFAULT 500,
  total_redeemed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own rewards" ON public.rewards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own rewards" ON public.rewards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own rewards" ON public.rewards FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REWARD HISTORY
-- ============================================================
CREATE TABLE public.reward_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'earned',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reward_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reward history" ON public.reward_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reward history" ON public.reward_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type public.notification_type NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- MONEY REQUESTS
-- ============================================================
CREATE TABLE public.money_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_phone TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  amount NUMERIC(15,2) NOT NULL,
  status public.transaction_status NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.money_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests" ON public.money_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = target_user_id);
CREATE POLICY "Users can insert own requests" ON public.money_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update requests targeting them" ON public.money_requests FOR UPDATE USING (auth.uid() = target_user_id OR auth.uid() = requester_id);

-- ============================================================
-- REFERRALS
-- ============================================================
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id),
  referred_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reward_amount NUMERIC(15,2) DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT USING (auth.uid() = referrer_id);
CREATE POLICY "Users can insert own referrals" ON public.referrals FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- ============================================================
-- ACTIVE SESSIONS (for security center)
-- ============================================================
CREATE TABLE public.active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device TEXT NOT NULL,
  location TEXT,
  ip_address TEXT,
  is_current BOOLEAN DEFAULT false,
  last_active TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON public.active_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON public.active_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sessions" ON public.active_sessions FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: Auto-create profile, wallet, rewards on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
DECLARE
  ref_code TEXT;
BEGIN
  -- Generate unique referral code
  ref_code := 'NTZ' || UPPER(SUBSTR(MD5(NEW.id::text), 1, 6));
  
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name, email, phone, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.phone, COALESCE(NEW.raw_user_meta_data->>'phone', '')),
    ref_code
  );
  
  -- Create wallet with demo balance
  INSERT INTO public.wallets (user_id, balance) VALUES (NEW.id, 10000.00);
  
  -- Create rewards
  INSERT INTO public.rewards (user_id, points, total_earned) VALUES (NEW.id, 500, 500);
  
  -- Welcome notification
  INSERT INTO public.notifications (user_id, type, title, message)
  VALUES (NEW.id, 'system', 'Welcome to Nitrozix!', 'Your account is ready. You have ৳10,000 demo balance to explore.');
  
  -- Create initial session
  INSERT INTO public.active_sessions (user_id, device, location, is_current)
  VALUES (NEW.id, 'Web Browser', 'Dhaka, Bangladesh', true);
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON public.rewards FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
