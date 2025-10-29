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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          metadata?: Json | null
          target_id?: string | null
          target_type?: string | null
          user_agent?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      admin_audit_logs: {
        Row: {
          action: string
          admin_user_id: string
          created_at: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          target_id: string | null
          target_table: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string
          created_at?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          target_id?: string | null
          target_table?: string | null
          user_agent?: string | null
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
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          last_activity: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          ip_address?: unknown
          last_activity?: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          last_activity?: string
          session_token?: string
          user_agent?: string | null
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
      ai_search_queries: {
        Row: {
          actions_taken: Json | null
          created_at: string | null
          id: string
          parsed_filters: Json | null
          query_text: string
          results_count: number | null
          search_duration_ms: number | null
          user_id: string | null
        }
        Insert: {
          actions_taken?: Json | null
          created_at?: string | null
          id?: string
          parsed_filters?: Json | null
          query_text: string
          results_count?: number | null
          search_duration_ms?: number | null
          user_id?: string | null
        }
        Update: {
          actions_taken?: Json | null
          created_at?: string | null
          id?: string
          parsed_filters?: Json | null
          query_text?: string
          results_count?: number | null
          search_duration_ms?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics_summary: {
        Row: {
          active_campaigns: number | null
          active_crm_contacts: number | null
          active_employees: number | null
          created_at: string | null
          id: string
          messages_sent_today: number | null
          messages_sent_week: number | null
          metadata: Json | null
          outreach_success_rate: number | null
          pending_hr_tasks: number | null
          summary_date: string
          top_performing_staff: Json | null
          total_crm_contacts: number | null
          total_employees: number | null
          updated_at: string | null
        }
        Insert: {
          active_campaigns?: number | null
          active_crm_contacts?: number | null
          active_employees?: number | null
          created_at?: string | null
          id?: string
          messages_sent_today?: number | null
          messages_sent_week?: number | null
          metadata?: Json | null
          outreach_success_rate?: number | null
          pending_hr_tasks?: number | null
          summary_date: string
          top_performing_staff?: Json | null
          total_crm_contacts?: number | null
          total_employees?: number | null
          updated_at?: string | null
        }
        Update: {
          active_campaigns?: number | null
          active_crm_contacts?: number | null
          active_employees?: number | null
          created_at?: string | null
          id?: string
          messages_sent_today?: number | null
          messages_sent_week?: number | null
          metadata?: Json | null
          outreach_success_rate?: number | null
          pending_hr_tasks?: number | null
          summary_date?: string
          top_performing_staff?: Json | null
          total_crm_contacts?: number | null
          total_employees?: number | null
          updated_at?: string | null
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
      booklet_downloads: {
        Row: {
          booklet_id: string
          downloaded_at: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          booklet_id: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          booklet_id?: string
          downloaded_at?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booklet_downloads_booklet_id_fkey"
            columns: ["booklet_id"]
            isOneToOne: false
            referencedRelation: "scholarship_booklets"
            referencedColumns: ["id"]
          },
        ]
      }
      booklet_scholarships: {
        Row: {
          booklet_id: string
          created_at: string
          display_order: number | null
          id: string
          page_number: number | null
          scholarship_id: string
        }
        Insert: {
          booklet_id: string
          created_at?: string
          display_order?: number | null
          id?: string
          page_number?: number | null
          scholarship_id: string
        }
        Update: {
          booklet_id?: string
          created_at?: string
          display_order?: number | null
          id?: string
          page_number?: number | null
          scholarship_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booklet_scholarships_booklet_id_fkey"
            columns: ["booklet_id"]
            isOneToOne: false
            referencedRelation: "scholarship_booklets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booklet_scholarships_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarship_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      booth_check_ins: {
        Row: {
          booth_id: string
          check_in_method: string | null
          check_in_time: string
          event_id: string
          id: string
          metadata: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          booth_id: string
          check_in_method?: string | null
          check_in_time?: string
          event_id: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          booth_id?: string
          check_in_method?: string | null
          check_in_time?: string
          event_id?: string
          id?: string
          metadata?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booth_check_ins_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booth_check_ins_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      booth_presets: {
        Row: {
          created_at: string | null
          display_order: number | null
          event_id: string | null
          id: string
          is_active: boolean | null
          preset_type: string
          preset_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          preset_type: string
          preset_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          event_id?: string | null
          id?: string
          is_active?: boolean | null
          preset_type?: string
          preset_value?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booth_presets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      booths: {
        Row: {
          booth_depth: number | null
          booth_width: number | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          event_id: string
          floor_number: number | null
          floor_plan_id: string | null
          grid_col: number | null
          grid_row: number | null
          id: string
          is_featured: boolean | null
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          offers_on_spot_admission: boolean | null
          org_name: string
          org_type: string | null
          scholarship_info: string | null
          sponsor_id: string | null
          sponsor_tier: string | null
          stage_description: string | null
          table_no: string | null
          updated_at: string | null
          venue_id: string | null
          waives_application_fee: boolean | null
          website_url: string | null
          x_position: number | null
          y_position: number | null
          zone: string | null
        }
        Insert: {
          booth_depth?: number | null
          booth_width?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          event_id: string
          floor_number?: number | null
          floor_plan_id?: string | null
          grid_col?: number | null
          grid_row?: number | null
          id?: string
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          offers_on_spot_admission?: boolean | null
          org_name: string
          org_type?: string | null
          scholarship_info?: string | null
          sponsor_id?: string | null
          sponsor_tier?: string | null
          stage_description?: string | null
          table_no?: string | null
          updated_at?: string | null
          venue_id?: string | null
          waives_application_fee?: boolean | null
          website_url?: string | null
          x_position?: number | null
          y_position?: number | null
          zone?: string | null
        }
        Update: {
          booth_depth?: number | null
          booth_width?: number | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          event_id?: string
          floor_number?: number | null
          floor_plan_id?: string | null
          grid_col?: number | null
          grid_row?: number | null
          id?: string
          is_featured?: boolean | null
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          offers_on_spot_admission?: boolean | null
          org_name?: string
          org_type?: string | null
          scholarship_info?: string | null
          sponsor_id?: string | null
          sponsor_tier?: string | null
          stage_description?: string | null
          table_no?: string | null
          updated_at?: string | null
          venue_id?: string | null
          waives_application_fee?: boolean | null
          website_url?: string | null
          x_position?: number | null
          y_position?: number | null
          zone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booths_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booths_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booths_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booths_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      bulk_campaigns: {
        Row: {
          campaign_name: string
          campaign_type: string
          clicked_count: number | null
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          delivered_count: number | null
          failed_count: number | null
          id: string
          opened_count: number | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_count: number | null
          started_at: string | null
          status: string | null
          target_audience: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_name: string
          campaign_type: string
          clicked_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          target_audience?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_name?: string
          campaign_type?: string
          clicked_count?: number | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          delivered_count?: number | null
          failed_count?: number | null
          id?: string
          opened_count?: number | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_count?: number | null
          started_at?: string | null
          status?: string | null
          target_audience?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bulk_campaigns_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      career_profiles: {
        Row: {
          availability_date: string | null
          career_goals: string | null
          career_interests: string[] | null
          created_at: string
          education_level: string | null
          geographic_preferences: string[] | null
          id: string
          industry_preferences: string[] | null
          is_seeking_fulltime: boolean | null
          is_seeking_internship: boolean | null
          linkedin_url: string | null
          portfolio_url: string | null
          resume_url: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability_date?: string | null
          career_goals?: string | null
          career_interests?: string[] | null
          created_at?: string
          education_level?: string | null
          geographic_preferences?: string[] | null
          id?: string
          industry_preferences?: string[] | null
          is_seeking_fulltime?: boolean | null
          is_seeking_internship?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability_date?: string | null
          career_goals?: string | null
          career_interests?: string[] | null
          created_at?: string
          education_level?: string | null
          geographic_preferences?: string[] | null
          id?: string
          industry_preferences?: string[] | null
          is_seeking_fulltime?: boolean | null
          is_seeking_internship?: boolean | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          resume_url?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      career_resources: {
        Row: {
          category: string
          content_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          estimated_time_minutes: number | null
          id: string
          is_featured: boolean | null
          resource_type: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          resource_type?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          selected_color: string | null
          selected_size: string | null
          session_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          session_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
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
      college_prep_resources: {
        Row: {
          category: string
          content_url: string | null
          created_at: string
          created_by: string | null
          description: string | null
          difficulty_level: string | null
          estimated_time_minutes: number | null
          file_url: string | null
          id: string
          is_featured: boolean | null
          resource_type: string
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          category: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          resource_type: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content_url?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_time_minutes?: number | null
          file_url?: string | null
          id?: string
          is_featured?: boolean | null
          resource_type?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      counties: {
        Row: {
          cities: string[]
          county_name: string
          created_at: string | null
          id: string
          latitude: number | null
          longitude: number | null
          population: number | null
          state_code: string
          state_name: string
          updated_at: string | null
        }
        Insert: {
          cities?: string[]
          county_name: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          population?: number | null
          state_code: string
          state_name: string
          updated_at?: string | null
        }
        Update: {
          cities?: string[]
          county_name?: string
          created_at?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          population?: number | null
          state_code?: string
          state_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      crm_contacts: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          first_name: string
          id: string
          last_contact_date: string | null
          last_name: string
          notes: string | null
          organization_id: string | null
          phone: string | null
          position: string | null
          preferred_contact_method: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_contact_date?: string | null
          last_name: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_contact_date?: string | null
          last_name?: string
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          position?: string | null
          preferred_contact_method?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_interactions: {
        Row: {
          contact_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          interaction_date: string
          interaction_type: string
          notes: string | null
          organization_id: string | null
          outcome: string | null
          subject: string | null
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          interaction_date: string
          interaction_type: string
          notes?: string | null
          organization_id?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          interaction_date?: string
          interaction_type?: string
          notes?: string | null
          organization_id?: string | null
          outcome?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_organizations: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          industry: string | null
          metadata: Json | null
          name: string
          notes: string | null
          organization_type: string | null
          partnership_status: string | null
          partnership_tier: string | null
          phone: string | null
          region: string | null
          source: string | null
          state: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name: string
          notes?: string | null
          organization_type?: string | null
          partnership_status?: string | null
          partnership_tier?: string | null
          phone?: string | null
          region?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          industry?: string | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          organization_type?: string | null
          partnership_status?: string | null
          partnership_tier?: string | null
          phone?: string | null
          region?: string | null
          source?: string | null
          state?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      crm_tags: {
        Row: {
          contact_id: string | null
          created_at: string | null
          id: string
          organization_id: string | null
          tag_category: string | null
          tag_name: string
        }
        Insert: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          tag_category?: string | null
          tag_name: string
        }
        Update: {
          contact_id?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          tag_category?: string | null
          tag_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_tags_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_tags_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "crm_organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          updated_at?: string | null
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
      donor_information: {
        Row: {
          created_at: string
          donation_start_date: string
          donor_email: string
          donor_name: string
          donor_type: string | null
          id: string
          is_active: boolean | null
          last_donation_date: string | null
          monthly_amount: number
          next_billing_date: string | null
          public_recognition: boolean | null
          recognition_level: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          total_contributed: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          donation_start_date: string
          donor_email: string
          donor_name: string
          donor_type?: string | null
          id?: string
          is_active?: boolean | null
          last_donation_date?: string | null
          monthly_amount: number
          next_billing_date?: string | null
          public_recognition?: boolean | null
          recognition_level?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_contributed?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          donation_start_date?: string
          donor_email?: string
          donor_name?: string
          donor_type?: string | null
          id?: string
          is_active?: boolean | null
          last_donation_date?: string | null
          monthly_amount?: number
          next_billing_date?: string | null
          public_recognition?: boolean | null
          recognition_level?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_contributed?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      employee_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string
          employee_id: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          notes: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type: string
          employee_id: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string
          employee_id?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          notes?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          department_id: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employment_type: string | null
          end_date: string | null
          first_name: string
          id: string
          last_name: string
          notes: string | null
          phone: string | null
          role: string
          start_date: string
          state: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_type?: string | null
          end_date?: string | null
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          phone?: string | null
          role: string
          start_date: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_type?: string | null
          end_date?: string | null
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          phone?: string | null
          role?: string
          start_date?: string
          state?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          attendance_date: string | null
          attended: boolean | null
          check_in_method: string | null
          colleges_visited: string[] | null
          created_at: string
          event_id: string
          feedback_rating: number | null
          feedback_text: string | null
          id: string
          registration_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attendance_date?: string | null
          attended?: boolean | null
          check_in_method?: string | null
          colleges_visited?: string[] | null
          created_at?: string
          event_id: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attendance_date?: string | null
          attended?: boolean | null
          check_in_method?: string | null
          colleges_visited?: string[] | null
          created_at?: string
          event_id?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: string
          registration_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "expo_events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_tags: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          tag_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          tag_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_tags_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          activities: Json | null
          attendee_count: number | null
          audience: string[] | null
          capacity: number | null
          category: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          discord_link: string | null
          end_at: string
          event_flyer_url: string | null
          event_type: string
          highlights: Json | null
          id: string
          image_url: string | null
          is_virtual: boolean | null
          legacy_expo_event_id: string | null
          max_attendees: number | null
          nft_contract_address: string | null
          registration_deadline: string | null
          registration_required: boolean | null
          registration_url: string | null
          requires_wallet: boolean | null
          schedule: Json | null
          start_at: string
          status: string | null
          title: string
          updated_at: string | null
          venue_id: string | null
          virtual_link: string | null
        }
        Insert: {
          activities?: Json | null
          attendee_count?: number | null
          audience?: string[] | null
          capacity?: number | null
          category?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discord_link?: string | null
          end_at: string
          event_flyer_url?: string | null
          event_type?: string
          highlights?: Json | null
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          legacy_expo_event_id?: string | null
          max_attendees?: number | null
          nft_contract_address?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          registration_url?: string | null
          requires_wallet?: boolean | null
          schedule?: Json | null
          start_at: string
          status?: string | null
          title: string
          updated_at?: string | null
          venue_id?: string | null
          virtual_link?: string | null
        }
        Update: {
          activities?: Json | null
          attendee_count?: number | null
          audience?: string[] | null
          capacity?: number | null
          category?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          discord_link?: string | null
          end_at?: string
          event_flyer_url?: string | null
          event_type?: string
          highlights?: Json | null
          id?: string
          image_url?: string | null
          is_virtual?: boolean | null
          legacy_expo_event_id?: string | null
          max_attendees?: number | null
          nft_contract_address?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          registration_url?: string | null
          requires_wallet?: boolean | null
          schedule?: Json | null
          start_at?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          venue_id?: string | null
          virtual_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_legacy_expo_event_id_fkey"
            columns: ["legacy_expo_event_id"]
            isOneToOne: false
            referencedRelation: "expo_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      expo_events: {
        Row: {
          accessibility_info: string | null
          activities: Json | null
          address: string
          admission_fee: string | null
          attendee_count: number | null
          city: string
          colleges_attended: string[] | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          created_by: string | null
          description: string | null
          discord_link: string | null
          end_date: string | null
          event_date: string
          event_flyer_url: string | null
          event_photos: string[] | null
          event_recap: string | null
          event_type: string
          featured_colleges: string[] | null
          id: string
          is_featured: boolean | null
          is_virtual: boolean | null
          latitude: number | null
          location_name: string
          longitude: number | null
          max_attendees: number | null
          parking_info: string | null
          prize_pool: string | null
          registration_deadline: string | null
          registration_link: string | null
          registration_required: boolean | null
          schedule: Json | null
          state: string
          status: string | null
          title: string
          updated_at: string
          virtual_link: string | null
          zip_code: string | null
        }
        Insert: {
          accessibility_info?: string | null
          activities?: Json | null
          address: string
          admission_fee?: string | null
          attendee_count?: number | null
          city: string
          colleges_attended?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discord_link?: string | null
          end_date?: string | null
          event_date: string
          event_flyer_url?: string | null
          event_photos?: string[] | null
          event_recap?: string | null
          event_type?: string
          featured_colleges?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_virtual?: boolean | null
          latitude?: number | null
          location_name: string
          longitude?: number | null
          max_attendees?: number | null
          parking_info?: string | null
          prize_pool?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          schedule?: Json | null
          state: string
          status?: string | null
          title: string
          updated_at?: string
          virtual_link?: string | null
          zip_code?: string | null
        }
        Update: {
          accessibility_info?: string | null
          activities?: Json | null
          address?: string
          admission_fee?: string | null
          attendee_count?: number | null
          city?: string
          colleges_attended?: string[] | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          discord_link?: string | null
          end_date?: string | null
          event_date?: string
          event_flyer_url?: string | null
          event_photos?: string[] | null
          event_recap?: string | null
          event_type?: string
          featured_colleges?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_virtual?: boolean | null
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          max_attendees?: number | null
          parking_info?: string | null
          prize_pool?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          registration_required?: boolean | null
          schedule?: Json | null
          state?: string
          status?: string | null
          title?: string
          updated_at?: string
          virtual_link?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      floor_plans: {
        Row: {
          background_image_url: string | null
          canvas_height: number | null
          canvas_width: number | null
          created_at: string
          floor_name: string | null
          floor_number: number
          grid_opacity: number | null
          height_meters: number | null
          id: string
          image_url: string | null
          scale_factor: number | null
          svg_data: string | null
          updated_at: string
          venue_id: string
          width_meters: number | null
          zones: Json | null
        }
        Insert: {
          background_image_url?: string | null
          canvas_height?: number | null
          canvas_width?: number | null
          created_at?: string
          floor_name?: string | null
          floor_number?: number
          grid_opacity?: number | null
          height_meters?: number | null
          id?: string
          image_url?: string | null
          scale_factor?: number | null
          svg_data?: string | null
          updated_at?: string
          venue_id: string
          width_meters?: number | null
          zones?: Json | null
        }
        Update: {
          background_image_url?: string | null
          canvas_height?: number | null
          canvas_width?: number | null
          created_at?: string
          floor_name?: string | null
          floor_number?: number
          grid_opacity?: number | null
          height_meters?: number | null
          id?: string
          image_url?: string | null
          scale_factor?: number | null
          svg_data?: string | null
          updated_at?: string
          venue_id?: string
          width_meters?: number | null
          zones?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "floor_plans_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_analytics: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          page_view: string
          referrer: string | null
          session_id: string
          timestamp: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          page_view: string
          referrer?: string | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          page_view?: string
          referrer?: string | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_analytics_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      hr_onboarding: {
        Row: {
          checklist_item: string
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          due_date: string | null
          employee_id: string
          id: string
          is_completed: boolean | null
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          checklist_item: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          due_date?: string | null
          employee_id: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          checklist_item?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          due_date?: string | null
          employee_id?: string
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hr_onboarding_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      import_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          error_log: Json | null
          failed_records: number | null
          id: string
          job_type: string
          metadata: Json | null
          processed_records: number | null
          started_at: string | null
          status: string
          total_records: number | null
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          job_type: string
          metadata?: Json | null
          processed_records?: number | null
          started_at?: string | null
          status?: string
          total_records?: number | null
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          error_log?: Json | null
          failed_records?: number | null
          id?: string
          job_type?: string
          metadata?: Json | null
          processed_records?: number | null
          started_at?: string | null
          status?: string
          total_records?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          application_date: string
          application_url: string | null
          company_name: string
          contact_email: string | null
          contact_person: string | null
          created_at: string
          id: string
          interview_date: string | null
          job_type: string
          location: string | null
          notes: string | null
          offer_received_date: string | null
          position_title: string
          response_deadline: string | null
          salary_range: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date?: string
          application_url?: string | null
          company_name: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          job_type: string
          location?: string | null
          notes?: string | null
          offer_received_date?: string | null
          position_title: string
          response_deadline?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string
          application_url?: string | null
          company_name?: string
          contact_email?: string | null
          contact_person?: string | null
          created_at?: string
          id?: string
          interview_date?: string | null
          job_type?: string
          location?: string | null
          notes?: string | null
          offer_received_date?: string | null
          position_title?: string
          response_deadline?: string | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      mentor_connections: {
        Row: {
          created_at: string
          end_date: string | null
          focus_areas: string[] | null
          id: string
          meeting_frequency: string | null
          mentee_user_id: string
          mentor_user_id: string
          notes: string | null
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          focus_areas?: string[] | null
          id?: string
          meeting_frequency?: string | null
          mentee_user_id: string
          mentor_user_id: string
          notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          focus_areas?: string[] | null
          id?: string
          meeting_frequency?: string | null
          mentee_user_id?: string
          mentor_user_id?: string
          notes?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          body: string
          category: string | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          subject: string | null
          template_name: string
          template_type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name: string
          template_type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          subject?: string | null
          template_name?: string
          template_type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          body: string
          campaign_id: string | null
          clicked_at: string | null
          created_at: string | null
          delivered_at: string | null
          error_message: string | null
          id: string
          message_type: string
          metadata: Json | null
          opened_at: string | null
          recipient_contact_id: string | null
          recipient_email: string | null
          recipient_phone: string | null
          scheduled_at: string | null
          sender_id: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          updated_at: string | null
        }
        Insert: {
          body: string
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_type: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_contact_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Update: {
          body?: string
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string | null
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          message_type?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_contact_id?: string | null
          recipient_email?: string | null
          recipient_phone?: string | null
          scheduled_at?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_contact_id_fkey"
            columns: ["recipient_contact_id"]
            isOneToOne: false
            referencedRelation: "crm_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "message_templates"
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
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          product_image: string | null
          product_name: string
          quantity: number
          selected_color: string | null
          selected_size: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          product_image?: string | null
          product_name: string
          quantity: number
          selected_color?: string | null
          selected_size?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          selected_color?: string | null
          selected_size?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "shop_items"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          order_number: string
          payment_status: string | null
          shipping_address: Json
          shipping_cost: number
          shipping_method: string
          status: string
          stripe_payment_intent_id: string | null
          subtotal: number
          tax: number | null
          total: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          order_number: string
          payment_status?: string | null
          shipping_address: Json
          shipping_cost?: number
          shipping_method: string
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal: number
          tax?: number | null
          total: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          order_number?: string
          payment_status?: string | null
          shipping_address?: Json
          shipping_cost?: number
          shipping_method?: string
          status?: string
          stripe_payment_intent_id?: string | null
          subtotal?: number
          tax?: number | null
          total?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      outreach_search_lists: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          list_name: string
          notes: string | null
          parsed_filters: Json | null
          school_ids: string[] | null
          search_query: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          list_name: string
          notes?: string | null
          parsed_filters?: Json | null
          school_ids?: string[] | null
          search_query: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          list_name?: string
          notes?: string | null
          parsed_filters?: Json | null
          school_ids?: string[] | null
          search_query?: string
          updated_at?: string | null
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
      performance_metrics: {
        Row: {
          created_at: string | null
          department: string | null
          id: string
          metadata: Json | null
          metric_date: string
          metric_type: string
          metric_value: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          id?: string
          metadata?: Json | null
          metric_date: string
          metric_type: string
          metric_value?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          id?: string
          metadata?: Json | null
          metric_date?: string
          metric_type?: string
          metric_value?: number | null
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
      registrations: {
        Row: {
          checked_in_at: string | null
          checked_in_by: string | null
          colleges_visited: string[] | null
          confirmation_sent_at: string | null
          created_at: string | null
          email: string
          event_id: string
          feedback_rating: number | null
          feedback_text: string | null
          first_name: string
          grade_level: string | null
          graduation_year: number | null
          id: string
          last_name: string
          nft_certificate_url: string | null
          nft_minted_at: string | null
          phone: string | null
          qr_code: string
          qr_code_image_url: string | null
          registered_at: string | null
          reminder_sent_at: string | null
          role: string | null
          school_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          colleges_visited?: string[] | null
          confirmation_sent_at?: string | null
          created_at?: string | null
          email: string
          event_id: string
          feedback_rating?: number | null
          feedback_text?: string | null
          first_name: string
          grade_level?: string | null
          graduation_year?: number | null
          id?: string
          last_name: string
          nft_certificate_url?: string | null
          nft_minted_at?: string | null
          phone?: string | null
          qr_code: string
          qr_code_image_url?: string | null
          registered_at?: string | null
          reminder_sent_at?: string | null
          role?: string | null
          school_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          checked_in_at?: string | null
          checked_in_by?: string | null
          colleges_visited?: string[] | null
          confirmation_sent_at?: string | null
          created_at?: string | null
          email?: string
          event_id?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          first_name?: string
          grade_level?: string | null
          graduation_year?: number | null
          id?: string
          last_name?: string
          nft_certificate_url?: string | null
          nft_minted_at?: string | null
          phone?: string | null
          qr_code?: string
          qr_code_image_url?: string | null
          registered_at?: string | null
          reminder_sent_at?: string | null
          role?: string | null
          school_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_events: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          reminder_sent: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_applications: {
        Row: {
          application_date: string | null
          award_amount: number | null
          created_at: string
          decision_date: string | null
          id: string
          notes: string | null
          reminder_sent: boolean | null
          scholarship_id: string
          status: string
          submission_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date?: string | null
          award_amount?: number | null
          created_at?: string
          decision_date?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scholarship_id: string
          status?: string
          submission_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string | null
          award_amount?: number | null
          created_at?: string
          decision_date?: string | null
          id?: string
          notes?: string | null
          reminder_sent?: boolean | null
          scholarship_id?: string
          status?: string
          submission_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scholarship_applications_scholarship_id_fkey"
            columns: ["scholarship_id"]
            isOneToOne: false
            referencedRelation: "scholarship_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarship_booklets: {
        Row: {
          academic_year: string
          category: string
          cover_image_url: string | null
          created_at: string
          description: string | null
          download_count: number | null
          featured: boolean | null
          id: string
          pdf_url: string | null
          published_date: string | null
          status: string | null
          title: string
          total_scholarships: number | null
          total_value: number | null
          updated_at: string
          viewer_url: string | null
        }
        Insert: {
          academic_year: string
          category: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          id?: string
          pdf_url?: string | null
          published_date?: string | null
          status?: string | null
          title: string
          total_scholarships?: number | null
          total_value?: number | null
          updated_at?: string
          viewer_url?: string | null
        }
        Update: {
          academic_year?: string
          category?: string
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          download_count?: number | null
          featured?: boolean | null
          id?: string
          pdf_url?: string | null
          published_date?: string | null
          status?: string | null
          title?: string
          total_scholarships?: number | null
          total_value?: number | null
          updated_at?: string
          viewer_url?: string | null
        }
        Relationships: []
      }
      scholarship_opportunities: {
        Row: {
          academic_requirements: string | null
          amount_max: number | null
          amount_min: number | null
          application_url: string
          auto_discovered: boolean | null
          created_at: string
          deadline: string
          demographic_requirements: string[] | null
          description: string | null
          eligibility_criteria: string | null
          essay_required: boolean | null
          geographic_restrictions: string[] | null
          gpa_requirement: number | null
          id: string
          last_verified: string | null
          major_restrictions: string[] | null
          provider_name: string
          provider_url: string | null
          recommendation_letters_required: number | null
          source_url: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          academic_requirements?: string | null
          amount_max?: number | null
          amount_min?: number | null
          application_url: string
          auto_discovered?: boolean | null
          created_at?: string
          deadline: string
          demographic_requirements?: string[] | null
          description?: string | null
          eligibility_criteria?: string | null
          essay_required?: boolean | null
          geographic_restrictions?: string[] | null
          gpa_requirement?: number | null
          id?: string
          last_verified?: string | null
          major_restrictions?: string[] | null
          provider_name: string
          provider_url?: string | null
          recommendation_letters_required?: number | null
          source_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          academic_requirements?: string | null
          amount_max?: number | null
          amount_min?: number | null
          application_url?: string
          auto_discovered?: boolean | null
          created_at?: string
          deadline?: string
          demographic_requirements?: string[] | null
          description?: string | null
          eligibility_criteria?: string | null
          essay_required?: boolean | null
          geographic_restrictions?: string[] | null
          gpa_requirement?: number | null
          id?: string
          last_verified?: string | null
          major_restrictions?: string[] | null
          provider_name?: string
          provider_url?: string | null
          recommendation_letters_required?: number | null
          source_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      scholarship_tips: {
        Row: {
          category: string
          content: string
          created_at: string
          display_order: number | null
          icon_name: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      school_database: {
        Row: {
          acceptance_rate: number | null
          athletic_division: string | null
          athletic_programs: string[] | null
          city: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          county: string | null
          created_at: string | null
          data_source: string | null
          demographics: Json | null
          district: string | null
          grade_levels: string[] | null
          id: string
          is_active: boolean | null
          is_hbcu: boolean | null
          last_contact_date: string | null
          notes: string | null
          partnership_status: string | null
          programs_interested: Json | null
          programs_offered: string[] | null
          region: string | null
          school_name: string
          school_type: string | null
          special_programs: string[] | null
          state: string
          student_count: number | null
          tags: string[] | null
          total_enrollment: number | null
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          acceptance_rate?: number | null
          athletic_division?: string | null
          athletic_programs?: string[] | null
          city: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          data_source?: string | null
          demographics?: Json | null
          district?: string | null
          grade_levels?: string[] | null
          id?: string
          is_active?: boolean | null
          is_hbcu?: boolean | null
          last_contact_date?: string | null
          notes?: string | null
          partnership_status?: string | null
          programs_interested?: Json | null
          programs_offered?: string[] | null
          region?: string | null
          school_name: string
          school_type?: string | null
          special_programs?: string[] | null
          state: string
          student_count?: number | null
          tags?: string[] | null
          total_enrollment?: number | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          acceptance_rate?: number | null
          athletic_division?: string | null
          athletic_programs?: string[] | null
          city?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          county?: string | null
          created_at?: string | null
          data_source?: string | null
          demographics?: Json | null
          district?: string | null
          grade_levels?: string[] | null
          id?: string
          is_active?: boolean | null
          is_hbcu?: boolean | null
          last_contact_date?: string | null
          notes?: string | null
          partnership_status?: string | null
          programs_interested?: Json | null
          programs_offered?: string[] | null
          region?: string | null
          school_name?: string
          school_type?: string | null
          special_programs?: string[] | null
          state?: string
          student_count?: number | null
          tags?: string[] | null
          total_enrollment?: number | null
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_database_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      seminar_rooms: {
        Row: {
          amenities: Json | null
          capacity: number | null
          created_at: string
          floor_plan_id: string | null
          id: string
          room_name: string
          room_number: string | null
          venue_id: string
          x_position: number | null
          y_position: number | null
        }
        Insert: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          room_name: string
          room_number?: string | null
          venue_id: string
          x_position?: number | null
          y_position?: number | null
        }
        Update: {
          amenities?: Json | null
          capacity?: number | null
          created_at?: string
          floor_plan_id?: string | null
          id?: string
          room_name?: string
          room_number?: string | null
          venue_id?: string
          x_position?: number | null
          y_position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seminar_rooms_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seminar_rooms_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      seminar_sessions: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          end_time: string
          event_id: string
          id: string
          max_capacity: number | null
          presenter_name: string | null
          presenter_organization: string | null
          presenter_title: string | null
          registration_required: boolean | null
          room_id: string
          start_time: string
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_time: string
          event_id: string
          id?: string
          max_capacity?: number | null
          presenter_name?: string | null
          presenter_organization?: string | null
          presenter_title?: string | null
          registration_required?: boolean | null
          room_id: string
          start_time: string
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          end_time?: string
          event_id?: string
          id?: string
          max_capacity?: number | null
          presenter_name?: string | null
          presenter_organization?: string | null
          presenter_title?: string | null
          registration_required?: boolean | null
          room_id?: string
          start_time?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seminar_sessions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seminar_sessions_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "seminar_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      shop_items: {
        Row: {
          category: string | null
          colors: Json | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean | null
          is_limited: boolean | null
          material_info: string | null
          name: string
          price_usd: number | null
          price_xp: number | null
          product_type: string | null
          rarity: Database["public"]["Enums"]["item_rarity"] | null
          shipping_info: string | null
          sizes: string[] | null
          sizing_chart: Json | null
          stock_quantity: number | null
        }
        Insert: {
          category?: string | null
          colors?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_limited?: boolean | null
          material_info?: string | null
          name: string
          price_usd?: number | null
          price_xp?: number | null
          product_type?: string | null
          rarity?: Database["public"]["Enums"]["item_rarity"] | null
          shipping_info?: string | null
          sizes?: string[] | null
          sizing_chart?: Json | null
          stock_quantity?: number | null
        }
        Update: {
          category?: string | null
          colors?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean | null
          is_limited?: boolean | null
          material_info?: string | null
          name?: string
          price_usd?: number | null
          price_xp?: number | null
          product_type?: string | null
          rarity?: Database["public"]["Enums"]["item_rarity"] | null
          shipping_info?: string | null
          sizes?: string[] | null
          sizing_chart?: Json | null
          stock_quantity?: number | null
        }
        Relationships: []
      }
      skills_assessments: {
        Row: {
          assessment_date: string
          created_at: string
          id: string
          notes: string | null
          proficiency_level: number
          skill_category: string
          skill_name: string
          updated_at: string
          user_id: string
          verification_source: string | null
          verified: boolean | null
        }
        Insert: {
          assessment_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          proficiency_level: number
          skill_category: string
          skill_name: string
          updated_at?: string
          user_id: string
          verification_source?: string | null
          verified?: boolean | null
        }
        Update: {
          assessment_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          proficiency_level?: number
          skill_category?: string
          skill_name?: string
          updated_at?: string
          user_id?: string
          verification_source?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          sponsorship_amount: number | null
          sponsorship_end_date: string | null
          sponsorship_start_date: string | null
          tier: string | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          sponsorship_amount?: number | null
          sponsorship_end_date?: string | null
          sponsorship_start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          sponsorship_amount?: number | null
          sponsorship_end_date?: string | null
          sponsorship_start_date?: string | null
          tier?: string | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          category: string | null
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
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
      time_tracking: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          employee_id: string
          entry_date: string
          entry_type: string
          hours: number | null
          id: string
          notes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          employee_id: string
          entry_date: string
          entry_type: string
          hours?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          employee_id?: string
          entry_date?: string
          entry_type?: string
          hours?: number | null
          id?: string
          notes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_tracking_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
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
      user_booth_favorites: {
        Row: {
          booth_id: string
          created_at: string
          event_id: string
          id: string
          notes: string | null
          user_id: string
          visit_order: number | null
        }
        Insert: {
          booth_id: string
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          user_id: string
          visit_order?: number | null
        }
        Update: {
          booth_id?: string
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          user_id?: string
          visit_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_booth_favorites_booth_id_fkey"
            columns: ["booth_id"]
            isOneToOne: false
            referencedRelation: "booths"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_booth_favorites_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
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
      venue_amenities: {
        Row: {
          amenity_name: string | null
          amenity_type: string
          created_at: string
          floor_plan_id: string | null
          icon_name: string | null
          id: string
          venue_id: string
          x_position: number
          y_position: number
        }
        Insert: {
          amenity_name?: string | null
          amenity_type: string
          created_at?: string
          floor_plan_id?: string | null
          icon_name?: string | null
          id?: string
          venue_id: string
          x_position: number
          y_position: number
        }
        Update: {
          amenity_name?: string | null
          amenity_type?: string
          created_at?: string
          floor_plan_id?: string | null
          icon_name?: string | null
          id?: string
          venue_id?: string
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "venue_amenities_floor_plan_id_fkey"
            columns: ["floor_plan_id"]
            isOneToOne: false
            referencedRelation: "floor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_amenities_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          accessibility_info: string | null
          address: string
          amenities: Json | null
          capacity: number | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          floor_plans: Json | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          map_region: string | null
          name: string
          notes: string | null
          parking_info: string | null
          state: string
          updated_at: string | null
          venue_type: string | null
          zip_code: string | null
        }
        Insert: {
          accessibility_info?: string | null
          address: string
          amenities?: Json | null
          capacity?: number | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          floor_plans?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          map_region?: string | null
          name: string
          notes?: string | null
          parking_info?: string | null
          state: string
          updated_at?: string | null
          venue_type?: string | null
          zip_code?: string | null
        }
        Update: {
          accessibility_info?: string | null
          address?: string
          amenities?: Json | null
          capacity?: number | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          floor_plans?: Json | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          map_region?: string | null
          name?: string
          notes?: string | null
          parking_info?: string | null
          state?: string
          updated_at?: string | null
          venue_type?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      verification_history: {
        Row: {
          action: string
          created_at: string | null
          id: string
          notes: string | null
          record_id: string
          record_type: string
          verified_by: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          notes?: string | null
          record_id: string
          record_type: string
          verified_by?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          record_id?: string
          record_type?: string
          verified_by?: string | null
        }
        Relationships: []
      }
      web_search_cache: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          results: Json
          search_key: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          results: Json
          search_key: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          results?: Json
          search_key?: string
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
      youth_services_database: {
        Row: {
          address: string | null
          age_ranges: string[] | null
          city: string
          coaching_staff: Json | null
          contact_email: string | null
          contact_phone: string | null
          cost_info: string | null
          created_at: string | null
          data_source: string | null
          eligibility_requirements: string[] | null
          facilities: string[] | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          organization_name: string | null
          programs_offered: string[] | null
          region: string | null
          schedule: Json | null
          service_name: string
          service_type: string
          sports_offered: string[] | null
          state: string
          updated_at: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          age_ranges?: string[] | null
          city: string
          coaching_staff?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cost_info?: string | null
          created_at?: string | null
          data_source?: string | null
          eligibility_requirements?: string[] | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          organization_name?: string | null
          programs_offered?: string[] | null
          region?: string | null
          schedule?: Json | null
          service_name: string
          service_type: string
          sports_offered?: string[] | null
          state: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          age_ranges?: string[] | null
          city?: string
          coaching_staff?: Json | null
          contact_email?: string | null
          contact_phone?: string | null
          cost_info?: string | null
          created_at?: string | null
          data_source?: string | null
          eligibility_requirements?: string[] | null
          facilities?: string[] | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          organization_name?: string | null
          programs_offered?: string[] | null
          region?: string | null
          schedule?: Json | null
          service_name?: string
          service_type?: string
          sports_offered?: string[] | null
          state?: string
          updated_at?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "youth_services_database_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_cache: { Args: never; Returns: undefined }
      get_current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_new_values?: Json
          p_old_values?: Json
          p_target_id?: string
          p_target_table?: string
        }
        Returns: undefined
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
      app_role:
        | "admin"
        | "coach"
        | "player"
        | "hr_manager"
        | "hr_staff"
        | "outreach_manager"
        | "outreach_staff"
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
      app_role: [
        "admin",
        "coach",
        "player",
        "hr_manager",
        "hr_staff",
        "outreach_manager",
        "outreach_staff",
      ],
      item_rarity: ["common", "rare", "epic", "legendary"],
    },
  },
} as const
