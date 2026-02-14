import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/** Subscribe to realtime changes on wallets, transactions & notifications */
export function useRealtimeSync() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("wallet-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "wallets", filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ["wallet", user.id] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["transactions", user.id] });
          if (payload.eventType === "INSERT") {
            const tx = payload.new as { type?: string; amount?: number; sender_name?: string; description?: string };
            if (tx.type === "receive") {
              toast.success(`💰 You received ৳${Number(tx.amount).toLocaleString()}`, {
                description: tx.sender_name || tx.description || "Someone sent you money!",
              });
            }
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["notifications", user.id] });
          const notif = payload.new as { title?: string; message?: string };
          toast(notif.title || "Notification", { description: notif.message });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}

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

      // Get profile for customer registration
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();
      if (!profile) throw new Error("Profile not found");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("No session");

      // Step 1: Ensure Strowallet customer exists
      if (!(profile as any).strowallet_customer_id) {
        const nameParts = (profile.full_name || "User").split(" ");
        const customerRes = await fetch(`${supabaseUrl}/functions/v1/strowallet-proxy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            action: "create-customer",
            firstName: nameParts[0] || "User",
            lastName: nameParts.slice(1).join(" ") || "Account",
            email: profile.email,
            phone: profile.phone,
          }),
        });
        const customerData = await customerRes.json();
        if (customerData.customer_id || customerData.customerEmail) {
          await supabase
            .from("profiles")
            .update({ strowallet_customer_id: customerData.customer_id || profile.email } as any)
            .eq("user_id", user.id);
        }
      }

      // Step 2: Create the card via Strowallet
      const cardRes = await fetch(`${supabaseUrl}/functions/v1/strowallet-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          action: "create-card",
          name_on_card: cardData.card_name,
          card_type: "visa",
          amount: 1,
          customerEmail: profile.email,
        }),
      });
      const cardResult = await cardRes.json();

      // Extract card details from response
      const strowalletCardId = cardResult.card_id || cardResult.data?.card_id || "";
      const cardNumber = cardResult.card_pan || cardResult.data?.card_pan || cardResult.masked_pan || `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const expiry = cardResult.expiry_date || cardResult.data?.expiry_date || `${String(new Date().getMonth() + 1).padStart(2, "0")}/${String(new Date().getFullYear() + 4).slice(-2)}`;
      const cvv = cardResult.cvv || cardResult.data?.cvv || "***";

      // Format card number with spaces if needed
      const formattedNumber = cardNumber.replace(/(.{4})/g, "$1 ").trim();

      const { data, error } = await supabase
        .from("cards")
        .insert({
          user_id: user.id,
          card_type: cardData.card_type,
          card_name: cardData.card_name,
          card_number: formattedNumber,
          expiry_date: expiry,
          cvv,
          design: cardData.design,
          strowallet_card_id: strowalletCardId,
        } as any)
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

export function useFundCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, strowalletCardId, amount }: { cardId: string; strowalletCardId: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("No session");

      // Deduct from wallet
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      const res = await fetch(`${supabaseUrl}/functions/v1/strowallet-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "fund-card", card_id: strowalletCardId, amount }),
      });
      const result = await res.json();
      if (!res.ok || result.error || result.success === false) {
        const msg = result.error || result.message || "Failed to fund card";
        const details = result.errors ? Object.values(result.errors).flat().join(", ") : "";
        throw new Error(details ? `${msg}: ${details}` : msg);
      }

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      await supabase.from("transactions").insert({
        user_id: user.id,
        type: "send" as const,
        amount,
        description: `Fund card ending ${strowalletCardId.slice(-4)}`,
        category: "card_funding",
      });

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useFreezeCard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardId, strowalletCardId, freeze }: { cardId: string; strowalletCardId: string; freeze: boolean }) => {
      if (!user) throw new Error("Not authenticated");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("No session");

      const res = await fetch(`${supabaseUrl}/functions/v1/strowallet-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "freeze-card", card_id: strowalletCardId, freeze_action: freeze ? "freeze" : "unfreeze" }),
      });
      const result = await res.json();
      if (!res.ok || result.error || result.success === false) {
        const msg = result.error || result.message || "Failed to update card status";
        throw new Error(msg);
      }

      // Update local status
      await supabase
        .from("cards")
        .update({ status: freeze ? "frozen" : "active" })
        .eq("id", cardId);

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });
}

export function useCardDetails() {
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ strowalletCardId }: { strowalletCardId: string }) => {
      if (!user) throw new Error("Not authenticated");

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error("No session");

      const res = await fetch(`${supabaseUrl}/functions/v1/strowallet-proxy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ action: "fetch-card-detail", card_id: strowalletCardId }),
      });
      return await res.json();
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

