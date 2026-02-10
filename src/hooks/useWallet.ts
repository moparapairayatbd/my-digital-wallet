import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useWallet() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["wallet", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useTransactions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useSendMoney() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phone, amount, reference }: { phone: string; amount: number; reference?: string }) => {
      if (!user) throw new Error("Not authenticated");

      // Get current wallet
      const { data: wallet, error: walletError } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (walletError) throw walletError;
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      // Deduct from sender
      const { error: updateError } = await supabase
        .from("wallets")
        .update({ balance: wallet.balance - amount })
        .eq("user_id", user.id);
      if (updateError) throw updateError;

      // Check if recipient exists
      const { data: recipientProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("phone", phone)
        .maybeSingle();

      // If recipient exists, credit them
      if (recipientProfile) {
        const { data: recipientWallet } = await supabase
          .from("wallets")
          .select("*")
          .eq("user_id", recipientProfile.user_id)
          .single();

        if (recipientWallet) {
          await supabase
            .from("wallets")
            .update({ balance: recipientWallet.balance + amount })
            .eq("user_id", recipientProfile.user_id);

          // Create receive transaction for recipient
          await supabase.from("transactions").insert({
            user_id: recipientProfile.user_id,
            type: "receive" as const,
            amount,
            sender_phone: wallet.currency,
            sender_name: "Nitrozix User",
            reference,
            description: `Received from ${phone}`,
          });
        }
      }

      // Create send transaction for sender
      const { data: tx, error: txError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "send" as const,
          amount,
          recipient_phone: phone,
          reference,
          description: `Sent to ${phone}`,
        })
        .select()
        .single();
      if (txError) throw txError;

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useAddMoney() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, source }: { amount: number; source: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!wallet) throw new Error("Wallet not found");

      await supabase
        .from("wallets")
        .update({ balance: wallet.balance + amount })
        .eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "add_money" as const,
          amount,
          description: `Added from ${source}`,
          sender_name: source,
        })
        .select()
        .single();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useCashOut() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ amount, agent }: { amount: number; agent: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase
        .from("wallets")
        .update({ balance: wallet.balance - amount })
        .eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "cashout" as const,
          amount,
          description: `Cash out via ${agent}`,
          recipient_name: agent,
        })
        .select()
        .single();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function usePayBill() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ billerName, category, accountNumber, amount }: {
      billerName: string;
      category: string;
      accountNumber: string;
      amount: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      await supabase.from("bill_payments").insert({
        user_id: user.id,
        biller_name: billerName,
        biller_category: category,
        account_number: accountNumber,
        amount,
      });

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "bill_pay" as const,
          amount,
          description: `${billerName} bill payment`,
          recipient_name: billerName,
          category,
        })
        .select()
        .single();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useRecharge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phoneNumber, operator, amount }: {
      phoneNumber: string;
      operator: string;
      amount: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      await supabase.from("mobile_recharges").insert({
        user_id: user.id,
        phone_number: phoneNumber,
        operator,
        amount,
      });

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "recharge" as const,
          amount,
          description: `${operator} recharge to ${phoneNumber}`,
          recipient_phone: phoneNumber,
        })
        .select()
        .single();

      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useCards() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cards", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardData: {
      card_type: "virtual" | "physical";
      card_name: string;
      design: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const cardNumber = `${cardData.card_type === "virtual" ? "4532" : "5412"} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const expiry = `${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getFullYear() + 4).slice(-2)}`;
      const cvv = String(Math.floor(100 + Math.random() * 900));

      const { data, error } = await supabase
        .from("cards")
        .insert({
          user_id: user.id,
          card_type: cardData.card_type,
          card_name: cardData.card_name,
          card_number: cardNumber,
          expiry_date: expiry,
          cvv,
          design: cardData.design,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useNotifications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useRewards() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["rewards", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useBankAccounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["bank_accounts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useMoneyRequests() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["money_requests", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("money_requests")
        .select("*")
        .eq("requester_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateMoneyRequest() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phone, amount, note }: { phone: string; amount: number; note?: string }) => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("money_requests")
        .insert({
          requester_id: user.id,
          target_phone: phone,
          amount,
          note,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["money_requests"] });
    },
  });
}
