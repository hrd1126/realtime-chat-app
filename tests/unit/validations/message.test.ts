import { describe, it, expect } from 'vitest'
import { messageSchema, messageEditSchema } from '../../../lib/validations/message'

describe('messageSchema', () => {
  it('有効なチャンネルメッセージデータを受け入れる', () => {
    const validData = {
      content: 'Hello, world!',
      channelId: '123e4567-e89b-12d3-a456-426614174000',
    }

    const result = messageSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('有効なDMメッセージデータを受け入れる', () => {
    const validData = {
      content: 'Hello, world!',
      dmId: '123e4567-e89b-12d3-a456-426614174000',
    }

    const result = messageSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('メッセージ内容が空の場合にエラーを返す', () => {
    const invalidData = {
      content: '',
      channelId: '123e4567-e89b-12d3-a456-426614174000',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('メッセージ')
    }
  })

  it('メッセージが5000文字を超える場合にエラーを返す', () => {
    const invalidData = {
      content: 'A'.repeat(5001),
      channelId: '123e4567-e89b-12d3-a456-426614174000',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('5000文字以下')
    }
  })

  it('channelIdとdmIdの両方がない場合にエラーを返す', () => {
    const invalidData = {
      content: 'Hello, world!',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('チャンネルID')
    }
  })

  it('channelIdが無効なUUID形式の場合にエラーを返す', () => {
    const invalidData = {
      content: 'Hello, world!',
      channelId: 'invalid-uuid',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('チャンネルID')
    }
  })

  it('dmIdが無効なUUID形式の場合にエラーを返す', () => {
    const invalidData = {
      content: 'Hello, world!',
      dmId: 'invalid-uuid',
    }

    const result = messageSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('DM ID')
    }
  })

  it('長い日本語メッセージを受け入れる', () => {
    const validData = {
      content: 'こんにちは'.repeat(100),
      channelId: '123e4567-e89b-12d3-a456-426614174000',
    }

    const result = messageSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})

describe('messageEditSchema', () => {
  it('有効な編集メッセージデータを受け入れる', () => {
    const validData = {
      content: 'Updated message',
    }

    const result = messageEditSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('メッセージ内容が空の場合にエラーを返す', () => {
    const invalidData = {
      content: '',
    }

    const result = messageEditSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('メッセージ')
    }
  })

  it('メッセージが5000文字を超える場合にエラーを返す', () => {
    const invalidData = {
      content: 'A'.repeat(5001),
    }

    const result = messageEditSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('5000文字以下')
    }
  })

  it('最大文字数のメッセージを受け入れる', () => {
    const validData = {
      content: 'A'.repeat(5000),
    }

    const result = messageEditSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })
})
