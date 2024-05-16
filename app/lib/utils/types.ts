export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      estimates: {
        Row: {
          distance_km: number | null;
          estimate: number | null;
          id: number;
          transport_method: string | null;
        };
        Insert: {
          distance_km?: number | null;
          estimate?: number | null;
          id?: never;
          transport_method?: string | null;
        };
        Update: {
          distance_km?: number | null;
          estimate?: number | null;
          id?: never;
          transport_method?: string | null;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          calculation: Json | null;
          created_at: string;
          description: string | null;
          id: string;
          title: string;
          user_id: string;
        };
        Insert: {
          calculation?: Json | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          title: string;
          user_id: string;
        };
        Update: {
          calculation?: Json | null;
          created_at?: string;
          description?: string | null;
          id?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_projects_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      projects_transports: {
        Row: {
          created_at: string;
          distance_km: number;
          id: string;
          project_id: string;
          transport_id: number | null;
        };
        Insert: {
          created_at?: string;
          distance_km: number;
          id?: string;
          project_id?: string;
          transport_id?: number | null;
        };
        Update: {
          created_at?: string;
          distance_km?: number;
          id?: string;
          project_id?: string;
          transport_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_projects_transports_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_projects_transports_transport_id_fkey";
            columns: ["transport_id"];
            isOneToOne: false;
            referencedRelation: "transports";
            referencedColumns: ["id"];
          },
        ];
      };
      transports: {
        Row: {
          created_at: string;
          created_by: string | null;
          emissions_per_km: number;
          id: number;
          name: string;
          type: Database["public"]["Enums"]["transportation_type"];
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          emissions_per_km: number;
          id?: number;
          name: string;
          type: Database["public"]["Enums"]["transportation_type"];
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          emissions_per_km?: number;
          id?: number;
          name?: string;
          type?: Database["public"]["Enums"]["transportation_type"];
        };
        Relationships: [
          {
            foreignKeyName: "public_transports_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      transportation_type: "air" | "land" | "water";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

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
  : never;
