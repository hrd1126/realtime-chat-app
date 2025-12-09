import { z } from 'zod'

/**
 * Message schema for creating and updating messages
 */
export const messageSchema = z
  .object({
    content: z
      .string()
      .min(1, 'メッセージを入力してください')
      .max(5000, 'メッセージは5000文字以下である必要があります'),
    channelId: z.string().uuid('有効なチャンネルIDではありません').optional(),
    dmId: z.string().uuid('有効なDM IDではありません').optional(),
  })
  .refine((data) => data.channelId || data.dmId, {
    message: 'チャンネルIDまたはDM IDのいずれかが必要です',
  })

/**
 * Message edit schema for updating existing messages
 */
export const messageEditSchema = z.object({
  content: z
    .string()
    .min(1, 'メッセージを入力してください')
    .max(5000, 'メッセージは5000文字以下である必要があります'),
})

export type MessageInput = z.infer<typeof messageSchema>
export type MessageEditInput = z.infer<typeof messageEditSchema>
