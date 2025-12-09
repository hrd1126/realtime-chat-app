# Implementation Plan

- [x] 1. プロジェクト初期化とツール設定

  - Next.js 15 プロジェクトを作成し、TypeScript、Tailwind CSS、ESLint、Prettier を設定
  - Husky、lint-staged を設定してコミット前の自動チェックを有効化
  - package.json にスクリプト（lint、format、type-check、test）を追加
  - .gitignore と.env.local のテンプレートを作成
  - _Requirements: 15.1, 15.2_

- [ ] 2. Supabase プロジェクト設定とデータベーススキーマ

  - [x] 2.1 Supabase クライアント設定

    - Supabase クライアントライブラリをインストール
    - lib/supabase/client.ts と lib/supabase/server.ts を作成
    - 環境変数（NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY）を設定
    - _Requirements: 1.4_

  - [ ] 2.2 データベーステーブル作成

    - users テーブルのマイグレーションを作成
    - channels テーブルのマイグレーションを作成
    - channel_members テーブルのマイグレーションを作成
    - direct_messages テーブルのマイグレーションを作成
    - messages テーブルとインデックスのマイグレーションを作成
    - message_attachments テーブルのマイグレーションを作成
    - read_receipts テーブルとインデックスのマイグレーションを作成
    - _Requirements: 4.5, 6.3, 7.6, 8.8, 9.5, 18.2, 18.3, 18.4_

  - [ ] 2.3 Row Level Security (RLS) ポリシー実装

    - users テーブルの RLS ポリシーを作成（閲覧は全員、更新は本人のみ）
    - channels テーブルの RLS ポリシーを作成（メンバーのみ閲覧可能）
    - channel_members テーブルの RLS ポリシーを作成
    - direct_messages テーブルの RLS ポリシーを作成（参加者のみ閲覧可能）
    - messages テーブルの RLS ポリシーを作成（チャンネル/DM メンバーのみアクセス可能）
    - message_attachments テーブルの RLS ポリシーを作成
    - read_receipts テーブルの RLS ポリシーを作成
    - _Requirements: 1.5, 2.6, 4.5, 6.3, 7.6, 8.8, 9.5, 11.5, 12.5, 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 2.4 Supabase Storage バケット設定

    - avatars バケットを作成し、RLS ポリシーを設定（公開読み取り、本人のみ書き込み）
    - message-attachments バケットを作成し、RLS ポリシーを設定（メンバーのみアクセス）
    - _Requirements: 2.3, 2.4, 2.5, 8.4, 8.8, 18.6_

  - [ ] 2.5 TypeScript 型生成
    - Supabase CLI を使用してデータベーススキーマから TypeScript 型を生成
    - types/database.types.ts ファイルを作成
    - カスタム型（Message、Channel、DirectMessage など）を types/index.ts に定義
    - _Requirements: 15.5_

- [ ] 3. バリデーションスキーマとユーティリティ

  - [ ] 3.1 Zod バリデーションスキーマ作成

    - lib/validations/auth.ts に loginSchema、signupSchema を作成
    - lib/validations/profile.ts に profileSchema を作成
    - lib/validations/channel.ts に channelSchema を作成
    - lib/validations/message.ts に messageSchema を作成
    - lib/validations/file.ts に fileUploadSchema を作成
    - _Requirements: 15.2, 15.3_

  - [ ] 3.2 バリデーションスキーマのユニットテスト

    - tests/unit/validations/auth.test.ts を作成
    - tests/unit/validations/profile.test.ts を作成
    - tests/unit/validations/channel.test.ts を作成
    - tests/unit/validations/message.test.ts を作成
    - tests/unit/validations/file.test.ts を作成
    - _Requirements: 16.3_

  - [ ] 3.3 ユーティリティ関数作成

    - lib/utils/file-upload.ts に uploadFile 関数を実装
    - lib/utils/error-handling.ts にカスタムエラークラスを定義
    - lib/utils/format.ts に日付フォーマット、テキスト省略などのヘルパー関数を実装
    - _Requirements: 2.3, 2.4, 8.4_

  - [ ] 3.4 ユーティリティ関数のユニットテスト
    - tests/unit/utils/file-upload.test.ts を作成
    - tests/unit/utils/format.test.ts を作成
    - _Requirements: 16.2_

