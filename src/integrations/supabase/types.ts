export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      active_sessions: {
        Row: {
          created_at: string
          device: string
          id: string
          ip_address: string | null
          is_current: boolean | null
          last_active: string
          location: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string
          location?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device?: string
          id?: string
          ip_address?: string | null
          is_current?: boolean | null
          last_active?: string
          location?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_number: string
          account_type: string
          balance: number | null
          bank_name: string
          created_at: string
          currency: string
          id: string
          is_primary: boolean | null
          user_id: string
        }
        Insert: {
          account_number: string
          account_type?: string
          balance?: number | null
          bank_name: string
          created_at?: string
          currency?: string
          id?: string
          is_primary?: boolean | null
          user_id: string
        }
        Update: {
          account_number?: string
          account_type?: string
          balance?: number | null
          bank_name?: string
          created_at?: string
          currency?: string
          id?: string
          is_primary?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      bill_payments: {
        Row: {
          account_number: string
          amount: number
          biller_category: string
          biller_name: string
          created_at: string
          id: string
          status: Database["public"]["Enums"]["transaction_status"]
          user_id: string
        }
        Insert: {
          account_number: string
          amount: number
          biller_category: string
          biller_name: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          biller_category?: string
          biller_name?: string
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          user_id?: string
        }
        Relationships: []
      }
      cards: {
        Row: {
          card_name: string
          card_number: string
          card_type: Database["public"]["Enums"]["card_type"]
          contactless_enabled: boolean | null
          created_at: string
          cvv: string
          daily_spent: number | null
          design: string | null
          expiry_date: string
          id: string
          international_enabled: boolean | null
          online_enabled: boolean | null
          spending_limit: number | null
          status: Database["public"]["Enums"]["card_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          card_name: string
          card_number: string
          card_type?: Database["public"]["Enums"]["card_type"]
          contactless_enabled?: boolean | null
          created_at?: string
          cvv: string
          daily_spent?: number | null
          design?: string | null
          expiry_date: string
          id?: string
          international_enabled?: boolean | null
          online_enabled?: boolean | null
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          card_name?: string
          card_number?: string
          card_type?: Database["public"]["Enums"]["card_type"]
          contactless_enabled?: boolean | null
          created_at?: string
          cvv?: string
          daily_spent?: number | null
          design?: string | null
          expiry_date?: string
          id?: string
          international_enabled?: boolean | null
          online_enabled?: boolean | null
          spending_limit?: number | null
          status?: Database["public"]["Enums"]["card_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      currency_accounts: {
        Row: {
          account_number: string
          balance: number | null
          created_at: string
          currency: string
          currency_name: string
          id: string
          user_id: string
        }
        Insert: {
          account_number: string
          balance?: number | null
          created_at?: string
          currency: string
          currency_name: string
          id?: string
          user_id: string
        }
        Update: {
          account_number?: string
          balance?: number | null
          created_at?: string
          currency?: string
          currency_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      mobile_recharges: {
        Row: {
          amount: number
          created_at: string
          id: string
          operator: string
          phone_number: string
          recharge_type: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          operator: string
          phone_number: string
          recharge_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          operator?: string
          phone_number?: string
          recharge_type?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          user_id?: string
        }
        Relationships: []
      }
      money_requests: {
        Row: {
          amount: number
          created_at: string
          id: string
          note: string | null
          requester_id: string
          status: Database["public"]["Enums"]["transaction_status"]
          target_phone: string
          target_user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          note?: string | null
          requester_id: string
          status?: Database["public"]["Enums"]["transaction_status"]
          target_phone: string
          target_user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          note?: string | null
          requester_id?: string
          status?: Database["public"]["Enums"]["transaction_status"]
          target_phone?: string
          target_user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_tier: Database["public"]["Enums"]["account_tier"]
          avatar_url: string | null
          biometric_enabled: boolean | null
          created_at: string
          email: string
          full_name: string
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          nid: string | null
          phone: string
          pin_hash: string | null
          referral_code: string | null
          referred_by: string | null
          two_factor_enabled: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_tier?: Database["public"]["Enums"]["account_tier"]
          avatar_url?: string | null
          biometric_enabled?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          nid?: string | null
          phone?: string
          pin_hash?: string | null
          referral_code?: string | null
          referred_by?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_tier?: Database["public"]["Enums"]["account_tier"]
          avatar_url?: string | null
          biometric_enabled?: boolean | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          nid?: string | null
          phone?: string
          pin_hash?: string | null
          referral_code?: string | null
          referred_by?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_phone: string
          referred_user_id: string | null
          referrer_id: string
          reward_amount: number | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_phone: string
          referred_user_id?: string | null
          referrer_id: string
          reward_amount?: number | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_phone?: string
          referred_user_id?: string | null
          referrer_id?: string
          reward_amount?: number | null
          status?: string
        }
        Relationships: []
      }
      reward_history: {
        Row: {
          created_at: string
          description: string
          id: string
          points: number
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          points: number
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          points?: number
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      rewards: {
        Row: {
          created_at: string
          id: string
          points: number
          tier: Database["public"]["Enums"]["reward_tier"]
          total_earned: number
          total_redeemed: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["reward_tier"]
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          tier?: Database["public"]["Enums"]["reward_tier"]
          total_earned?: number
          total_redeemed?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          currency: string
          description: string | null
          fee: number
          id: string
          metadata: Json | null
          recipient_name: string | null
          recipient_phone: string | null
          recipient_user_id: string | null
          reference: string | null
          sender_name: string | null
          sender_phone: string | null
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          fee?: number
          id?: string
          metadata?: Json | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          reference?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          fee?: number
          id?: string
          metadata?: Json | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_user_id?: string | null
          reference?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_tier: "basic" | "silver" | "gold" | "platinum"
      card_status: "active" | "frozen" | "blocked" | "pending"
      card_type: "virtual" | "physical"
      kyc_status: "unverified" | "pending" | "verified" | "rejected"
      notification_type: "transaction" | "promo" | "security" | "system"
      reward_tier: "bronze" | "silver" | "gold" | "platinum"
      transaction_status: "pending" | "completed" | "failed" | "cancelled"
      transaction_type:
        | "send"
        | "receive"
        | "request"
        | "bill_pay"
        | "recharge"
        | "cashout"
        | "add_money"
        | "merchant"
        | "remittance"
        | "reward"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_tier: ["basic", "silver", "gold", "platinum"],
      card_status: ["active", "frozen", "blocked", "pending"],
      card_type: ["virtual", "physical"],
      kyc_status: ["unverified", "pending", "verified", "rejected"],
      notification_type: ["transaction", "promo", "security", "system"],
      reward_tier: ["bronze", "silver", "gold", "platinum"],
      transaction_status: ["pending", "completed", "failed", "cancelled"],
      transaction_type: [
        "send",
        "receive",
        "request",
        "bill_pay",
        "recharge",
        "cashout",
        "add_money",
        "merchant",
        "remittance",
        "reward",
      ],
    },
  },
} as const
