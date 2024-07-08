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
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      matches: {
        Row: {
          created_at: string
          created_user: string | null
          date: string | null
          description: string | null
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
          time: string | null
        }
        Insert: {
          created_at?: string
          created_user?: string | null
          date?: string | null
          description?: string | null
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
          time?: string | null
        }
        Update: {
          created_at?: string
          created_user?: string | null
          date?: string | null
          description?: string | null
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
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "matches_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
            foreignKeyName: "participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
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
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
        }
        Returns: {
          key: string
          id: string
          created_at: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          prefix_param: string
          delimiter_param: string
          max_keys?: number
          start_after?: string
          next_token?: string
        }
        Returns: {
          name: string
          id: string
          metadata: Json
          updated_at: string
        }[]
      }
      operation: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
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