- [ ] 4. 認証機能の実装

  - [ ] 4.1 認証コンテキストとフック

    - lib/contexts/AuthContext.tsx を作成し、認証状態を管理
    - lib/hooks/useAuth.ts を作成し、ログイン、ログアウト、ユーザー情報取得機能を実装
    - Supabase Auth のセッション管理を統合
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 4.2 ログインページ実装

    - app/(auth)/login/page.tsx を作成
    - components/auth/LoginForm.tsx を作成し、React Hook Form と Zod を統合
    - メールアドレス/パスワード認証を実装
    - エラーハンドリングとトースト通知を追加
    - _Requirements: 1.1_

  - [ ] 4.3 サインアップページ実装

    - app/(auth)/signup/page.tsx を作成
    - components/auth/SignupForm.tsx を作成
    - ユーザー登録時に users テーブルにプロフィールレコードを作成
    - _Requirements: 1.1, 1.4_

  - [ ] 4.4 OAuth 認証実装

    - components/auth/OAuthButtons.tsx を作成
    - GitHub OAuth ボタンを実装
    - Google OAuth ボタンを実装
    - OAuth 認証後のコールバック処理を実装
    - _Requirements: 1.2, 1.3_

  - [ ] 4.5 認証ミドルウェア

    - middleware.ts を作成し、保護されたルートへのアクセス制御を実装
    - 未認証ユーザーをログインページにリダイレクト
    - _Requirements: 1.4_

  - [ ] 4.6 認証フックのユニットテスト
    - tests/unit/hooks/useAuth.test.ts を作成
    - ログイン、ログアウト、セッション管理のテストを実装
    - _Requirements: 16.1_

- [ ] 5. UI コンポーネントライブラリのセットアップ

  - Shadcn/ui の初期化とコンポーネントのインストール
  - Button、Input、Textarea、Dialog、Toast、Avatar、Dropdown Menu コンポーネントをインストール
  - components/ui/ディレクトリにコンポーネントを配置
  - Tailwind CSS のカスタムテーマを設定
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 6. ユーザープロフィール管理

  - [ ] 6.1 プロフィール編集ページ

    - app/(chat)/profile/page.tsx を作成
    - components/profile/ProfileEditor.tsx を作成
    - 表示名、自己紹介の編集フォームを実装（React Hook Form + Zod）
    - _Requirements: 2.1, 2.2, 2.6_

  - [ ] 6.2 アバター画像アップロード

    - components/profile/AvatarUpload.tsx を作成
    - ドラッグ&ドロップ機能を実装
    - 画像プレビュー機能を実装
    - Supabase Storage へのアップロード処理を実装
    - ファイルタイプとサイズのバリデーションを実装
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 6.3 プロフィール更新ロジック

    - lib/hooks/useProfile.ts を作成
    - TanStack Query を使用してプロフィール取得と更新を実装
    - 楽観的更新を実装
    - _Requirements: 2.6, 17.2_

  - [ ] 6.4 プロフィール機能のユニットテスト
    - tests/unit/hooks/useProfile.test.ts を作成
    - _Requirements: 16.1_

- [ ] 7. TanStack Query 設定とキャッシュ管理

  - app/providers.tsx を作成し、QueryClientProvider を設定
  - lib/query-client.ts に QueryClient の設定を定義（staleTime、cacheTime、retry など）
  - app/layout.tsx に Providers を統合
  - _Requirements: 17.2_

- [ ] 8. チャンネル機能の実装

  - [ ] 8.1 チャンネル一覧とサイドバー

    - components/chat/ChannelSidebar.tsx を作成
    - lib/hooks/useChannels.ts を作成し、チャンネル一覧取得を実装
    - チャンネルリストの表示とアクティブチャンネルのハイライトを実装
    - _Requirements: 4.5, 5.2_

  - [ ] 8.2 チャンネル作成機能

    - components/chat/CreateChannelDialog.tsx を作成
    - チャンネル作成フォーム（名前、説明）を実装
    - TanStack Query の mutation で楽観的更新を実装
    - チャンネル作成時に自動的に channel_members に追加
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 17.1_

  - [ ] 8.3 チャンネル検索機能

    - components/chat/ChannelSearch.tsx を作成
    - チャンネル名と説明で検索できる機能を実装
    - 検索結果の表示とフィルタリングを実装
    - _Requirements: 5.1, 5.2_

  - [ ] 8.4 チャンネル参加機能

    - チャンネル一覧から参加ボタンを実装
    - lib/hooks/useChannels.ts に joinChannel 関数を追加
    - 参加後にリアルタイムでサイドバーを更新
    - _Requirements: 5.3, 5.4, 5.5_

  - [ ] 8.5 チャンネルページレイアウト

    - app/(chat)/channels/[id]/page.tsx を作成
    - components/chat/ChannelHeader.tsx を作成（チャンネル名、説明、メンバー数を表示）
    - _Requirements: 4.5_

  - [ ] 8.6 チャンネル機能のユニットテスト
    - tests/unit/hooks/useChannels.test.ts を作成
    - チャンネル作成、参加、検索のテストを実装
    - _Requirements: 16.1_

