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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          activity_category: string | null
          admin_id: string
          created_at: string
          details: Json | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          target_id: string | null
          target_type: string | null
          user_agent: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          activity_category?: string | null
          admin_id: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          activity_category?: string | null
          admin_id?: string
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      admin_preferences: {
        Row: {
          created_at: string
          id: string
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      advertisements: {
        Row: {
          click_url: string | null
          clicks: number | null
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          image_url: string
          impressions: number | null
          is_active: boolean | null
          start_date: string
          title: string
        }
        Insert: {
          click_url?: string | null
          clicks?: number | null
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          image_url: string
          impressions?: number | null
          is_active?: boolean | null
          start_date: string
          title: string
        }
        Update: {
          click_url?: string | null
          clicks?: number | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          image_url?: string
          impressions?: number | null
          is_active?: boolean | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      athlete_profiles: {
        Row: {
          act_score: number | null
          athletic_stats: Json | null
          created_at: string
          gpa: number | null
          graduation_year: number | null
          height: string | null
          highlight_reel_url: string | null
          id: string
          position: string | null
          sat_score: number | null
          sport: string
          updated_at: string
          user_id: string
          weight: string | null
        }
        Insert: {
          act_score?: number | null
          athletic_stats?: Json | null
          created_at?: string
          gpa?: number | null
          graduation_year?: number | null
          height?: string | null
          highlight_reel_url?: string | null
          id?: string
          position?: string | null
          sat_score?: number | null
          sport: string
          updated_at?: string
          user_id: string
          weight?: string | null
        }
        Update: {
          act_score?: number | null
          athletic_stats?: Json | null
          created_at?: string
          gpa?: number | null
          graduation_year?: number | null
          height?: string | null
          highlight_reel_url?: string | null
          id?: string
          position?: string | null
          sat_score?: number | null
          sport?: string
          updated_at?: string
          user_id?: string
          weight?: string | null
        }
        Relationships: []
      }
      athletic_achievements: {
        Row: {
          achievement_date: string | null
          achievement_type: string
          certificate_url: string | null
          created_at: string
          description: string | null
          id: string
          organization: string | null
          sport: string
          title: string
          user_id: string
        }
        Insert: {
          achievement_date?: string | null
          achievement_type: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          sport: string
          title: string
          user_id: string
        }
        Update: {
          achievement_date?: string | null
          achievement_type?: string
          certificate_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          organization?: string | null
          sport?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      coach_applications: {
        Row: {
          admin_notes: string | null
          created_at: string
          experience: string
          hbcu_name: string
          id: string
          motivation: string
          qualifications: string | null
          status: string
          team_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          experience: string
          hbcu_name: string
          id?: string
          motivation: string
          qualifications?: string | null
          status?: string
          team_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          experience?: string
          hbcu_name?: string
          id?: string
          motivation?: string
          qualifications?: string | null
          status?: string
          team_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      college_connections: {
        Row: {
          athlete_user_id: string
          coach_email: string | null
          coach_name: string | null
          coach_phone: string | null
          college_name: string
          contact_date: string | null
          created_at: string
          id: string
          interest_level: string | null
          notes: string | null
          sport: string
          status: string | null
          updated_at: string
        }
        Insert: {
          athlete_user_id: string
          coach_email?: string | null
          coach_name?: string | null
          coach_phone?: string | null
          college_name: string
          contact_date?: string | null
          created_at?: string
          id?: string
          interest_level?: string | null
          notes?: string | null
          sport: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          athlete_user_id?: string
          coach_email?: string | null
          coach_name?: string | null
          coach_phone?: string | null
          college_name?: string
          contact_date?: string | null
          created_at?: string
          id?: string
          interest_level?: string | null
          notes?: string | null
          sport?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          accused_team_id: string
          created_at: string
          description: string
          evidence_url: string | null
          id: string
          reporting_team_id: string
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          tournament_id: string
        }
        Insert: {
          accused_team_id: string
          created_at?: string
          description: string
          evidence_url?: string | null
          id?: string
          reporting_team_id: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          tournament_id: string
        }
        Update: {
          accused_team_id?: string
          created_at?: string
          description?: string
          evidence_url?: string | null
          id?: string
          reporting_team_id?: string
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          tournament_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_accused_team_id_fkey"
            columns: ["accused_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_reporting_team_id_fkey"
            columns: ["reporting_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      match_results: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          match_type: string
          scheduled_at: string
          status: string
          team_1_id: string | null
          team_1_score: number | null
          team_2_id: string | null
          team_2_score: number | null
          tournament_id: string | null
          updated_at: string
          winner_team_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_type?: string
          scheduled_at: string
          status?: string
          team_1_id?: string | null
          team_1_score?: number | null
          team_2_id?: string | null
          team_2_score?: number | null
          tournament_id?: string | null
          updated_at?: string
          winner_team_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          match_type?: string
          scheduled_at?: string
          status?: string
          team_1_id?: string | null
          team_1_score?: number | null
          team_2_id?: string | null
          team_2_score?: number | null
          tournament_id?: string | null
          updated_at?: string
          winner_team_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "match_results_team_1_id_fkey"
            columns: ["team_1_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_team_2_id_fkey"
            columns: ["team_2_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_results_winner_team_id_fkey"
            columns: ["winner_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      movement_tutors: {
        Row: {
          availability: Json | null
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          created_at: string
          display_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean | null
          specializations: string[] | null
          updated_at: string
          user_id: string | null
          years_experience: number | null
        }
        Insert: {
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          display_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Update: {
          availability?: Json | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          created_at?: string
          display_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean | null
          specializations?: string[] | null
          updated_at?: string
          user_id?: string | null
          years_experience?: number | null
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_usd: number
          amount_xp: number
          conversion_rate: number
          created_at: string
          id: string
          processed_at: string | null
          processed_by: string | null
          status: string | null
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount_usd: number
          amount_xp: number
          conversion_rate: number
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount_usd?: number
          amount_xp?: number
          conversion_rate?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      player_achievements: {
        Row: {
          achievement_type: string
          created_at: string
          description: string | null
          earned_at: string
          icon: string | null
          id: string
          metadata: Json | null
          title: string
          tournament_id: string | null
          user_id: string
        }
        Insert: {
          achievement_type: string
          created_at?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          title: string
          tournament_id?: string | null
          user_id: string
        }
        Update: {
          achievement_type?: string
          created_at?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          tournament_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "player_achievements_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_sessions: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          duration_minutes: number
          id: string
          location: string | null
          scheduled_at: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          scheduled_at: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          location?: string | null
          scheduled_at?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_sessions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "practice_sessions_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          ban_reason: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          hbcu_name: string | null
          id: string
          is_banned: boolean | null
          is_online: boolean | null
          last_seen: string | null
          role_selection_completed: boolean | null
          updated_at: string
          user_id: string
          xp_balance: number | null
        }
        Insert: {
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          hbcu_name?: string | null
          id?: string
          is_banned?: boolean | null
          is_online?: boolean | null
          last_seen?: string | null
          role_selection_completed?: boolean | null
          updated_at?: string
          user_id: string
          xp_balance?: number | null
        }
        Update: {
          avatar_url?: string | null
          ban_reason?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          hbcu_name?: string | null
          id?: string
          is_banned?: boolean | null
          is_online?: boolean | null
          last_seen?: string | null
          role_selection_completed?: boolean | null
          updated_at?: string
          user_id?: string
          xp_balance?: number | null
        }
        Relationships: []
      }
      recruitment_events: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          event_type: string
          id: string
          is_virtual: boolean | null
          location: string | null
          max_participants: number | null
          registration_deadline: string | null
          scheduled_at: string
          sport: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          scheduled_at: string
          sport?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          event_type?: string
          id?: string
          is_virtual?: boolean | null
          location?: string | null
          max_participants?: number | null
          registration_deadline?: string | null
          scheduled_at?: string
          sport?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seasonal_passes: {
        Row: {
          created_at: string
          current_level: number | null
          current_xp: number | null
          id: string
          is_premium: boolean | null
          purchased_at: string | null
          season_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number | null
          current_xp?: number | null
          id?: string
          is_premium?: boolean | null
          purchased_at?: string | null
          season_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number | null
          current_xp?: number | null
          id?: string
          is_premium?: boolean | null
          purchased_at?: string | null
          season_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shop_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_limited: boolean | null
          name: string
          price_usd: number | null
          price_xp: number | null
          rarity: Database["public"]["Enums"]["item_rarity"] | null
          stock_quantity: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name: string
          price_usd?: number | null
          price_xp?: number | null
          rarity?: Database["public"]["Enums"]["item_rarity"] | null
          stock_quantity?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_limited?: boolean | null
          name?: string
          price_usd?: number | null
          price_xp?: number | null
          rarity?: Database["public"]["Enums"]["item_rarity"] | null
          stock_quantity?: number | null
        }
        Relationships: []
      }
      team_chat_messages: {
        Row: {
          created_at: string
          id: string
          is_announcement: boolean
          message: string
          message_type: string
          sender_id: string
          team_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_announcement?: boolean
          message: string
          message_type?: string
          sender_id: string
          team_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_announcement?: boolean
          message?: string
          message_type?: string
          sender_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_chat_messages_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          invited_by: string
          invited_user_id: string
          message: string | null
          responded_at: string | null
          status: string
          team_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          invited_by: string
          invited_user_id: string
          message?: string | null
          responded_at?: string | null
          status?: string
          team_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          invited_by?: string
          invited_user_id?: string
          message?: string | null
          responded_at?: string | null
          status?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_invites_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          is_active: boolean
          joined_at: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          is_active?: boolean
          joined_at?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      team_notes: {
        Row: {
          content: string
          created_at: string
          created_by: string
          file_url: string | null
          id: string
          note_type: string
          team_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          file_url?: string | null
          id?: string
          note_type?: string
          team_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          file_url?: string | null
          id?: string
          note_type?: string
          team_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "team_notes_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          captain_id: string
          created_at: string
          hbcu_name: string
          id: string
          losses: number | null
          name: string
          team_xp: number | null
          tournament_id: string | null
          updated_at: string
          wins: number | null
        }
        Insert: {
          captain_id: string
          created_at?: string
          hbcu_name: string
          id?: string
          losses?: number | null
          name: string
          team_xp?: number | null
          tournament_id?: string | null
          updated_at?: string
          wins?: number | null
        }
        Update: {
          captain_id?: string
          created_at?: string
          hbcu_name?: string
          id?: string
          losses?: number | null
          name?: string
          team_xp?: number | null
          tournament_id?: string | null
          updated_at?: string
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "teams_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          entry_fee_xp: number | null
          game_title: string
          id: string
          max_teams: number | null
          name: string
          prize_pool_xp: number | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          entry_fee_xp?: number | null
          game_title: string
          id?: string
          max_teams?: number | null
          name: string
          prize_pool_xp?: number | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          entry_fee_xp?: number | null
          game_title?: string
          id?: string
          max_teams?: number | null
          name?: string
          prize_pool_xp?: number | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tutor_reviews: {
        Row: {
          communication_rating: number | null
          created_at: string
          effectiveness_rating: number | null
          id: string
          moderated_at: string | null
          moderated_by: string | null
          parent_user_id: string
          punctuality_rating: number | null
          rating: number
          review_text: string | null
          status: string
          student_name: string | null
          tutor_id: string
          updated_at: string
        }
        Insert: {
          communication_rating?: number | null
          created_at?: string
          effectiveness_rating?: number | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          parent_user_id: string
          punctuality_rating?: number | null
          rating: number
          review_text?: string | null
          status?: string
          student_name?: string | null
          tutor_id: string
          updated_at?: string
        }
        Update: {
          communication_rating?: number | null
          created_at?: string
          effectiveness_rating?: number | null
          id?: string
          moderated_at?: string | null
          moderated_by?: string | null
          parent_user_id?: string
          punctuality_rating?: number | null
          rating?: number
          review_text?: string | null
          status?: string
          student_name?: string | null
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_reviews_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "movement_tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      tutor_sessions: {
        Row: {
          created_at: string
          duration_minutes: number
          id: string
          notes: string | null
          parent_user_id: string | null
          scheduled_at: string
          session_type: string
          status: string
          student_user_id: string
          tutor_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          parent_user_id?: string | null
          scheduled_at: string
          session_type: string
          status?: string
          student_user_id: string
          tutor_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number
          id?: string
          notes?: string | null
          parent_user_id?: string | null
          scheduled_at?: string
          session_type?: string
          status?: string
          student_user_id?: string
          tutor_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tutor_sessions_tutor_id_fkey"
            columns: ["tutor_id"]
            isOneToOne: false
            referencedRelation: "movement_tutors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_purchases: {
        Row: {
          created_at: string
          id: string
          item_id: string | null
          purchase_type: string
          quantity: number | null
          stripe_payment_id: string | null
          total_cost_usd: number | null
          total_cost_xp: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id?: string | null
          purchase_type: string
          quantity?: number | null
          stripe_payment_id?: string | null
          total_cost_usd?: number | null
          total_cost_xp?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string | null
          purchase_type?: string
          quantity?: number | null
          stripe_payment_id?: string | null
          total_cost_usd?: number | null
          total_cost_xp?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_purchases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_roles_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string
          id: string
          notification_browser: boolean | null
          notification_email: boolean | null
          preferred_language: string | null
          privacy_profile: string | null
          theme_preference: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_browser?: boolean | null
          notification_email?: boolean | null
          preferred_language?: string | null
          privacy_profile?: string | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_browser?: boolean | null
          notification_email?: boolean | null
          preferred_language?: string | null
          privacy_profile?: string | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wellness_progress: {
        Row: {
          activity_type: string
          created_at: string
          goal_value: number | null
          id: string
          notes: string | null
          progress_value: number
          recorded_at: string
          unit: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          goal_value?: number | null
          id?: string
          notes?: string | null
          progress_value: number
          recorded_at?: string
          unit?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          goal_value?: number | null
          id?: string
          notes?: string | null
          progress_value?: number
          recorded_at?: string
          unit?: string | null
          user_id?: string
        }
        Relationships: []
      }
      workshop_attendance: {
        Row: {
          attendance_date: string | null
          attended: boolean | null
          completion_certificate_url: string | null
          event_id: string
          id: string
          notes: string | null
          registration_date: string
          user_id: string
        }
        Insert: {
          attendance_date?: string | null
          attended?: boolean | null
          completion_certificate_url?: string | null
          event_id: string
          id?: string
          notes?: string | null
          registration_date?: string
          user_id: string
        }
        Update: {
          attendance_date?: string | null
          attended?: boolean | null
          completion_certificate_url?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          registration_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshop_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "recruitment_events"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_database_error: {
        Args: {
          error_context?: string
          error_message: string
          user_id_param?: string
        }
        Returns: undefined
      }
      log_user_activity: {
        Args: {
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_target_id?: string
          p_target_type?: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      update_user_roles: {
        Args: { _role_type: string; _user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "coach" | "player"
      item_rarity: "common" | "rare" | "epic" | "legendary"
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
      app_role: ["admin", "coach", "player"],
      item_rarity: ["common", "rare", "epic", "legendary"],
    },
  },
} as const
