import { z } from 'zod'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

/**
 * File upload schema for validating uploaded files
 */
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'ファイルサイズは10MB以下である必要があります',
    })
    .refine(
      (file) => {
        const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES]
        return allowedTypes.includes(file.type)
      },
      {
        message: 'このファイル形式はサポートされていません',
      }
    ),
})

/**
 * Image upload schema for avatar and image attachments
 */
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: 'ファイルサイズは10MB以下である必要があります',
    })
    .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), {
      message: '画像ファイル（JPEG、PNG、WebP、GIF）のみアップロード可能です',
    }),
})

export type FileUploadInput = z.infer<typeof fileUploadSchema>
export type ImageUploadInput = z.infer<typeof imageUploadSchema>

export { MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES, ALLOWED_DOCUMENT_TYPES }
