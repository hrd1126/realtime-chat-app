# Requirements Document

## Introduction

本ドキュメントは、Next.js (App Router) + Supabaseを活用した、Slack/Discordに匹敵するエンタープライズグレードのリアルタイムチャットアプリケーションの要件を定義します。本システムは、フリーランスエンジニアの技術力証明を目的とし、セキュリティ（RLS）、パフォーマンス（楽観的更新）、保守性（テスト、型安全性）を重視した実務品質のコードベースを実現します。

## Glossary

- **Chat System**: Next.js 15 (App Router)とSupabaseで構築されるリアルタイムチャットアプリケーション全体
- **User**: Chat Systemを利用する認証済みのユーザー
- **Channel**: 複数のUserが参加できるパブリックなチャットルーム
- **Direct Message (DM)**: 2人のUser間の1対1プライベートチャット
- **Message**: UserがChannelまたはDMで送信するテキスト、画像、ファイルを含むコンテンツ
- **Presence**: Userのオンライン/オフライン状態をリアルタイムで追跡する機能
- **Typing Indicator**: Userがメッセージを入力中であることを他のUserに表示する機能
- **Read Receipt**: MessageをUserが既読したことを記録・表示する機能
- **Optimistic Update**: サーバーレスポンスを待たずにUIを即座に更新する手法
- **Row Level Security (RLS)**: Supabase PostgreSQLのデータベースレベルのアクセス制御ポリシー
- **Supabase Storage**: Supabaseが提供するファイルストレージサービス
- **Supabase Realtime**: Supabaseが提供するデータベース変更のリアルタイム購読機能

## Requirements

### Requirement 1: ユーザー認証

**User Story:** As a User, I want to sign up and sign in using multiple authentication methods, so that I can securely access the Chat System

#### Acceptance Criteria

1. THE Chat System SHALL provide email address and password authentication
2. THE Chat System SHALL provide GitHub OAuth authentication
3. THE Chat System SHALL provide Google OAuth authentication
4. WHEN a User successfully authenticates, THE Chat System SHALL create a user profile record in the database
5. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only access their own authentication data

### Requirement 2: ユーザープロフィール管理

**User Story:** As a User, I want to edit my profile and upload an avatar image, so that I can personalize my identity in the Chat System

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to update their display name
2. THE Chat System SHALL allow Users to update their profile bio
3. THE Chat System SHALL allow Users to upload an avatar image to Supabase Storage
4. WHEN a User uploads an avatar image, THE Chat System SHALL validate the file type is an image format (JPEG, PNG, GIF, WebP)
5. WHEN a User uploads an avatar image, THE Chat System SHALL validate the file size does not exceed 5 megabytes
6. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only modify their own profile data

### Requirement 3: オンライン/オフライン状態表示

**User Story:** As a User, I want to see which other Users are currently online, so that I know who is available for real-time communication

#### Acceptance Criteria

1. WHEN a User signs in, THE Chat System SHALL mark the User as online using Supabase Presence
2. WHEN a User signs out, THE Chat System SHALL mark the User as offline
3. WHEN a User closes the browser or loses connection, THE Chat System SHALL mark the User as offline within 30 seconds
4. THE Chat System SHALL display online status indicators next to User names in the user interface
5. THE Chat System SHALL update online status indicators in real-time without requiring page refresh

### Requirement 4: チャンネル作成と管理

**User Story:** As a User, I want to create and manage public Channels, so that I can organize conversations by topic

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to create new Channels with a unique name
2. THE Chat System SHALL allow Users to provide a description when creating a Channel
3. WHEN a User creates a Channel, THE Chat System SHALL automatically add the User as a member of that Channel
4. THE Chat System SHALL validate Channel names are between 3 and 50 characters
5. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only view Channels they are members of

### Requirement 5: チャンネル検索と参加

**User Story:** As a User, I want to search for and join existing Channels, so that I can participate in conversations that interest me

#### Acceptance Criteria

1. THE Chat System SHALL provide a search interface for discovering Channels by name or description
2. THE Chat System SHALL display a list of all public Channels available to join
3. THE Chat System SHALL allow Users to join any public Channel
4. WHEN a User joins a Channel, THE Chat System SHALL add the User to the Channel membership list
5. THE Chat System SHALL update the User's Channel list in real-time when they join a new Channel