- [ ] 9. メッセージ送受信機能の実装

  - [ ] 9.1 メッセージ一覧表示

    - components/chat/MessageList.tsx を作成
    - lib/hooks/useMessages.ts を作成し、メッセージ取得を実装
    - TanStack Query でページネーション（無限スクロール）を実装
    - メッセージを時系列順に表示
    - _Requirements: 7.1, 7.2, 13.1, 13.4_

  - [ ] 9.2 メッセージアイテムコンポーネント

    - components/chat/MessageItem.tsx を作成
    - ユーザー名、アバター、タイムスタンプ、メッセージ内容を表示
    - 自分のメッセージと他人のメッセージで表示を区別
    - _Requirements: 7.1_

  - [ ] 9.3 メッセージ入力コンポーネント

    - components/chat/MessageInput.tsx を作成
    - テキストエリアと Enter キーでの送信を実装
    - Shift+Enter で改行を実装
    - 送信中の状態表示を実装
    - _Requirements: 7.1, 7.2_

  - [ ] 9.4 メッセージ送信ロジック

    - lib/hooks/useMessages.ts に sendMessage 関数を実装
    - TanStack Query の mutation で楽観的更新を実装
    - 送信失敗時のロールバック処理を実装
    - _Requirements: 7.3, 7.4, 7.5, 17.1_

  - [ ] 9.5 Realtime メッセージ購読

    - lib/hooks/useRealtimeMessages.ts を作成
    - Supabase Realtime で新規メッセージの INSERT イベントを購読
    - 新規メッセージを TanStack Query のキャッシュに追加
    - _Requirements: 7.4_

  - [ ] 9.6 メッセージ機能のユニットテスト
    - tests/unit/hooks/useMessages.test.ts を作成
    - メッセージ送信、楽観的更新、ロールバックのテストを実装
    - _Requirements: 16.1_

- [ ] 10. 無限スクロールの実装

  - [ ] 10.1 無限スクロールロジック

    - lib/hooks/useMessages.ts に useInfiniteQuery を使用した無限スクロールを実装
    - スクロール位置が上部に達したら次のページを読み込む
    - ローディングインジケーターを表示
    - _Requirements: 13.1, 13.2_

  - [ ] 10.2 スクロール位置の維持

    - 新しいメッセージ読み込み後もスクロール位置を維持
    - 最下部にいる場合は新規メッセージで自動スクロール
    - _Requirements: 13.3_

  - [ ] 10.3 仮想スクロール最適化

    - @tanstack/react-virtual をインストール
    - MessageList に仮想スクロールを実装（100 件以上のメッセージで有効化）
    - _Requirements: 17.3_

  - [ ] 10.4 終端表示
    - これ以上メッセージがない場合の表示を実装
    - _Requirements: 13.5_

- [ ] 11. 画像・ファイル添付機能

  - [ ] 11.1 ファイル選択とドラッグ&ドロップ

    - components/chat/FileUpload.tsx を作成
    - ファイル選択ボタンを実装
    - ドラッグ&ドロップエリアを実装
    - 複数ファイルの選択をサポート
    - _Requirements: 8.3_

  - [ ] 11.2 ファイルアップロード処理

    - lib/utils/file-upload.ts の uploadFile 関数を使用
    - Supabase Storage へのアップロードを実装
    - アップロード進捗表示を実装
    - ファイルタイプとサイズのバリデーションを実装
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ] 11.3 添付ファイル付きメッセージ送信

    - MessageInput にファイル添付機能を統合
    - メッセージ送信時に message_attachments テーブルにレコードを作成
    - _Requirements: 8.4_

  - [ ] 11.4 添付ファイルの表示

    - components/chat/MessageAttachment.tsx を作成
    - 画像ファイルはインライン表示（lazy loading）
    - ドキュメントファイルはダウンロードリンクとして表示
    - _Requirements: 8.6, 8.7, 17.4_

  - [ ] 11.5 ファイルアップロードのユニットテスト
    - tests/unit/utils/file-upload.test.ts を作成
    - バリデーション、アップロード処理のテストを実装
    - _Requirements: 16.2_

