import type { Database } from './database.types'

// Helper type for getting table types
type Tables = Database['public']['Tables']

// User types
export type User = Tables['users']['Row']
export type UserInsert = Tables['users']['Insert']
export type UserUpdate = Tables['users']['Update']

// Channel types
export type Channel = Tables['channels']['Row']
export type ChannelInsert = Tables['channels']['Insert']
export type ChannelUpdate = Tables['channels']['Update']

// Channel member types
export type ChannelMember = Tables['channel_members']['Row']
export type ChannelMemberInsert = Tables['channel_members']['Insert']
export type ChannelMemberUpdate = Tables['channel_members']['Update']
export type ChannelRole = 'member' | 'admin' | 'owner'

// Direct message types
export type DirectMessage = Tables['direct_messages']['Row']
export type DirectMessageInsert = Tables['direct_messages']['Insert']
export type DirectMessageUpdate = Tables['direct_messages']['Update']

// Message types
export type Message = Tables['messages']['Row']
export type MessageInsert = Tables['messages']['Insert']
export type MessageUpdate = Tables['messages']['Update']

// Message attachment types
export type MessageAttachment = Tables['message_attachments']['Row']
export type MessageAttachmentInsert = Tables['message_attachments']['Insert']
export type MessageAttachmentUpdate = Tables['message_attachments']['Update']

// Read receipt types
export type ReadReceipt = Tables['read_receipts']['Row']
export type ReadReceiptInsert = Tables['read_receipts']['Insert']
export type ReadReceiptUpdate = Tables['read_receipts']['Update']

// Extended types with relations
export interface MessageWithUser extends Message {
  user: User
  attachments?: MessageAttachment[]
  read_receipts?: ReadReceipt[]
}

export interface ChannelWithMembers extends Channel {
  members: (ChannelMember & {
    user: User
  })[]
  member_count?: number
}

export interface DirectMessageWithUsers extends DirectMessage {
  user1: User
  user2: User
  last_message?: Message
}

// Utility types
export type MessageLocation = {
  channel_id: string
  dm_id: null
} | {
  channel_id: null
  dm_id: string
}

// Realtime event types
export interface RealtimeMessage {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  new: Record<string, unknown>
  old: Record<string, unknown>
}

// Presence types
export interface PresenceState {
  user_id: string
  online_at: string
  status?: 'online' | 'away' | 'offline'
}

export interface TypingIndicator {
  user_id: string
  channel_id?: string
  dm_id?: string
  started_at: string
}