### Requirement 6: ダイレクトメッセージ

**User Story:** As a User, I want to send Direct Messages to specific Users, so that I can have private one-on-one conversations

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to initiate a Direct Message conversation with any other User
2. THE Chat System SHALL create a unique DM conversation between two Users
3. THE Chat System SHALL enforce Row Level Security policies to ensure only the two participating Users can access their DM conversation
4. THE Chat System SHALL display DM conversations separately from Channel conversations in the user interface
5. WHEN a User receives a new DM, THE Chat System SHALL notify the User in real-time

### Requirement 7: テキストメッセージ送信

**User Story:** As a User, I want to send text messages in Channels and DMs, so that I can communicate with other Users

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to send text messages in Channels they are members of
2. THE Chat System SHALL allow Users to send text messages in their DM conversations
3. WHEN a User sends a message, THE Chat System SHALL display the message optimistically in the UI before server confirmation
4. WHEN a User sends a message, THE Chat System SHALL broadcast the message to all other Users in the Channel or DM using Supabase Realtime
5. THE Chat System SHALL validate message text length does not exceed 4000 characters
6. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only send messages to Channels or DMs they have access to

### Requirement 8: 画像・ファイル添付

**User Story:** As a User, I want to attach images and files to my messages, so that I can share visual content and documents with other Users

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to attach image files (JPEG, PNG, GIF, WebP) to messages
2. THE Chat System SHALL allow Users to attach document files (PDF, DOCX, XLSX, TXT) to messages
3. THE Chat System SHALL support drag-and-drop file upload in the message composition interface
4. WHEN a User attaches a file, THE Chat System SHALL upload the file to Supabase Storage
5. WHEN a User attaches a file, THE Chat System SHALL validate the file size does not exceed 10 megabytes
6. THE Chat System SHALL display image attachments inline in the message thread
7. THE Chat System SHALL display document attachments as downloadable links
8. THE Chat System SHALL enforce Row Level Security policies on Supabase Storage to ensure only authorized Users can access uploaded files

### Requirement 9: 既読機能

**User Story:** As a User, I want to see who has read my messages and when, so that I know my messages have been acknowledged

#### Acceptance Criteria

1. WHEN a User views a message, THE Chat System SHALL record a read receipt with the User ID and timestamp
2. THE Chat System SHALL display read receipt indicators on messages showing which Users have read them
3. THE Chat System SHALL display the timestamp of when each User read the message
4. THE Chat System SHALL update read receipt indicators in real-time using Supabase Realtime
5. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only create read receipts for messages they have access to

### Requirement 10: 入力中インジケーター

**User Story:** As a User, I want to see when other Users are typing a message, so that I know a response is coming

#### Acceptance Criteria

1. WHEN a User types in the message input field, THE Chat System SHALL broadcast a typing indicator to other Users in the same Channel or DM
2. THE Chat System SHALL display "User is typing..." text when another User is typing
3. WHEN a User stops typing for 3 seconds, THE Chat System SHALL remove the typing indicator
4. WHEN a User sends a message, THE Chat System SHALL immediately remove the typing indicator
5. THE Chat System SHALL implement typing indicators using Supabase Presence or Realtime broadcast

### Requirement 11: メッセージ編集

**User Story:** As a User, I want to edit my previously sent messages, so that I can correct mistakes or update information

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to edit their own messages
2. WHEN a User edits a message, THE Chat System SHALL update the message content in the database
3. WHEN a User edits a message, THE Chat System SHALL broadcast the updated message to all other Users using Supabase Realtime
4. THE Chat System SHALL display an "edited" indicator on messages that have been modified
5. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only edit their own messages

### Requirement 12: メッセージ削除

**User Story:** As a User, I want to delete my previously sent messages, so that I can remove content I no longer want visible

#### Acceptance Criteria