- [ ] 12. メッセージ編集・削除機能

  - [ ] 12.1 メッセージ編集 UI

    - MessageItem に編集ボタンを追加（自分のメッセージのみ）
    - 編集モードでテキストエリアを表示
    - 編集のキャンセルと保存ボタンを実装
    - _Requirements: 11.1_

  - [ ] 12.2 メッセージ編集ロジック

    - lib/hooks/useMessages.ts に editMessage 関数を実装
    - TanStack Query の mutation で楽観的更新を実装
    - 編集後に"edited"インジケーターを表示
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

  - [ ] 12.3 メッセージ削除 UI

    - MessageItem に削除ボタンを追加（自分のメッセージのみ）
    - 削除確認ダイアログを実装
    - _Requirements: 12.1_

  - [ ] 12.4 メッセージ削除ロジック

    - lib/hooks/useMessages.ts に deleteMessage 関数を実装
    - TanStack Query の mutation で楽観的更新を実装
    - 削除されたメッセージを UI から即座に削除
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

  - [ ] 12.5 Realtime 編集・削除の購読
    - lib/hooks/useRealtimeMessages.ts に UPDATE と DELETE イベントの購読を追加
    - 他のユーザーの編集・削除をリアルタイムで反映
    - _Requirements: 11.3, 12.3_

- [ ] 13. ダイレクトメッセージ (DM) 機能

  - [ ] 13.1 DM 一覧表示

    - ChannelSidebar に DM セクションを追加
    - lib/hooks/useDirectMessages.ts を作成し、DM 一覧取得を実装
    - 各 DM の相手ユーザー情報と最新メッセージを表示
    - _Requirements: 6.1, 6.4_

  - [ ] 13.2 DM 開始機能

    - components/chat/StartDMDialog.tsx を作成
    - ユーザー検索機能を実装
    - 選択したユーザーとの DM を作成または既存の DM を開く
    - _Requirements: 6.1, 6.2_

  - [ ] 13.3 DM ページ

    - app/(chat)/dm/[id]/page.tsx を作成
    - MessageList と MessageInput を再利用（type='dm'で動作）
    - DM ヘッダーに相手ユーザーの情報を表示
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 13.4 DM 通知

    - 新しい DM メッセージ受信時にサイドバーで未読バッジを表示
    - _Requirements: 6.5_

  - [ ] 13.5 DM 機能のユニットテスト
    - tests/unit/hooks/useDirectMessages.test.ts を作成
    - _Requirements: 16.1_

- [ ] 14. オンライン/オフライン状態 (Presence)

  - [ ] 14.1 Presence フック実装

    - lib/hooks/usePresence.ts を作成
    - Supabase Presence を使用してオンライン状態を追跡
    - ユーザーがサインインしたらオンライン状態を送信
    - ユーザーがサインアウトまたは接続を失ったらオフライン状態に更新
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 14.2 オンライン状態の表示

    - components/shared/OnlineIndicator.tsx を作成
    - ユーザー名の横にオンライン/オフラインのインジケーターを表示
    - ChannelSidebar と MessageItem に統合
    - _Requirements: 3.4_

  - [ ] 14.3 リアルタイム更新

    - Presence の変更をリアルタイムで購読
    - オンライン状態の変更を即座に UI に反映
    - _Requirements: 3.5_

  - [ ] 14.4 Presence のユニットテスト
    - tests/unit/hooks/usePresence.test.ts を作成
    - _Requirements: 16.1_

- [ ] 15. 入力中インジケーター

  - [ ] 15.1 入力中インジケーターフック

    - lib/hooks/useTypingIndicator.ts を作成
    - Supabase Realtime の broadcast 機能を使用
    - ユーザーが入力を開始したら typing イベントを送信
    - 3 秒間入力がなければ自動的に停止
    - _Requirements: 10.1, 10.3, 10.4_

  - [ ] 15.2 入力中インジケーター UI

    - components/chat/TypingIndicator.tsx を作成
    - "○○ さんが入力中..."のテキストを表示
    - 複数ユーザーが入力中の場合も対応
    - _Requirements: 10.2_

  - [ ] 15.3 MessageInput への統合

    - MessageInput の onChange イベントで startTyping を呼び出し
    - メッセージ送信時に stopTyping を呼び出し
    - _Requirements: 10.1, 10.4_

  - [ ] 15.4 入力中イベントの購読

    - lib/hooks/useTypingIndicator.ts で他のユーザーの typing イベントを購読
    - 入力中ユーザーのリストを管理
    - _Requirements: 10.5_

  - [ ] 15.5 入力中インジケーターのユニットテスト
    - tests/unit/hooks/useTypingIndicator.test.ts を作成
    - _Requirements: 16.1_

