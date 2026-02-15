
-- Table to log all Strowallet webhook events
CREATE TABLE public.card_webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  card_id TEXT,
  strowallet_ref TEXT,
  amount NUMERIC,
  status TEXT,
  narrative TEXT,
  raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  user_id UUID,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.card_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own webhook logs
CREATE POLICY "Users can view own webhook logs"
  ON public.card_webhook_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Service role inserts (from edge function) — no user policy needed for INSERT
-- Edge function uses service role key which bypasses RLS

-- Index for fast lookups
CREATE INDEX idx_card_webhook_logs_card_id ON public.card_webhook_logs (card_id);
CREATE INDEX idx_card_webhook_logs_user_id ON public.card_webhook_logs (user_id);
CREATE INDEX idx_card_webhook_logs_event ON public.card_webhook_logs (event_type);

-- Enable realtime for instant UI updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.card_webhook_logs;