1. THE Chat System SHALL allow Users to delete their own messages
2. WHEN a User deletes a message, THE Chat System SHALL remove the message from the database or mark it as deleted
3. WHEN a User deletes a message, THE Chat System SHALL broadcast the deletion to all other Users using Supabase Realtime
4. THE Chat System SHALL remove deleted messages from the UI for all Users
5. THE Chat System SHALL enforce Row Level Security policies to ensure Users can only delete their own messages

### Requirement 13: 無限スクロール

**User Story:** As a User, I want to scroll through message history with automatic loading of older messages, so that I can review past conversations efficiently

#### Acceptance Criteria

1. WHEN a User scrolls to the top of the message list, THE Chat System SHALL load the next 50 older messages
2. THE Chat System SHALL display a loading indicator while fetching older messages
3. THE Chat System SHALL maintain the User's scroll position after loading older messages
4. THE Chat System SHALL cache loaded messages to avoid redundant server requests
5. WHEN no more messages are available, THE Chat System SHALL display an indicator that the beginning of the conversation has been reached

### Requirement 14: レスポンシブデザイン

**User Story:** As a User, I want to use the Chat System on mobile devices, so that I can communicate on the go

#### Acceptance Criteria

1. THE Chat System SHALL display a mobile-optimized layout on devices with screen width less than 768 pixels
2. THE Chat System SHALL provide a collapsible sidebar for Channel and DM navigation on mobile devices
3. THE Chat System SHALL ensure all interactive elements have touch-friendly sizes (minimum 44x44 pixels)
4. THE Chat System SHALL adapt the message composition interface for mobile keyboards
5. THE Chat System SHALL maintain full functionality on mobile devices including file upload and image preview

### Requirement 15: 型安全性とバリデーション

**User Story:** As a Developer, I want comprehensive type safety and validation, so that I can prevent runtime errors and ensure data integrity

#### Acceptance Criteria

1. THE Chat System SHALL use TypeScript with strict mode enabled for all source code
2. THE Chat System SHALL use Zod schemas to validate all user input on the client side
3. THE Chat System SHALL use Zod schemas to validate all data received from Supabase on the client side
4. THE Chat System SHALL use React Hook Form with Zod resolver for all form handling
5. THE Chat System SHALL generate TypeScript types from Supabase database schema

### Requirement 16: テストカバレッジ

**User Story:** As a Developer, I want comprehensive test coverage, so that I can confidently refactor and extend the codebase

#### Acceptance Criteria

1. THE Chat System SHALL include unit tests for all custom React hooks using Vitest
2. THE Chat System SHALL include unit tests for all utility functions using Vitest
3. THE Chat System SHALL include unit tests for all Zod validation schemas using Vitest
4. THE Chat System SHALL include end-to-end tests for critical user flows using Playwright
5. THE Chat System SHALL achieve minimum 80 percent code coverage for business logic

### Requirement 17: パフォーマンス最適化

**User Story:** As a User, I want the Chat System to respond instantly to my actions, so that I have a smooth and responsive experience

#### Acceptance Criteria

1. WHEN a User sends a message, THE Chat System SHALL display the message in the UI within 100 milliseconds using optimistic updates
2. THE Chat System SHALL use TanStack Query for caching and automatic background refetching of data
3. THE Chat System SHALL implement virtual scrolling for message lists exceeding 100 messages
4. THE Chat System SHALL lazy load images in the message thread
5. THE Chat System SHALL prefetch Channel data when a User hovers over a Channel in the sidebar

### Requirement 18: セキュリティとRLS

**User Story:** As a System Administrator, I want database-level security policies, so that data access is controlled even if application code has vulnerabilities

#### Acceptance Criteria

1. THE Chat System SHALL implement Row Level Security policies on all Supabase tables
2. THE Chat System SHALL ensure Users can only read messages from Channels they are members of through RLS policies
3. THE Chat System SHALL ensure Users can only read DM messages where they are a participant through RLS policies
4. THE Chat System SHALL ensure Users can only insert messages into Channels or DMs they have access to through RLS policies
5. THE Chat System SHALL ensure Users can only update or delete their own messages through RLS policies
6. THE Chat System SHALL ensure Users can only access files in Supabase Storage that belong to Channels or DMs they have access to through storage policies
