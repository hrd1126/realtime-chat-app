import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema } from '../../../lib/validations/auth'

describe('loginSchema', () => {
  it('有効なログインデータを受け入れる', () => {
    const validData = {
      email: 'test@example.com',
      password: 'password123',
    }

    const result = loginSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('メールアドレスが空の場合にエラーを返す', () => {
    const invalidData = {
      email: '',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('メールアドレス')
    }
  })

  it('無効なメールアドレス形式の場合にエラーを返す', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'password123',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('有効な')
    }
  })

  it('パスワードが空の場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: '',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('パスワード')
    }
  })

  it('パスワードが8文字未満の場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'short',
    }

    const result = loginSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('8文字以上')
    }
  })
})

describe('signupSchema', () => {
  it('有効なサインアップデータを受け入れる', () => {
    const validData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      displayName: 'Test User',
    }

    const result = signupSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('メールアドレスが無効な場合にエラーを返す', () => {
    const invalidData = {
      email: 'invalid-email',
      password: 'Password123',
      confirmPassword: 'Password123',
      displayName: 'Test User',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })

  it('パスワードが要件を満たさない場合にエラーを返す（大文字がない）', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      displayName: 'Test User',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('大文字')
    }
  })

  it('パスワードが要件を満たさない場合にエラーを返す（数字がない）', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'PasswordABC',
      confirmPassword: 'PasswordABC',
      displayName: 'Test User',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('数字')
    }
  })

  it('パスワードが一致しない場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'DifferentPassword123',
      displayName: 'Test User',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('一致しません')
    }
  })

  it('表示名が空の場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      displayName: '',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('表示名')
    }
  })

  it('表示名が2文字未満の場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      displayName: 'A',
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('2文字以上')
    }
  })

  it('表示名が50文字を超える場合にエラーを返す', () => {
    const invalidData = {
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      displayName: 'A'.repeat(51),
    }

    const result = signupSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('50文字以下')
    }
  })
})
