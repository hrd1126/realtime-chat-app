export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      channels: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      channel_members: {
        Row: {
          id: string
          channel_id: string
          user_id: string
          role: 'member' | 'admin' | 'owner'
          joined_at: string
        }
        Insert: {
          id?: string
          channel_id: string
          user_id: string
          role?: 'member' | 'admin' | 'owner'
          joined_at?: string
        }
        Update: {
          id?: string
          channel_id?: string
          user_id?: string
          role?: 'member' | 'admin' | 'owner'
          joined_at?: string
        }
      }
      direct_messages: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          content: string
          user_id: string
          channel_id: string | null
          dm_id: string | null
          edited: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          content: string
          user_id: string
          channel_id?: string | null
          dm_id?: string | null
          edited?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          content?: string
          user_id?: string
          channel_id?: string | null
          dm_id?: string | null
          edited?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      message_attachments: {
        Row: {
          id: string
          message_id: string
          file_name: string
          file_url: string
          file_size: number | null
          file_type: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          message_id: string
          file_name: string
          file_url: string
          file_size?: number | null
          file_type?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          file_name?: string
          file_url?: string
          file_size?: number | null
          file_type?: string | null
          uploaded_at?: string
        }
      }
      read_receipts: {
        Row: {
          id: string
          user_id: string
          message_id: string
          read_at: string
        }
        Insert: {
          id?: string
          user_id: string
          message_id: string
          read_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          message_id?: string
          read_at?: string
        }
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
}