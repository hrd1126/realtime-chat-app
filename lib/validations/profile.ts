import { z } from 'zod'

/**
 * Profile schema for user profile updates
 */
export const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, '表示名を入力してください')
    .min(2, '表示名は2文字以上である必要があります')
    .max(50, '表示名は50文字以下である必要があります'),
  bio: z
    .string()
    .max(500, '自己紹介は500文字以下である必要があります')
    .optional()
    .or(z.literal('')),
  avatarUrl: z.string().url('有効なURLを入力してください').optional().or(z.literal('')),
})

export type ProfileInput = z.infer<typeof profileSchema>
