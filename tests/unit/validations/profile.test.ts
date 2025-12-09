import { describe, it, expect } from 'vitest'
import { profileSchema } from '../../../lib/validations/profile'

describe('profileSchema', () => {
  it('有効なプロフィールデータを受け入れる', () => {
    const validData = {
      displayName: 'Test User',
      bio: 'This is my bio',
      avatarUrl: 'https://example.com/avatar.jpg',
    }

    const result = profileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('bioとavatarUrlがオプショナルであることを確認', () => {
    const validData = {
      displayName: 'Test User',
    }

    const result = profileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('空文字列のbioとavatarUrlを受け入れる', () => {
    const validData = {
      displayName: 'Test User',
      bio: '',
      avatarUrl: '',
    }

    const result = profileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('表示名が空の場合にエラーを返す', () => {
    const invalidData = {
      displayName: '',
      bio: 'This is my bio',
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('表示名')
    }
  })

  it('表示名が2文字未満の場合にエラーを返す', () => {
    const invalidData = {
      displayName: 'A',
      bio: 'This is my bio',
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('2文字以上')
    }
  })

  it('表示名が50文字を超える場合にエラーを返す', () => {
    const invalidData = {
      displayName: 'A'.repeat(51),
      bio: 'This is my bio',
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('50文字以下')
    }
  })

  it('自己紹介が500文字を超える場合にエラーを返す', () => {
    const invalidData = {
      displayName: 'Test User',
      bio: 'A'.repeat(501),
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('500文字以下')
    }
  })

  it('avatarUrlが無効なURL形式の場合にエラーを返す', () => {
    const invalidData = {
      displayName: 'Test User',
      bio: 'This is my bio',
      avatarUrl: 'not-a-valid-url',
    }

    const result = profileSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('URL')
    }
  })

  it('有効なHTTPS URLを受け入れる', () => {
    const validData = {
      displayName: 'Test User',
      avatarUrl: 'https://example.com/avatar.jpg',
    }

    const result = profileSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
