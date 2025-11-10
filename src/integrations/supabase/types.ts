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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      adoption_applications: {
        Row: {
          admin_notes: string | null
          experience: string | null
          has_children: boolean | null
          has_other_pets: boolean | null
          has_yard: boolean | null
          home_type: string | null
          id: string
          pet_id: string
          reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          experience?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          home_type?: string | null
          id?: string
          pet_id: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          experience?: string | null
          has_children?: boolean | null
          has_other_pets?: boolean | null
          has_yard?: boolean | null
          home_type?: string | null
          id?: string
          pet_id?: string
          reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "adoption_applications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number | null
          created_at: string | null
          donation_type: string
          id: string
          items: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          donation_type: string
          id?: string
          items?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          donation_type?: string
          id?: string
          items?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          notes: string | null
          pet_id: string
          record_type: string
          veterinarian: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          record_type: string
          veterinarian?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          record_type?: string
          veterinarian?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_feedback: {
        Row: {
          adoption_application_id: string
          comment: string
          created_at: string | null
          id: string
          pet_id: string
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          adoption_application_id: string
          comment: string
          created_at?: string | null
          id?: string
          pet_id: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          adoption_application_id?: string
          comment?: string
          created_at?: string | null
          id?: string
          pet_id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_feedback_adoption_application_id_fkey"
            columns: ["adoption_application_id"]
            isOneToOne: true
            referencedRelation: "adoption_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_feedback_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          age: number | null
          arrival_date: string | null
          breed: string | null
          color: string | null
          created_at: string | null
          description: string | null
          energy_level: string | null
          gender: string | null
          good_with_kids: boolean | null
          good_with_pets: boolean | null
          health_status: string | null
          id: string
          image_url: string | null
          name: string
          personality: string[] | null
          size: string | null
          spayed_neutered: boolean | null
          species: string
          status: string | null
          updated_at: string | null
          vaccination_status: string | null
        }
        Insert: {
          age?: number | null
          arrival_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          energy_level?: string | null
          gender?: string | null
          good_with_kids?: boolean | null
          good_with_pets?: boolean | null
          health_status?: string | null
          id?: string
          image_url?: string | null
          name: string
          personality?: string[] | null
          size?: string | null
          spayed_neutered?: boolean | null
          species: string
          status?: string | null
          updated_at?: string | null
          vaccination_status?: string | null
        }
        Update: {
          age?: number | null
          arrival_date?: string | null
          breed?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          energy_level?: string | null
          gender?: string | null
          good_with_kids?: boolean | null
          good_with_pets?: boolean | null
          health_status?: string | null
          id?: string
          image_url?: string | null
          name?: string
          personality?: string[] | null
          size?: string | null
          spayed_neutered?: boolean | null
          species?: string
          status?: string | null
          updated_at?: string | null
          vaccination_status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          pet_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pet_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pet_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vet_appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          id: string
          notes: string | null
          pet_id: string
          reason: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id: string
          reason: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          pet_id?: string
          reason?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vet_appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteers: {
        Row: {
          application_date: string | null
          approved_at: string | null
          approved_by: string | null
          availability: string[] | null
          experience: string | null
          id: string
          skills: string[] | null
          status: string | null
          user_id: string
        }
        Insert: {
          application_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability?: string[] | null
          experience?: string | null
          id?: string
          skills?: string[] | null
          status?: string | null
          user_id: string
        }
        Update: {
          application_date?: string | null
          approved_at?: string | null
          approved_by?: string | null
          availability?: string[] | null
          experience?: string | null
          id?: string
          skills?: string[] | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "user" | "admin" | "vet" | "volunteer"
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
      app_role: ["user", "admin", "vet", "volunteer"],
    },
  },
} as const
