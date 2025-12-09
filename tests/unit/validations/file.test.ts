import { describe, it, expect } from 'vitest'
import { fileUploadSchema, imageUploadSchema } from '../../../lib/validations/file'

// Helper function to create a mock File object
function createMockFile(name: string, size: number, type: string): File {
  const blob = new Blob(['a'.repeat(size)], { type })
  return new File([blob], name, { type })
}

describe('fileUploadSchema', () => {
  it('有効な画像ファイルを受け入れる', () => {
    const validFile = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg')
    const result = fileUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('有効なPDFファイルを受け入れる', () => {
    const validFile = createMockFile('test.pdf', 1024 * 1024, 'application/pdf')
    const result = fileUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('有効なテキストファイルを受け入れる', () => {
    const validFile = createMockFile('test.txt', 1024, 'text/plain')
    const result = fileUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('10MB以下のファイルを受け入れる', () => {
    const validFile = createMockFile('test.jpg', 10 * 1024 * 1024, 'image/jpeg')
    const result = fileUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('10MBを超えるファイルでエラーを返す', () => {
    const invalidFile = createMockFile('test.jpg', 11 * 1024 * 1024, 'image/jpeg')
    const result = fileUploadSchema.safeParse({ file: invalidFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('10MB以下')
    }
  })

  it('サポートされていないファイル形式でエラーを返す', () => {
    const invalidFile = createMockFile('test.exe', 1024, 'application/x-msdownload')
    const result = fileUploadSchema.safeParse({ file: invalidFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('サポートされていません')
    }
  })

  it('複数の画像形式を受け入れる', () => {
    const jpegFile = createMockFile('test.jpg', 1024, 'image/jpeg')
    const pngFile = createMockFile('test.png', 1024, 'image/png')
    const webpFile = createMockFile('test.webp', 1024, 'image/webp')
    const gifFile = createMockFile('test.gif', 1024, 'image/gif')

    expect(fileUploadSchema.safeParse({ file: jpegFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: pngFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: webpFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: gifFile }).success).toBe(true)
  })

  it('複数のドキュメント形式を受け入れる', () => {
    const pdfFile = createMockFile('test.pdf', 1024, 'application/pdf')
    const docFile = createMockFile('test.doc', 1024, 'application/msword')
    const docxFile = createMockFile(
      'test.docx',
      1024,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    )
    const xlsFile = createMockFile('test.xls', 1024, 'application/vnd.ms-excel')
    const xlsxFile = createMockFile(
      'test.xlsx',
      1024,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )

    expect(fileUploadSchema.safeParse({ file: pdfFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: docFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: docxFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: xlsFile }).success).toBe(true)
    expect(fileUploadSchema.safeParse({ file: xlsxFile }).success).toBe(true)
  })
})

describe('imageUploadSchema', () => {
  it('有効な画像ファイルを受け入れる', () => {
    const validFile = createMockFile('test.jpg', 1024 * 1024, 'image/jpeg')
    const result = imageUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('10MB以下の画像を受け入れる', () => {
    const validFile = createMockFile('test.png', 10 * 1024 * 1024, 'image/png')
    const result = imageUploadSchema.safeParse({ file: validFile })
    expect(result.success).toBe(true)
  })

  it('10MBを超える画像でエラーを返す', () => {
    const invalidFile = createMockFile('test.jpg', 11 * 1024 * 1024, 'image/jpeg')
    const result = imageUploadSchema.safeParse({ file: invalidFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('10MB以下')
    }
  })

  it('画像以外のファイルでエラーを返す', () => {
    const invalidFile = createMockFile('test.pdf', 1024, 'application/pdf')
    const result = imageUploadSchema.safeParse({ file: invalidFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('画像ファイル')
    }
  })

  it('すべての画像形式を受け入れる', () => {
    const jpegFile = createMockFile('test.jpg', 1024, 'image/jpeg')
    const jpgFile = createMockFile('test.jpg', 1024, 'image/jpg')
    const pngFile = createMockFile('test.png', 1024, 'image/png')
    const webpFile = createMockFile('test.webp', 1024, 'image/webp')
    const gifFile = createMockFile('test.gif', 1024, 'image/gif')

    expect(imageUploadSchema.safeParse({ file: jpegFile }).success).toBe(true)
    expect(imageUploadSchema.safeParse({ file: jpgFile }).success).toBe(true)
    expect(imageUploadSchema.safeParse({ file: pngFile }).success).toBe(true)
    expect(imageUploadSchema.safeParse({ file: webpFile }).success).toBe(true)
    expect(imageUploadSchema.safeParse({ file: gifFile }).success).toBe(true)
  })

  it('ビデオファイルでエラーを返す', () => {
    const invalidFile = createMockFile('test.mp4', 1024, 'video/mp4')
    const result = imageUploadSchema.safeParse({ file: invalidFile })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('画像ファイル')
    }
  })
})
