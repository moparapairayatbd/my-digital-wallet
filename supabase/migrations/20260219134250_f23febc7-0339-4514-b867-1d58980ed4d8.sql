-- Enable required extensions for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a database function to reset daily_spent for all cards
CREATE OR REPLACE FUNCTION public.reset_daily_spent()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.cards
  SET daily_spent = 0
  WHERE daily_spent > 0;

  RAISE LOG 'reset_daily_spent: reset % card(s) at %', ROW_COUNT, now();
END;
$$;