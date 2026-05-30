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
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bodyweight_logs: {
        Row: {
          created_at: string
          id: number
          logged_at: string
          user_id: number
          weight: number
        }
        Insert: {
          created_at?: string
          id?: number
          logged_at: string
          user_id: number
          weight: number
        }
        Update: {
          created_at?: string
          id?: number
          logged_at?: string
          user_id?: number
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "bodyweight_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: number
          is_isometric: boolean
          is_weighted: boolean
          move_pattern: Database["public"]["Enums"]["movement_pattern"] | null
          name: string
          type: Database["public"]["Enums"]["exercise_type"]
          user_id: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_isometric?: boolean
          is_weighted?: boolean
          move_pattern?: Database["public"]["Enums"]["movement_pattern"] | null
          name: string
          type: Database["public"]["Enums"]["exercise_type"]
          user_id: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          is_isometric?: boolean
          is_weighted?: boolean
          move_pattern?: Database["public"]["Enums"]["movement_pattern"] | null
          name?: string
          type?: Database["public"]["Enums"]["exercise_type"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "exercises_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      macrocycles: {
        Row: {
          created_at: string
          id: number
          note: string | null
          title: string
          user_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          note?: string | null
          title: string
          user_id: number
        }
        Update: {
          created_at?: string
          id?: number
          note?: string | null
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "macrocycles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      mesocycles: {
        Row: {
          actual_end_date: string | null
          created_at: string
          deleted_at: string | null
          deload_week: number | null
          duration_weeks: number | null
          id: number
          macrocycle_id: number
          note: string | null
          routine_id: number
          start_date: string
          status: Database["public"]["Enums"]["cycle_status"]
          title: string
          user_id: number
        }
        Insert: {
          actual_end_date?: string | null
          created_at?: string
          deleted_at?: string | null
          deload_week?: number | null
          duration_weeks?: number | null
          id?: number
          macrocycle_id: number
          note?: string | null
          routine_id: number
          start_date: string
          status: Database["public"]["Enums"]["cycle_status"]
          title: string
          user_id: number
        }
        Update: {
          actual_end_date?: string | null
          created_at?: string
          deleted_at?: string | null
          deload_week?: number | null
          duration_weeks?: number | null
          id?: number
          macrocycle_id?: number
          note?: string | null
          routine_id?: number
          start_date?: string
          status?: Database["public"]["Enums"]["cycle_status"]
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "mesocycles_macrocycle_id_fkey"
            columns: ["macrocycle_id"]
            isOneToOne: false
            referencedRelation: "macrocycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mesocycles_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mesocycles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          achieved_at: string
          created_at: string
          id: number
          is_automatic: boolean
          note: string | null
          progression_id: number
          title: string
          user_id: number
        }
        Insert: {
          achieved_at: string
          created_at?: string
          id?: number
          is_automatic?: boolean
          note?: string | null
          progression_id: number
          title: string
          user_id: number
        }
        Update: {
          achieved_at?: string
          created_at?: string
          id?: number
          is_automatic?: boolean
          note?: string | null
          progression_id?: number
          title?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "milestones_progression_id_fkey"
            columns: ["progression_id"]
            isOneToOne: false
            referencedRelation: "progressions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      progressions: {
        Row: {
          created_at: string
          deleted_at: string | null
          exercise_id: number
          id: number
          name: string
          order: number
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          exercise_id: number
          id?: number
          name: string
          order: number
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          exercise_id?: number
          id?: number
          name?: string
          order?: number
        }
        Relationships: [
          {
            foreignKeyName: "progressions_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_days: {
        Row: {
          code: string | null
          created_at: string
          deleted_at: string | null
          id: number
          name: string
          routine_id: number
        }
        Insert: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          name: string
          routine_id: number
        }
        Update: {
          code?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: number
          name?: string
          routine_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "routine_days_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "routines"
            referencedColumns: ["id"]
          },
        ]
      }
      routine_schedules: {
        Row: {
          created_at: string
          id: number
          routineday_id: number
          week_number: number
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Insert: {
          created_at?: string
          id?: number
          routineday_id: number
          week_number: number
          weekday: Database["public"]["Enums"]["weekday"]
        }
        Update: {
          created_at?: string
          id?: number
          routineday_id?: number
          week_number?: number
          weekday?: Database["public"]["Enums"]["weekday"]
        }
        Relationships: [
          {
            foreignKeyName: "routine_schedules_routineday_id_fkey"
            columns: ["routineday_id"]
            isOneToOne: false
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
        ]
      }
      routineday_exercises: {
        Row: {
          created_at: string
          deleted_at: string | null
          exercise_id: number
          id: number
          note: string | null
          order: number
          rep_goal_high: number | null
          rep_goal_low: number | null
          routineday_id: number
          set_goal_high: number | null
          set_goal_low: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          exercise_id: number
          id?: number
          note?: string | null
          order: number
          rep_goal_high?: number | null
          rep_goal_low?: number | null
          routineday_id: number
          set_goal_high?: number | null
          set_goal_low?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          exercise_id?: number
          id?: number
          note?: string | null
          order?: number
          rep_goal_high?: number | null
          rep_goal_low?: number | null
          routineday_id?: number
          set_goal_high?: number | null
          set_goal_low?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "routineday_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routineday_exercises_routineday_id_fkey"
            columns: ["routineday_id"]
            isOneToOne: false
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
        ]
      }
      routines: {
        Row: {
          colour_hex: string | null
          created_at: string
          deleted_at: string | null
          description: string | null
          id: number
          name: string
          schedule_weeks: number
          status: Database["public"]["Enums"]["routine_status"]
          user_id: number
        }
        Insert: {
          colour_hex?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name: string
          schedule_weeks?: number
          status: Database["public"]["Enums"]["routine_status"]
          user_id: number
        }
        Update: {
          colour_hex?: string | null
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: number
          name?: string
          schedule_weeks?: number
          status?: Database["public"]["Enums"]["routine_status"]
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "routines_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: number
          uuid: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          uuid: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          uuid?: string
        }
        Relationships: []
      }
      workout_exercises: {
        Row: {
          created_at: string
          exercise_id: number
          id: number
          is_unplanned: boolean
          order: number
          routineday_exercise_id: number | null
          workout_id: number
        }
        Insert: {
          created_at?: string
          exercise_id: number
          id?: number
          is_unplanned?: boolean
          order: number
          routineday_exercise_id?: number | null
          workout_id: number
        }
        Update: {
          created_at?: string
          exercise_id?: number
          id?: number
          is_unplanned?: boolean
          order?: number
          routineday_exercise_id?: number | null
          workout_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_routineday_exercise_id_fkey"
            columns: ["routineday_exercise_id"]
            isOneToOne: false
            referencedRelation: "routineday_exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_exercises_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_sets: {
        Row: {
          created_at: string
          id: number
          logged_progression_name: string
          order: number
          progression_id: number
          reps: number
          weight: number | null
          workout_exercise_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          logged_progression_name: string
          order: number
          progression_id: number
          reps: number
          weight?: number | null
          workout_exercise_id: number
        }
        Update: {
          created_at?: string
          id?: number
          logged_progression_name?: string
          order?: number
          progression_id?: number
          reps?: number
          weight?: number | null
          workout_exercise_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workout_sets_progression_id_fkey"
            columns: ["progression_id"]
            isOneToOne: false
            referencedRelation: "progressions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_sets_workout_exercise_id_fkey"
            columns: ["workout_exercise_id"]
            isOneToOne: false
            referencedRelation: "workout_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      workouts: {
        Row: {
          created_at: string
          cycle_week: number
          date: string
          id: number
          mesocycle_id: number
          note: string | null
          routineday_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          cycle_week: number
          date: string
          id?: number
          mesocycle_id: number
          note?: string | null
          routineday_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          cycle_week?: number
          date?: string
          id?: number
          mesocycle_id?: number
          note?: string | null
          routineday_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workouts_mesocycle_id_fkey"
            columns: ["mesocycle_id"]
            isOneToOne: false
            referencedRelation: "mesocycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_routineday_id_fkey"
            columns: ["routineday_id"]
            isOneToOne: false
            referencedRelation: "routine_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workouts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_user_id: { Args: never; Returns: number }
    }
    Enums: {
      cycle_status: "active" | "completed" | "planned" | "abandoned"
      exercise_type: "bodyweight" | "freeweight" | "machine"
      movement_pattern: "push" | "pull" | "leg" | "core"
      routine_status: "active" | "draft" | "archived"
      weekday:
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
        | "sunday"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      cycle_status: ["active", "completed", "planned", "abandoned"],
      exercise_type: ["bodyweight", "freeweight", "machine"],
      movement_pattern: ["push", "pull", "leg", "core"],
      routine_status: ["active", "draft", "archived"],
      weekday: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
    },
  },
} as const
