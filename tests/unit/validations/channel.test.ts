import { describe, it, expect } from 'vitest'
import { channelSchema } from '../../../lib/validations/channel'

describe('channelSchema', () => {
  it('有効なチャンネルデータを受け入れる', () => {
    const validData = {
      name: 'general',
      description: 'General discussion channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('descriptionがオプショナルであることを確認', () => {
    const validData = {
      name: 'general',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('isPrivateのデフォルト値がfalseであることを確認', () => {
    const validData = {
      name: 'general',
      description: 'General discussion channel',
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isPrivate).toBe(false)
    }
  })

  it('日本語のチャンネル名を受け入れる', () => {
    const validData = {
      name: 'テストチャンネル',
      description: 'テスト用のチャンネル',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('英数字とハイフン、アンダースコアを含むチャンネル名を受け入れる', () => {
    const validData = {
      name: 'test-channel_123',
      description: 'Test channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('チャンネル名が空の場合にエラーを返す', () => {
    const invalidData = {
      name: '',
      description: 'Test channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('チャンネル名')
    }
  })

  it('チャンネル名が2文字未満の場合にエラーを返す', () => {
    const invalidData = {
      name: 'a',
      description: 'Test channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('2文字以上')
    }
  })

  it('チャンネル名が50文字を超える場合にエラーを返す', () => {
    const invalidData = {
      name: 'a'.repeat(51),
      description: 'Test channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('50文字以下')
    }
  })

  it('チャンネル名に使用できない文字が含まれる場合にエラーを返す', () => {
    const invalidData = {
      name: 'test channel!',
      description: 'Test channel',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('使用できない文字')
    }
  })

  it('説明が500文字を超える場合にエラーを返す', () => {
    const invalidData = {
      name: 'general',
      description: 'A'.repeat(501),
      isPrivate: false,
    }

    const result = channelSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('500文字以下')
    }
  })

  it('空文字列の説明を受け入れる', () => {
    const validData = {
      name: 'general',
      description: '',
      isPrivate: false,
    }

    const result = channelSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
