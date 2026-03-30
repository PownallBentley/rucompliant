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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      advisor_conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      advisor_messages: {
        Row: {
          confidence: Database["public"]["Enums"]["health_status"] | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Insert: {
          confidence?: Database["public"]["Enums"]["health_status"] | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["message_role"]
        }
        Update: {
          confidence?: Database["public"]["Enums"]["health_status"] | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["message_role"]
        }
        Relationships: [
          {
            foreignKeyName: "advisor_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "advisor_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          business_type: Database["public"]["Enums"]["business_type"]
          created_at: string
          headcount: number
          id: string
          onboarding_completed: boolean
          sector: string | null
          trading_start_date: string | null
          updated_at: string
          user_id: string
          vat_registered: boolean | null
        }
        Insert: {
          business_type: Database["public"]["Enums"]["business_type"]
          created_at?: string
          headcount?: number
          id?: string
          onboarding_completed?: boolean
          sector?: string | null
          trading_start_date?: string | null
          updated_at?: string
          user_id: string
          vat_registered?: boolean | null
        }
        Update: {
          business_type?: Database["public"]["Enums"]["business_type"]
          created_at?: string
          headcount?: number
          id?: string
          onboarding_completed?: boolean
          sector?: string | null
          trading_start_date?: string | null
          updated_at?: string
          user_id?: string
          vat_registered?: boolean | null
        }
        Relationships: []
      }
      compliance_domain_scores: {
        Row: {
          created_at: string
          domain_id: string
          id: string
          last_assessed_at: string
          status: Database["public"]["Enums"]["health_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          domain_id: string
          id?: string
          last_assessed_at?: string
          status?: Database["public"]["Enums"]["health_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          domain_id?: string
          id?: string
          last_assessed_at?: string
          status?: Database["public"]["Enums"]["health_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "compliance_domain_scores_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "compliance_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_domains: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order: number
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      concierge_stages: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          stage_number: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          stage_number: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          stage_number?: number
        }
        Relationships: []
      }
      concierge_tasks: {
        Row: {
          action_type: Database["public"]["Enums"]["action_type"]
          action_url: string | null
          applies_to: Json
          created_at: string
          description: string
          display_order: number
          domain_id: string | null
          id: string
          stage_id: string
          title: string
        }
        Insert: {
          action_type?: Database["public"]["Enums"]["action_type"]
          action_url?: string | null
          applies_to?: Json
          created_at?: string
          description: string
          display_order?: number
          domain_id?: string | null
          id?: string
          stage_id: string
          title: string
        }
        Update: {
          action_type?: Database["public"]["Enums"]["action_type"]
          action_url?: string | null
          applies_to?: Json
          created_at?: string
          description?: string
          display_order?: number
          domain_id?: string | null
          id?: string
          stage_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "concierge_tasks_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "compliance_domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concierge_tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "concierge_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          expiry_date: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          expiry_date?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          expiry_date?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_scores: {
        Row: {
          calculated_at: string
          created_at: string
          id: string
          overall_status: Database["public"]["Enums"]["health_status"]
          previous_status: Database["public"]["Enums"]["health_status"] | null
          user_id: string
        }
        Insert: {
          calculated_at?: string
          created_at?: string
          id?: string
          overall_status?: Database["public"]["Enums"]["health_status"]
          previous_status?: Database["public"]["Enums"]["health_status"] | null
          user_id: string
        }
        Update: {
          calculated_at?: string
          created_at?: string
          id?: string
          overall_status?: Database["public"]["Enums"]["health_status"]
          previous_status?: Database["public"]["Enums"]["health_status"] | null
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email_compliance: boolean
          email_statutory: boolean
          id: string
          monthly_digest: boolean
          push_enabled: boolean
          updated_at: string
          user_id: string
          weekly_digest: boolean
        }
        Insert: {
          created_at?: string
          email_compliance?: boolean
          email_statutory?: boolean
          id?: string
          monthly_digest?: boolean
          push_enabled?: boolean
          updated_at?: string
          user_id: string
          weekly_digest?: boolean
        }
        Update: {
          created_at?: string
          email_compliance?: boolean
          email_statutory?: boolean
          id?: string
          monthly_digest?: boolean
          push_enabled?: boolean
          updated_at?: string
          user_id?: string
          weekly_digest?: boolean
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          id: string
          plan_type: Database["public"]["Enums"]["plan_type"] | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          id?: string
          plan_type?: Database["public"]["Enums"]["plan_type"] | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_calendar: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          description: string | null
          domain_id: string | null
          due_date: string
          id: string
          source: string | null
          task_type: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain_id?: string | null
          due_date: string
          id?: string
          source?: string | null
          task_type?: Database["public"]["Enums"]["task_type"]
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          description?: string | null
          domain_id?: string | null
          due_date?: string
          id?: string
          source?: string | null
          task_type?: Database["public"]["Enums"]["task_type"]
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_calendar_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "compliance_domains"
            referencedColumns: ["id"]
          },
        ]
      }
      user_concierge_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          task_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          task_id: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_concierge_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "concierge_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_type:
        | "external_link"
        | "internal_workflow"
        | "mark_done"
        | "upload_document"
      business_type: "sole_trader" | "limited_company" | "partnership"
      document_category:
        | "formation"
        | "contracts"
        | "policies"
        | "insurance"
        | "tax_accounts"
        | "health_safety"
        | "training"
      health_status: "green" | "amber" | "red"
      message_role: "user" | "assistant"
      plan_type: "monthly" | "annual"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "unpaid"
      task_type:
        | "statutory_deadline"
        | "compliance_action"
        | "trigger_event"
        | "review_renewal"
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