- [ ] 16. 既読機能 (Read Receipts)

  - [ ] 16.1 既読記録フック

    - lib/hooks/useReadReceipts.ts を作成
    - メッセージが画面に表示されたら read_receipts テーブルにレコードを作成
    - Intersection Observer API を使用してメッセージの可視性を検出
    - _Requirements: 9.1, 9.5_

  - [ ] 16.2 既読表示 UI

    - components/chat/ReadReceipts.tsx を作成
    - メッセージの下に既読したユーザーのアバターを表示
    - ホバーで既読時刻を表示
    - _Requirements: 9.2, 9.3_

  - [ ] 16.3 Realtime 既読更新

    - lib/hooks/useReadReceipts.ts で read_receipts テーブルの INSERT イベントを購読
    - 新しい既読情報をリアルタイムで反映
    - _Requirements: 9.4_

  - [ ] 16.4 既読機能のユニットテスト
    - tests/unit/hooks/useReadReceipts.test.ts を作成
    - _Requirements: 16.1_

- [ ] 17. レスポンシブデザインの実装

  - [ ] 17.1 モバイルレイアウト

    - ChannelSidebar をモバイルで折りたたみ可能にする
    - ハンバーガーメニューボタンを追加
    - 768px 未満でモバイルレイアウトに切り替え
    - _Requirements: 14.1, 14.2_

  - [ ] 17.2 タッチフレンドリー UI

    - すべてのボタンとインタラクティブ要素を 44x44px 以上に設定
    - タップ領域を拡大
    - _Requirements: 14.3_

  - [ ] 17.3 モバイルキーボード対応

    - MessageInput がフォーカスされたときにビューポートを調整
    - キーボード表示時もメッセージリストが見えるように調整
    - _Requirements: 14.4_

  - [ ] 17.4 モバイルでのファイルアップロード
    - モバイルデバイスのカメラとギャラリーからのファイル選択をサポート
    - _Requirements: 14.5_

- [ ] 18. エラーハンドリングとトースト通知

  - lib/utils/error-handling.ts のカスタムエラークラスを使用
  - components/shared/Toaster.tsx を作成（Shadcn/ui Toast 使用）
  - すべての mutation に onError ハンドラーを追加
  - ネットワークエラー、認証エラー、バリデーションエラーに対応したメッセージを表示
  - _Requirements: 7.6, 11.5, 12.5_

- [ ] 19. パフォーマンス最適化

  - [ ] 19.1 画像の遅延読み込み

    - MessageAttachment コンポーネントに loading="lazy"を追加
    - 画像読み込みエラー時のフォールバック画像を設定
    - _Requirements: 17.4_

  - [ ] 19.2 プリフェッチ

    - ChannelListItem にマウスホバーでチャンネルメッセージをプリフェッチ
    - queryClient.prefetchQuery を使用
    - _Requirements: 17.5_

  - [ ] 19.3 キャッシュ戦略の最適化
    - TanStack Query の staleTime と cacheTime を調整
    - 頻繁に変更されるデータ（メッセージ）と静的なデータ（ユーザープロフィール）で異なる設定を使用
    - _Requirements: 17.2_

- [ ] 20. E2E テストの実装

  - [ ] 20.1 Playwright 設定

    - Playwright をインストールして設定
    - playwright.config.ts を作成
    - テスト用の Supabase プロジェクトまたはローカル Supabase を設定
    - _Requirements: 16.4_

  - [ ] 20.2 認証フローの E2E テスト

    - tests/e2e/auth.spec.ts を作成
    - サインアップ、ログイン、ログアウトのテストを実装
    - OAuth 認証のテスト（モック使用）
    - _Requirements: 16.4_

  - [ ] 20.3 チャンネル機能の E2E テスト

    - tests/e2e/channels.spec.ts を作成
    - チャンネル作成、検索、参加のテストを実装
    - _Requirements: 16.4_

  - [ ] 20.4 メッセージ送受信の E2E テスト

    - tests/e2e/messages.spec.ts を作成
    - メッセージ送信、編集、削除のテストを実装
    - 複数ブラウザコンテキストでリアルタイム通信をテスト
    - _Requirements: 16.4_

  - [ ] 20.5 ファイルアップロードの E2E テスト

    - tests/e2e/file-upload.spec.ts を作成
    - 画像とドキュメントのアップロードをテスト
    - _Requirements: 16.4_

  - [ ] 20.6 DM の E2E テスト
    - tests/e2e/direct-messages.spec.ts を作成
    - DM 開始、メッセージ送信のテストを実装
    - _Requirements: 16.4_

