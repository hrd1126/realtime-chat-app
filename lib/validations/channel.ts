import { z } from 'zod'

/**
 * Channel schema for creating and updating channels
 */
export const channelSchema = z.object({
  name: z
    .string()
    .min(1, 'チャンネル名を入力してください')
    .min(2, 'チャンネル名は2文字以上である必要があります')
    .max(50, 'チャンネル名は50文字以下である必要があります')
    .regex(
      /^[a-zA-Z0-9_\-\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+$/,
      'チャンネル名に使用できない文字が含まれています'
    ),
  description: z
    .string()
    .max(500, '説明は500文字以下である必要があります')
    .optional()
    .or(z.literal('')),
  isPrivate: z.boolean().default(false),
})

export type ChannelInput = z.infer<typeof channelSchema>