export function useMerchantPayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ merchantId, merchantName, amount }: { merchantId: string; merchantName: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "merchant" as const,
          amount,
          description: `Payment to ${merchantName}`,
          recipient_name: merchantName,
          recipient_phone: merchantId,
          category: "merchant",
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

export function useBankTransfer() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bankName, accountNumber, amount }: { bankName: string; accountNumber: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "send" as const,
          amount,
          description: `Bank transfer to ${bankName}`,
          recipient_name: bankName,
          recipient_phone: accountNumber,
          category: "bank_transfer",
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

export function useRewardHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["reward_history", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("reward_history")
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

export function useActiveSessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["active_sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("active_sessions")
        .select("*")
        .eq("user_id", user.id)
        .order("last_active", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useReferrals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["referrals", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useQRPayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ merchantName, category, amount }: { merchantName: string; category: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "merchant" as const,
          amount,
          description: `QR payment to ${merchantName}`,
          recipient_name: merchantName,
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

export function useEducationPayment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ institutionName, amount }: { institutionName: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "bill_pay" as const,
          amount,
          description: `Education fee: ${institutionName}`,
          recipient_name: institutionName,
          category: "education",
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

export function useDonation() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ categoryName, amount }: { categoryName: string; amount: number }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");
      if (wallet.balance < amount) throw new Error("Insufficient balance");

      await supabase.from("wallets").update({ balance: wallet.balance - amount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "send" as const,
          amount,
          description: `Donation: ${categoryName}`,
          recipient_name: categoryName,
          category: "donation",
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

export function useRemittance() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ senderName, foreignAmount, foreignCurrency, bdtAmount, rate }: {
      senderName: string; foreignAmount: number; foreignCurrency: string; bdtAmount: number; rate: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data: wallet } = await supabase.from("wallets").select("*").eq("user_id", user.id).single();
      if (!wallet) throw new Error("Wallet not found");

      await supabase.from("wallets").update({ balance: wallet.balance + bdtAmount }).eq("user_id", user.id);

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "remittance" as const,
          amount: bdtAmount,
          description: `Remittance from ${senderName} (${foreignCurrency} ${foreignAmount})`,
          sender_name: senderName,
          metadata: { foreign_amount: foreignAmount, foreign_currency: foreignCurrency, rate },
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

export function useCurrencyAccounts() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["currency_accounts", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("currency_accounts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useCreateCurrencyAccount() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currency, currencyName, accountNumber }: {
      currency: string; currencyName: string; accountNumber: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("currency_accounts")
        .insert({
          user_id: user.id,
          currency,
          currency_name: currencyName,
          account_number: accountNumber,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currency_accounts"] });
    },
  });
}

export function usePayLaterActivate() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ merchantName, amount, installments, monthly }: {
      merchantName: string; amount: number; installments: number; monthly: number;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const { data: tx } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          type: "merchant" as const,
          amount,
          description: `Pay Later: ${merchantName} (${installments}x ৳${monthly})`,
          recipient_name: merchantName,
          category: "pay_later",
          metadata: { installments, monthly, merchant: merchantName },
        })
        .select()
        .single();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