- [ ] 21. コード品質とドキュメント

  - [ ] 21.1 JSDoc コメント追加

    - すべてのカスタムフックに詳細な JSDoc を追加
    - 複雑なユーティリティ関数に JSDoc を追加
    - Realtime 購読ロジックにインラインコメントを追加
    - _Requirements: 15.1_

  - [ ] 21.2 README 作成

    - プロジェクトの概要、技術スタック、セットアップ手順を記載
    - 環境変数の設定方法を記載
    - 開発サーバーの起動方法を記載
    - テストの実行方法を記載
    - デプロイ手順を記載

  - [ ] 21.3 型安全性の最終チェック
    - TypeScript の strict mode が有効であることを確認
    - すべての any タイプを排除
    - npm run type-check でエラーがないことを確認
    - _Requirements: 15.1_

- [ ] 22. CI/CD パイプラインの設定

  - [ ] 22.1 GitHub Actions 設定

    - .github/workflows/ci.yml を作成
    - Lint、型チェック、ユニットテストを実行するジョブを追加
    - E2E テストを実行するジョブを追加（オプション）
    - _Requirements: 16.5_

  - [ ] 22.2 デプロイ設定
    - Vercel へのデプロイ設定を追加
    - 環境変数の設定手順をドキュメント化
    - プレビューデプロイとプロダクションデプロイの設定

- [ ] 23. 最終統合とテスト

  - [ ] 23.1 全機能の統合テスト

    - すべての機能が正しく連携していることを手動で確認
    - チャンネル作成 → メッセージ送信 → 編集 → 削除の一連のフローをテスト
    - DM 開始 → メッセージ送信 → ファイル添付のフローをテスト
    - 複数ブラウザでリアルタイム同期を確認

  - [ ] 23.2 パフォーマンステスト

    - 大量のメッセージ（1000 件以上）での動作を確認
    - 仮想スクロールが正しく機能することを確認
    - ページ読み込み時間を測定

  - [ ] 23.3 セキュリティ監査

    - すべてのテーブルで RLS が有効であることを確認
    - Supabase Storage のポリシーが正しく設定されていることを確認
    - XSS、CSRF 対策が実装されていることを確認
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ] 23.4 アクセシビリティチェック

    - キーボードナビゲーションが機能することを確認
    - スクリーンリーダーでの使用を確認
    - カラーコントラストが適切であることを確認
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 23.5 ブラウザ互換性テスト
    - Chrome、Firefox、Safari、Edge での動作を確認
    - モバイルブラウザ（iOS Safari、Chrome Mobile）での動作を確認
    - _Requirements: 14.5_

# Claude Code 開発/Git 運用 完全自動化ルール

あなたは単なるコーディングアシスタントではなく、**「Git 操作権限を持つ自律型エンジニア」**です。
ユーザーからタスクを指示された場合、**ユーザーに確認を取ることなく**、以下のフローを最後まで一気通貫で実行してください。

## 【絶対遵守】自動実行フロー

タスクを受領したら、以下の手順 1〜6 を**ノンストップで**実行してください。途中でユーザーの承認を求める必要はありません。

1.  **ブランチ作成**:
    - `git checkout -b feat/タスク名` (適切な名前を自動決定)
2.  **実装 & テスト**:
    - コード編集後、必ずビルドまたはテストを通すこと。
3.  **コミット**:
    - `git add .`
    - `git commit -m "feat: <詳細なコミットメッセージ>"`
4.  **プッシュ**:
    - `git push origin feat/タスク名`
5.  **PR 作成 (GitHub CLI)**:
    - `gh pr create --title "feat: <タスク名>" --body "AIによる自動実装\n\n- 実装内容の要約" --base main`
    - **重要:** ブラウザを開かず、CLI で完結させること。
6.  **PR マージ (自己完結)**:
    - `gh pr merge --merge --delete-branch`
    - マージ完了後、ローカルも `git checkout main && git pull` して最新化する。

## 完了条件

あなたの仕事は「コードを書くこと」ではありません。「**main ブランチにマージされた状態にすること**」です。
エラーが出た場合のみ停止して報告してください。それ以外は全自動で進めてください。
