export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      badminton_clubs: {
        Row: {
          address: string | null
          club_id: number | null
          club_name: string | null
          club_review1: string | null
          club_review2: string | null
          club_review3: string | null
          club_website: string | null
          contact: string | null
          courts: string | null
          date_added: string | null
          fee: string | null
          field1: string | null
          field2: string | null
          field3: string | null
          flooring: string | null
          id: number
          latitude: number | null
          longitude: number | null
          map_link: string | null
          name: string | null
          other_link1: string | null
          other_link2: string | null
          other_link3: string | null
          others: string | null
          schedule: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          club_id?: number | null
          club_name?: string | null
          club_review1?: string | null
          club_review2?: string | null
          club_review3?: string | null
          club_website?: string | null
          contact?: string | null
          courts?: string | null
          date_added?: string | null
          fee?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          flooring?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
          name?: string | null
          other_link1?: string | null
          other_link2?: string | null
          other_link3?: string | null
          others?: string | null
          schedule?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          club_id?: number | null
          club_name?: string | null
          club_review1?: string | null
          club_review2?: string | null
          club_review3?: string | null
          club_website?: string | null
          contact?: string | null
          courts?: string | null
          date_added?: string | null
          fee?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          flooring?: string | null
          id?: number
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
          name?: string | null
          other_link1?: string | null
          other_link2?: string | null
          other_link3?: string | null
          others?: string | null
          schedule?: string | null
          type?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          match_id: number | null
          message: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          match_id?: number | null
          message: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          match_id?: number | null
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      club_place_mapping: {
        Row: {
          additional_info: Json | null
          club_id: number
          created_at: string | null
          created_user: string
          mapping_id: number
          modified_at: string | null
          modified_user: string
          place_id: number
        }
        Insert: {
          additional_info?: Json | null
          club_id: number
          created_at?: string | null
          created_user: string
          mapping_id?: number
          modified_at?: string | null
          modified_user: string
          place_id: number
        }
        Update: {
          additional_info?: Json | null
          club_id?: number
          created_at?: string | null
          created_user?: string
          mapping_id?: number
          modified_at?: string | null
          modified_user?: string
          place_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_club_id"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["club_id"]
          },
          {
            foreignKeyName: "fk_place_id"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["place_id"]
          },
        ]
      }
      club_place_schedule: {
        Row: {
          created_at: string | null
          created_user: string
          day_of_week: number
          mapping_id: number
          modified_at: string | null
          modified_user: string
          operation_end_time: string
          operation_start_time: string
          schedule_id: number
        }
        Insert: {
          created_at?: string | null
          created_user: string
          day_of_week: number
          mapping_id: number
          modified_at?: string | null
          modified_user: string
          operation_end_time: string
          operation_start_time: string
          schedule_id?: number
        }
        Update: {
          created_at?: string | null
          created_user?: string
          day_of_week?: number
          mapping_id?: number
          modified_at?: string | null
          modified_user?: string
          operation_end_time?: string
          operation_start_time?: string
          schedule_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_mapping_id"
            columns: ["mapping_id"]
            isOneToOne: false
            referencedRelation: "club_place_mapping"
            referencedColumns: ["mapping_id"]
          },
        ]
      }
      clubs: {
        Row: {
          additional_info: Json | null
          club_id: number
          club_name: string
          contact_info: string | null
          created_at: string | null
          created_user: string
          modified_at: string | null
          modified_user: string
        }
        Insert: {
          additional_info?: Json | null
          club_id?: number
          club_name: string
          contact_info?: string | null
          created_at?: string | null
          created_user: string
          modified_at?: string | null
          modified_user: string
        }
        Update: {
          additional_info?: Json | null
          club_id?: number
          club_name?: string
          contact_info?: string | null
          created_at?: string | null
          created_user?: string
          modified_at?: string | null
          modified_user?: string
        }
        Relationships: []
      }
      KS_PUBLIC_ALSFC_PROGRM_INFO_202409: {
        Row: {
          CTPRVN_CD: number | null
          CTPRVN_NM: string | null
          FCLTY_ADDR: string | null
          FCLTY_NM: string | null
          FCLTY_TEL_NO: string | null
          FCLTY_TY_NM: string | null
          HMPG_URL: string | null
          PROGRM_BEGIN_DE: number | null
          PROGRM_END_DE: number | null
          PROGRM_ESTBL_TIZN_VALUE: string | null
          PROGRM_ESTBL_WKDAY_NM: string | null
          PROGRM_NM: string | null
          PROGRM_PRC: string | null
          PROGRM_PRC_TY_NM: string | null
          PROGRM_RCRIT_NMPR_CO: string | null
          PROGRM_TRGET_NM: string | null
          PROGRM_TY_NM: string | null
          SIGNGU_CD: number | null
          SIGNGU_NM: string | null
        }
        Insert: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Update: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Relationships: []
      }
      KS_PUBLIC_ALSFC_PROGRM_INFO_202409_ORG: {
        Row: {
          CTPRVN_CD: number | null
          CTPRVN_NM: string | null
          FCLTY_ADDR: string | null
          FCLTY_NM: string | null
          FCLTY_TEL_NO: string | null
          FCLTY_TY_NM: string | null
          HMPG_URL: string | null
          PROGRM_BEGIN_DE: number | null
          PROGRM_END_DE: number | null
          PROGRM_ESTBL_TIZN_VALUE: string | null
          PROGRM_ESTBL_WKDAY_NM: string | null
          PROGRM_NM: string | null
          PROGRM_PRC: string | null
          PROGRM_PRC_TY_NM: string | null
          PROGRM_RCRIT_NMPR_CO: string | null
          PROGRM_TRGET_NM: string | null
          PROGRM_TY_NM: string | null
          SIGNGU_CD: number | null
          SIGNGU_NM: string | null
        }
        Insert: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Update: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Relationships: []
      }
      KS_PUBLIC_ALSFC_PROGRM_INFO_202410_ORG: {
        Row: {
          CTPRVN_CD: number | null
          CTPRVN_NM: string | null
          FCLTY_ADDR: string | null
          FCLTY_NM: string | null
          FCLTY_TEL_NO: string | null
          FCLTY_TY_NM: string | null
          HMPG_URL: string | null
          PROGRM_BEGIN_DE: number | null
          PROGRM_END_DE: number | null
          PROGRM_ESTBL_TIZN_VALUE: string | null
          PROGRM_ESTBL_WKDAY_NM: string | null
          PROGRM_NM: string | null
          PROGRM_PRC: string | null
          PROGRM_PRC_TY_NM: string | null
          PROGRM_RCRIT_NMPR_CO: string | null
          PROGRM_TRGET_NM: string | null
          PROGRM_TY_NM: string | null
          SIGNGU_CD: number | null
          SIGNGU_NM: string | null
        }
        Insert: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Update: {
          CTPRVN_CD?: number | null
          CTPRVN_NM?: string | null
          FCLTY_ADDR?: string | null
          FCLTY_NM?: string | null
          FCLTY_TEL_NO?: string | null
          FCLTY_TY_NM?: string | null
          HMPG_URL?: string | null
          PROGRM_BEGIN_DE?: number | null
          PROGRM_END_DE?: number | null
          PROGRM_ESTBL_TIZN_VALUE?: string | null
          PROGRM_ESTBL_WKDAY_NM?: string | null
          PROGRM_NM?: string | null
          PROGRM_PRC?: string | null
          PROGRM_PRC_TY_NM?: string | null
          PROGRM_RCRIT_NMPR_CO?: string | null
          PROGRM_TRGET_NM?: string | null
          PROGRM_TY_NM?: string | null
          SIGNGU_CD?: number | null
          SIGNGU_NM?: string | null
        }
        Relationships: []
      }
      KS_WNTY_PUBLIC_PHSTRN_FCLTY_STTUS_202407: {
        Row: {
          ACMD_NMPR_CO: string | null
          ADTM_CO: string | null
          DEL_AT: string | null
          FCLTY_AR_CO: string | null
          FCLTY_FLAG_NM: string | null
          FCLTY_HMPG_URL: string | null
          FCLTY_LA: string | null
          FCLTY_LO: string | null
          FCLTY_NM: string | null
          FCLTY_SDIV_CD: string | null
          FCLTY_STATE_CD: string | null
          FCLTY_TY_CD: string | null
          FCLTY_TY_NM: string | null
          INDUTY_CD: string | null
          INDUTY_NM: string | null
          NATION_ALSFC_AT: string | null
          POSESN_MBY_CD: string | null
          POSESN_MBY_CTPRVN_CD: string | null
          POSESN_MBY_CTPRVN_NM: string | null
          POSESN_MBY_NM: string | null
          POSESN_MBY_SIGNGU_CD: string | null
          POSESN_MBY_SIGNGU_NM: string | null
          RDNMADR_NM: string | null
          ROAD_NM_CTPRVN_CD: string | null
          ROAD_NM_CTPRVN_NM: string | null
          ROAD_NM_EMD_CD: string | null
          ROAD_NM_EMD_NM: string | null
          ROAD_NM_LI_CD: string | null
          ROAD_NM_LI_NM: string | null
          ROAD_NM_SIGNGU_CD: string | null
          ROAD_NM_SIGNGU_NM: string | null
          RSPNSBLTY_DEPT_NM: string | null
          RSPNSBLTY_TEL_NO: string | null
        }
        Insert: {
          ACMD_NMPR_CO?: string | null
          ADTM_CO?: string | null
          DEL_AT?: string | null
          FCLTY_AR_CO?: string | null
          FCLTY_FLAG_NM?: string | null
          FCLTY_HMPG_URL?: string | null
          FCLTY_LA?: string | null
          FCLTY_LO?: string | null
          FCLTY_NM?: string | null
          FCLTY_SDIV_CD?: string | null
          FCLTY_STATE_CD?: string | null
          FCLTY_TY_CD?: string | null
          FCLTY_TY_NM?: string | null
          INDUTY_CD?: string | null
          INDUTY_NM?: string | null
          NATION_ALSFC_AT?: string | null
          POSESN_MBY_CD?: string | null
          POSESN_MBY_CTPRVN_CD?: string | null
          POSESN_MBY_CTPRVN_NM?: string | null
          POSESN_MBY_NM?: string | null
          POSESN_MBY_SIGNGU_CD?: string | null
          POSESN_MBY_SIGNGU_NM?: string | null
          RDNMADR_NM?: string | null
          ROAD_NM_CTPRVN_CD?: string | null
          ROAD_NM_CTPRVN_NM?: string | null
          ROAD_NM_EMD_CD?: string | null
          ROAD_NM_EMD_NM?: string | null
          ROAD_NM_LI_CD?: string | null
          ROAD_NM_LI_NM?: string | null
          ROAD_NM_SIGNGU_CD?: string | null
          ROAD_NM_SIGNGU_NM?: string | null
          RSPNSBLTY_DEPT_NM?: string | null
          RSPNSBLTY_TEL_NO?: string | null
        }
        Update: {
          ACMD_NMPR_CO?: string | null
          ADTM_CO?: string | null
          DEL_AT?: string | null
          FCLTY_AR_CO?: string | null
          FCLTY_FLAG_NM?: string | null
          FCLTY_HMPG_URL?: string | null
          FCLTY_LA?: string | null
          FCLTY_LO?: string | null
          FCLTY_NM?: string | null
          FCLTY_SDIV_CD?: string | null
          FCLTY_STATE_CD?: string | null
          FCLTY_TY_CD?: string | null
          FCLTY_TY_NM?: string | null
          INDUTY_CD?: string | null
          INDUTY_NM?: string | null
          NATION_ALSFC_AT?: string | null
          POSESN_MBY_CD?: string | null
          POSESN_MBY_CTPRVN_CD?: string | null
          POSESN_MBY_CTPRVN_NM?: string | null
          POSESN_MBY_NM?: string | null
          POSESN_MBY_SIGNGU_CD?: string | null
          POSESN_MBY_SIGNGU_NM?: string | null
          RDNMADR_NM?: string | null
          ROAD_NM_CTPRVN_CD?: string | null
          ROAD_NM_CTPRVN_NM?: string | null
          ROAD_NM_EMD_CD?: string | null
          ROAD_NM_EMD_NM?: string | null
          ROAD_NM_LI_CD?: string | null
          ROAD_NM_LI_NM?: string | null
          ROAD_NM_SIGNGU_CD?: string | null
          ROAD_NM_SIGNGU_NM?: string | null
          RSPNSBLTY_DEPT_NM?: string | null
          RSPNSBLTY_TEL_NO?: string | null
        }
        Relationships: []
      }
      lesson_facilities: {
        Row: {
          address: string
          city_code: string
          city_name: string
          created_at: string | null
          facility_name: string
          facility_type: string
          id: string
          latitude: number | null
          longitude: number | null
          phone: string | null
          place_id: number | null
          province_code: string
          province_name: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city_code: string
          city_name: string
          created_at?: string | null
          facility_name: string
          facility_type: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          place_id?: number | null
          province_code: string
          province_name: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city_code?: string
          city_name?: string
          created_at?: string | null
          facility_name?: string
          facility_type?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          place_id?: number | null
          province_code?: string
          province_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      lesson_programs: {
        Row: {
          capacity: number
          created_at: string | null
          end_date: string
          facility_id: string | null
          homepage_url: string | null
          id: string
          is_active: boolean | null
          price: number
          price_type: string
          program_name: string
          program_type: string
          start_date: string
          target_audience: string
          time_slot: string
          updated_at: string | null
          weekdays: string
        }
        Insert: {
          capacity: number
          created_at?: string | null
          end_date: string
          facility_id?: string | null
          homepage_url?: string | null
          id?: string
          is_active?: boolean | null
          price: number
          price_type: string
          program_name: string
          program_type: string
          start_date: string
          target_audience: string
          time_slot: string
          updated_at?: string | null
          weekdays: string
        }
        Update: {
          capacity?: number
          created_at?: string | null
          end_date?: string
          facility_id?: string | null
          homepage_url?: string | null
          id?: string
          is_active?: boolean | null
          price?: number
          price_type?: string
          program_name?: string
          program_type?: string
          start_date?: string
          target_audience?: string
          time_slot?: string
          updated_at?: string | null
          weekdays?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_programs_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "lesson_facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          created_user: string | null
          date: string | null
          description: string | null
          end_time: string | null
          id: number
          level: string | null
          manager_id: string | null
          match_name: string | null
          match_time: string | null
          max: number | null
          max_level: number
          min_level: number
          modified_at: string | null
          modified_user: string | null
          place_id: number | null
          start_time: string | null
          time: string | null
        }
        Insert: {
          created_at?: string
          created_user?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          level?: string | null
          manager_id?: string | null
          match_name?: string | null
          match_time?: string | null
          max?: number | null
          max_level?: number
          min_level?: number
          modified_at?: string | null
          modified_user?: string | null
          place_id?: number | null
          start_time?: string | null
          time?: string | null
        }
        Update: {
          created_at?: string
          created_user?: string | null
          date?: string | null
          description?: string | null
          end_time?: string | null
          id?: number
          level?: string | null
          manager_id?: string | null
          match_name?: string | null
          match_time?: string | null
          max?: number | null
          max_level?: number
          min_level?: number
          modified_at?: string | null
          modified_user?: string | null
          place_id?: number | null
          start_time?: string | null
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["place_id"]
          },
        ]
      }
      participants: {
        Row: {
          created_at: string
          id: number
          match_id: number
          modified_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          match_id: number
          modified_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          match_id?: number
          modified_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participants_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      places: {
        Row: {
          additional_info: Json | null
          address: string | null
          created_at: string | null
          created_user: string
          latitude: number | null
          longitude: number | null
          modified_at: string | null
          modified_user: string
          place_id: number
          place_name: string
          place_type: string
        }
        Insert: {
          additional_info?: Json | null
          address?: string | null
          created_at?: string | null
          created_user: string
          latitude?: number | null
          longitude?: number | null
          modified_at?: string | null
          modified_user: string
          place_id?: number
          place_name: string
          place_type: string
        }
        Update: {
          additional_info?: Json | null
          address?: string | null
          created_at?: string | null
          created_user?: string
          latitude?: number | null
          longitude?: number | null
          modified_at?: string | null
          modified_user?: string
          place_id?: number
          place_name?: string
          place_type?: string
        }
        Relationships: []
      }
      places_backup: {
        Row: {
          address: string | null
          club_id: number | null
          club_name: string | null
          club_review1: string | null
          club_review2: string | null
          club_review3: string | null
          club_website: string | null
          contact: string | null
          courts: string | null
          date_added: string | null
          fee: string | null
          field1: string | null
          field2: string | null
          field3: string | null
          flooring: string | null
          id: number | null
          latitude: number | null
          longitude: number | null
          map_link: string | null
          name: string | null
          other_link1: string | null
          other_link2: string | null
          other_link3: string | null
          others: string | null
          schedule: string | null
          type: string | null
        }
        Insert: {
          address?: string | null
          club_id?: number | null
          club_name?: string | null
          club_review1?: string | null
          club_review2?: string | null
          club_review3?: string | null
          club_website?: string | null
          contact?: string | null
          courts?: string | null
          date_added?: string | null
          fee?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          flooring?: string | null
          id?: number | null
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
          name?: string | null
          other_link1?: string | null
          other_link2?: string | null
          other_link3?: string | null
          others?: string | null
          schedule?: string | null
          type?: string | null
        }
        Update: {
          address?: string | null
          club_id?: number | null
          club_name?: string | null
          club_review1?: string | null
          club_review2?: string | null
          club_review3?: string | null
          club_website?: string | null
          contact?: string | null
          courts?: string | null
          date_added?: string | null
          fee?: string | null
          field1?: string | null
          field2?: string | null
          field3?: string | null
          flooring?: string | null
          id?: number | null
          latitude?: number | null
          longitude?: number | null
          map_link?: string | null
          name?: string | null
          other_link1?: string | null
          other_link2?: string | null
          other_link3?: string | null
          others?: string | null
          schedule?: string | null
          type?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          age_group: string | null
          avatar_url: string | null
          bio: string | null
          city: string
          created_at: string | null
          display_name: string
          email: string
          experience_years: number
          gender: string | null
          preferred_time_slots: string | null
          privacy_settings: Json | null
          skill_level: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          city: string
          created_at?: string | null
          display_name: string
          email: string
          experience_years: number
          gender?: string | null
          preferred_time_slots?: string | null
          privacy_settings?: Json | null
          skill_level: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_group?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string
          created_at?: string | null
          display_name?: string
          email?: string
          experience_years?: number
          gender?: string | null
          preferred_time_slots?: string | null
          privacy_settings?: Json | null
          skill_level?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
