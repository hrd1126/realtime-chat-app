# Implementation Plan

- [ ] 1. プロジェクト初期化とツール設定
  - Next.js 15プロジェクトを作成し、TypeScript、Tailwind CSS、ESLint、Prettierを設定
  - Husky、lint-stagedを設定してコミット前の自動チェックを有効化
  - package.jsonにスクリプト（lint、format、type-check、test）を追加
  - .gitignoreと.env.localのテンプレートを作成
  - _Requirements: 15.1, 15.2_

- [ ] 2. Supabaseプロジェクト設定とデータベーススキーマ
  - [ ] 2.1 Supabaseクライアント設定
    - Supabaseクライアントライブラリをインストール
    - lib/supabase/client.tsとlib/supabase/server.tsを作成
    - 環境変数（NEXT_PUBLIC_SUPABASE_URL、NEXT_PUBLIC_SUPABASE_ANON_KEY）を設定
    - _Requirements: 1.4_

  - [ ] 2.2 データベーステーブル作成
    - usersテーブルのマイグレーションを作成
    - channelsテーブルのマイグレーションを作成
    - channel_membersテーブルのマイグレーションを作成
    - direct_messagesテーブルのマイグレーションを作成
    - messagesテーブルとインデックスのマイグレーションを作成
    - message_attachmentsテーブルのマイグレーションを作成
    - read_receiptsテーブルとインデックスのマイグレーションを作成
    - _Requirements: 4.5, 6.3, 7.6, 8.8, 9.5, 18.2, 18.3, 18.4_

  - [ ] 2.3 Row Level Security (RLS) ポリシー実装
    - usersテーブルのRLSポリシーを作成（閲覧は全員、更新は本人のみ）
    - channelsテーブルのRLSポリシーを作成（メンバーのみ閲覧可能）
    - channel_membersテーブルのRLSポリシーを作成
    - direct_messagesテーブルのRLSポリシーを作成（参加者のみ閲覧可能）
    - messagesテーブルのRLSポリシーを作成（チャンネル/DMメンバーのみアクセス可能）
    - message_attachmentsテーブルのRLSポリシーを作成
    - read_receiptsテーブルのRLSポリシーを作成
    - _Requirements: 1.5, 2.6, 4.5, 6.3, 7.6, 8.8, 9.5, 11.5, 12.5, 18.1, 18.2, 18.3, 18.4, 18.5_

  - [ ] 2.4 Supabase Storageバケット設定
    - avatarsバケットを作成し、RLSポリシーを設定（公開読み取り、本人のみ書き込み）
    - message-attachmentsバケットを作成し、RLSポリシーを設定（メンバーのみアクセス）
    - _Requirements: 2.3, 2.4, 2.5, 8.4, 8.8, 18.6_

  - [ ] 2.5 TypeScript型生成
    - Supabase CLIを使用してデータベーススキーマからTypeScript型を生成
    - types/database.types.tsファイルを作成
    - カスタム型（Message、Channel、DirectMessageなど）をtypes/index.tsに定義
    - _Requirements: 15.5_

- [ ] 3. バリデーションスキーマとユーティリティ
  - [ ] 3.1 Zodバリデーションスキーマ作成
    - lib/validations/auth.tsにloginSchema、signupSchemaを作成
    - lib/validations/profile.tsにprofileSchemaを作成
    - lib/validations/channel.tsにchannelSchemaを作成
    - lib/validations/message.tsにmessageSchemaを作成
    - lib/validations/file.tsにfileUploadSchemaを作成
    - _Requirements: 15.2, 15.3_

  - [ ] 3.2 バリデーションスキーマのユニットテスト
    - tests/unit/validations/auth.test.tsを作成
    - tests/unit/validations/profile.test.tsを作成
    - tests/unit/validations/channel.test.tsを作成
    - tests/unit/validations/message.test.tsを作成
    - tests/unit/validations/file.test.tsを作成
    - _Requirements: 16.3_

  - [ ] 3.3 ユーティリティ関数作成
    - lib/utils/file-upload.tsにuploadFile関数を実装
    - lib/utils/error-handling.tsにカスタムエラークラスを定義
    - lib/utils/format.tsに日付フォーマット、テキスト省略などのヘルパー関数を実装
    - _Requirements: 2.3, 2.4, 8.4_

  - [ ] 3.4 ユーティリティ関数のユニットテスト
    - tests/unit/utils/file-upload.test.tsを作成
    - tests/unit/utils/format.test.tsを作成
    - _Requirements: 16.2_


- [ ] 4. 認証機能の実装
  - [ ] 4.1 認証コンテキストとフック
    - lib/contexts/AuthContext.tsxを作成し、認証状態を管理
    - lib/hooks/useAuth.tsを作成し、ログイン、ログアウト、ユーザー情報取得機能を実装
    - Supabase Authのセッション管理を統合
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [ ] 4.2 ログインページ実装
    - app/(auth)/login/page.tsxを作成
    - components/auth/LoginForm.tsxを作成し、React Hook FormとZodを統合
    - メールアドレス/パスワード認証を実装
    - エラーハンドリングとトースト通知を追加
    - _Requirements: 1.1_

  - [ ] 4.3 サインアップページ実装
    - app/(auth)/signup/page.tsxを作成
    - components/auth/SignupForm.tsxを作成
    - ユーザー登録時にusersテーブルにプロフィールレコードを作成
    - _Requirements: 1.1, 1.4_

  - [ ] 4.4 OAuth認証実装
    - components/auth/OAuthButtons.tsxを作成
    - GitHub OAuthボタンを実装
    - Google OAuthボタンを実装
    - OAuth認証後のコールバック処理を実装
    - _Requirements: 1.2, 1.3_

  - [ ] 4.5 認証ミドルウェア
    - middleware.tsを作成し、保護されたルートへのアクセス制御を実装
    - 未認証ユーザーをログインページにリダイレクト
    - _Requirements: 1.4_

  - [ ] 4.6 認証フックのユニットテスト
    - tests/unit/hooks/useAuth.test.tsを作成
    - ログイン、ログアウト、セッション管理のテストを実装
    - _Requirements: 16.1_

- [ ] 5. UIコンポーネントライブラリのセットアップ
  - Shadcn/uiの初期化とコンポーネントのインストール
  - Button、Input、Textarea、Dialog、Toast、Avatar、Dropdown Menuコンポーネントをインストール
  - components/ui/ディレクトリにコンポーネントを配置
  - Tailwind CSSのカスタムテーマを設定
  - _Requirements: 14.1, 14.2, 14.3_

- [ ] 6. ユーザープロフィール管理
  - [ ] 6.1 プロフィール編集ページ
    - app/(chat)/profile/page.tsxを作成
    - components/profile/ProfileEditor.tsxを作成
    - 表示名、自己紹介の編集フォームを実装（React Hook Form + Zod）
    - _Requirements: 2.1, 2.2, 2.6_

  - [ ] 6.2 アバター画像アップロード
    - components/profile/AvatarUpload.tsxを作成
    - ドラッグ&ドロップ機能を実装
    - 画像プレビュー機能を実装
    - Supabase Storageへのアップロード処理を実装
    - ファイルタイプとサイズのバリデーションを実装
    - _Requirements: 2.3, 2.4, 2.5_

  - [ ] 6.3 プロフィール更新ロジック
    - lib/hooks/useProfile.tsを作成
    - TanStack Queryを使用してプロフィール取得と更新を実装
    - 楽観的更新を実装
    - _Requirements: 2.6, 17.2_

  - [ ] 6.4 プロフィール機能のユニットテスト
    - tests/unit/hooks/useProfile.test.tsを作成
    - _Requirements: 16.1_

- [ ] 7. TanStack Query設定とキャッシュ管理
  - app/providers.tsxを作成し、QueryClientProviderを設定
  - lib/query-client.tsにQueryClientの設定を定義（staleTime、cacheTime、retryなど）
  - app/layout.tsxにProvidersを統合
  - _Requirements: 17.2_

- [ ] 8. チャンネル機能の実装
  - [ ] 8.1 チャンネル一覧とサイドバー
    - components/chat/ChannelSidebar.tsxを作成
    - lib/hooks/useChannels.tsを作成し、チャンネル一覧取得を実装
    - チャンネルリストの表示とアクティブチャンネルのハイライトを実装
    - _Requirements: 4.5, 5.2_

  - [ ] 8.2 チャンネル作成機能
    - components/chat/CreateChannelDialog.tsxを作成
    - チャンネル作成フォーム（名前、説明）を実装
    - TanStack Queryのmutationで楽観的更新を実装
    - チャンネル作成時に自動的にchannel_membersに追加
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 17.1_

  - [ ] 8.3 チャンネル検索機能
    - components/chat/ChannelSearch.tsxを作成
    - チャンネル名と説明で検索できる機能を実装
    - 検索結果の表示とフィルタリングを実装
    - _Requirements: 5.1, 5.2_

  - [ ] 8.4 チャンネル参加機能
    - チャンネル一覧から参加ボタンを実装
    - lib/hooks/useChannels.tsにjoinChannel関数を追加
    - 参加後にリアルタイムでサイドバーを更新
    - _Requirements: 5.3, 5.4, 5.5_

  - [ ] 8.5 チャンネルページレイアウト
    - app/(chat)/channels/[id]/page.tsxを作成
    - components/chat/ChannelHeader.tsxを作成（チャンネル名、説明、メンバー数を表示）
    - _Requirements: 4.5_

  - [ ] 8.6 チャンネル機能のユニットテスト
    - tests/unit/hooks/useChannels.test.tsを作成
    - チャンネル作成、参加、検索のテストを実装
    - _Requirements: 16.1_


- [ ] 9. メッセージ送受信機能の実装
  - [ ] 9.1 メッセージ一覧表示
    - components/chat/MessageList.tsxを作成
    - lib/hooks/useMessages.tsを作成し、メッセージ取得を実装
    - TanStack Queryでページネーション（無限スクロール）を実装
    - メッセージを時系列順に表示
    - _Requirements: 7.1, 7.2, 13.1, 13.4_

  - [ ] 9.2 メッセージアイテムコンポーネント
    - components/chat/MessageItem.tsxを作成
    - ユーザー名、アバター、タイムスタンプ、メッセージ内容を表示
    - 自分のメッセージと他人のメッセージで表示を区別
    - _Requirements: 7.1_

  - [ ] 9.3 メッセージ入力コンポーネント
    - components/chat/MessageInput.tsxを作成
    - テキストエリアとEnterキーでの送信を実装
    - Shift+Enterで改行を実装
    - 送信中の状態表示を実装
    - _Requirements: 7.1, 7.2_

  - [ ] 9.4 メッセージ送信ロジック
    - lib/hooks/useMessages.tsにsendMessage関数を実装
    - TanStack Queryのmutationで楽観的更新を実装
    - 送信失敗時のロールバック処理を実装
    - _Requirements: 7.3, 7.4, 7.5, 17.1_

  - [ ] 9.5 Realtimeメッセージ購読
    - lib/hooks/useRealtimeMessages.tsを作成
    - Supabase Realtimeで新規メッセージのINSERTイベントを購読
    - 新規メッセージをTanStack Queryのキャッシュに追加
    - _Requirements: 7.4_

  - [ ] 9.6 メッセージ機能のユニットテスト
    - tests/unit/hooks/useMessages.test.tsを作成
    - メッセージ送信、楽観的更新、ロールバックのテストを実装
    - _Requirements: 16.1_

- [ ] 10. 無限スクロールの実装
  - [ ] 10.1 無限スクロールロジック
    - lib/hooks/useMessages.tsにuseInfiniteQueryを使用した無限スクロールを実装
    - スクロール位置が上部に達したら次のページを読み込む
    - ローディングインジケーターを表示
    - _Requirements: 13.1, 13.2_

  - [ ] 10.2 スクロール位置の維持
    - 新しいメッセージ読み込み後もスクロール位置を維持
    - 最下部にいる場合は新規メッセージで自動スクロール
    - _Requirements: 13.3_

  - [ ] 10.3 仮想スクロール最適化
    - @tanstack/react-virtualをインストール
    - MessageListに仮想スクロールを実装（100件以上のメッセージで有効化）
    - _Requirements: 17.3_

  - [ ] 10.4 終端表示
    - これ以上メッセージがない場合の表示を実装
    - _Requirements: 13.5_

- [ ] 11. 画像・ファイル添付機能
  - [ ] 11.1 ファイル選択とドラッグ&ドロップ
    - components/chat/FileUpload.tsxを作成
    - ファイル選択ボタンを実装
    - ドラッグ&ドロップエリアを実装
    - 複数ファイルの選択をサポート
    - _Requirements: 8.3_

  - [ ] 11.2 ファイルアップロード処理
    - lib/utils/file-upload.tsのuploadFile関数を使用
    - Supabase Storageへのアップロードを実装
    - アップロード進捗表示を実装
    - ファイルタイプとサイズのバリデーションを実装
    - _Requirements: 8.1, 8.2, 8.4, 8.5_

  - [ ] 11.3 添付ファイル付きメッセージ送信
    - MessageInputにファイル添付機能を統合
    - メッセージ送信時にmessage_attachmentsテーブルにレコードを作成
    - _Requirements: 8.4_

  - [ ] 11.4 添付ファイルの表示
    - components/chat/MessageAttachment.tsxを作成
    - 画像ファイルはインライン表示（lazy loading）
    - ドキュメントファイルはダウンロードリンクとして表示
    - _Requirements: 8.6, 8.7, 17.4_

  - [ ] 11.5 ファイルアップロードのユニットテスト
    - tests/unit/utils/file-upload.test.tsを作成
    - バリデーション、アップロード処理のテストを実装
    - _Requirements: 16.2_

- [ ] 12. メッセージ編集・削除機能
  - [ ] 12.1 メッセージ編集UI
    - MessageItemに編集ボタンを追加（自分のメッセージのみ）
    - 編集モードでテキストエリアを表示
    - 編集のキャンセルと保存ボタンを実装
    - _Requirements: 11.1_

  - [ ] 12.2 メッセージ編集ロジック
    - lib/hooks/useMessages.tsにeditMessage関数を実装
    - TanStack Queryのmutationで楽観的更新を実装
    - 編集後に"edited"インジケーターを表示
    - _Requirements: 11.2, 11.3, 11.4, 11.5_

  - [ ] 12.3 メッセージ削除UI
    - MessageItemに削除ボタンを追加（自分のメッセージのみ）
    - 削除確認ダイアログを実装
    - _Requirements: 12.1_

  - [ ] 12.4 メッセージ削除ロジック
    - lib/hooks/useMessages.tsにdeleteMessage関数を実装
    - TanStack Queryのmutationで楽観的更新を実装
    - 削除されたメッセージをUIから即座に削除
    - _Requirements: 12.2, 12.3, 12.4, 12.5_

  - [ ] 12.5 Realtime編集・削除の購読
    - lib/hooks/useRealtimeMessages.tsにUPDATEとDELETEイベントの購読を追加
    - 他のユーザーの編集・削除をリアルタイムで反映
    - _Requirements: 11.3, 12.3_


- [ ] 13. ダイレクトメッセージ (DM) 機能
  - [ ] 13.1 DM一覧表示
    - ChannelSidebarにDMセクションを追加
    - lib/hooks/useDirectMessages.tsを作成し、DM一覧取得を実装
    - 各DMの相手ユーザー情報と最新メッセージを表示
    - _Requirements: 6.1, 6.4_

  - [ ] 13.2 DM開始機能
    - components/chat/StartDMDialog.tsxを作成
    - ユーザー検索機能を実装
    - 選択したユーザーとのDMを作成または既存のDMを開く
    - _Requirements: 6.1, 6.2_

  - [ ] 13.3 DMページ
    - app/(chat)/dm/[id]/page.tsxを作成
    - MessageListとMessageInputを再利用（type='dm'で動作）
    - DMヘッダーに相手ユーザーの情報を表示
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 13.4 DM通知
    - 新しいDMメッセージ受信時にサイドバーで未読バッジを表示
    - _Requirements: 6.5_

  - [ ] 13.5 DM機能のユニットテスト
    - tests/unit/hooks/useDirectMessages.test.tsを作成
    - _Requirements: 16.1_

- [ ] 14. オンライン/オフライン状態 (Presence)
  - [ ] 14.1 Presenceフック実装
    - lib/hooks/usePresence.tsを作成
    - Supabase Presenceを使用してオンライン状態を追跡
    - ユーザーがサインインしたらオンライン状態を送信
    - ユーザーがサインアウトまたは接続を失ったらオフライン状態に更新
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ] 14.2 オンライン状態の表示
    - components/shared/OnlineIndicator.tsxを作成
    - ユーザー名の横にオンライン/オフラインのインジケーターを表示
    - ChannelSidebarとMessageItemに統合
    - _Requirements: 3.4_

  - [ ] 14.3 リアルタイム更新
    - Presenceの変更をリアルタイムで購読
    - オンライン状態の変更を即座にUIに反映
    - _Requirements: 3.5_

  - [ ] 14.4 Presenceのユニットテスト
    - tests/unit/hooks/usePresence.test.tsを作成
    - _Requirements: 16.1_

- [ ] 15. 入力中インジケーター
  - [ ] 15.1 入力中インジケーターフック
    - lib/hooks/useTypingIndicator.tsを作成
    - Supabase Realtimeのbroadcast機能を使用
    - ユーザーが入力を開始したらtyping イベントを送信
    - 3秒間入力がなければ自動的に停止
    - _Requirements: 10.1, 10.3, 10.4_

  - [ ] 15.2 入力中インジケーターUI
    - components/chat/TypingIndicator.tsxを作成
    - "○○さんが入力中..."のテキストを表示
    - 複数ユーザーが入力中の場合も対応
    - _Requirements: 10.2_

  - [ ] 15.3 MessageInputへの統合
    - MessageInputのonChangeイベントでstartTypingを呼び出し
    - メッセージ送信時にstopTypingを呼び出し
    - _Requirements: 10.1, 10.4_

  - [ ] 15.4 入力中イベントの購読
    - lib/hooks/useTypingIndicator.tsで他のユーザーのtyping イベントを購読
    - 入力中ユーザーのリストを管理
    - _Requirements: 10.5_

  - [ ] 15.5 入力中インジケーターのユニットテスト
    - tests/unit/hooks/useTypingIndicator.test.tsを作成
    - _Requirements: 16.1_

- [ ] 16. 既読機能 (Read Receipts)
  - [ ] 16.1 既読記録フック
    - lib/hooks/useReadReceipts.tsを作成
    - メッセージが画面に表示されたらread_receiptsテーブルにレコードを作成
    - Intersection Observer APIを使用してメッセージの可視性を検出
    - _Requirements: 9.1, 9.5_

  - [ ] 16.2 既読表示UI
    - components/chat/ReadReceipts.tsxを作成
    - メッセージの下に既読したユーザーのアバターを表示
    - ホバーで既読時刻を表示
    - _Requirements: 9.2, 9.3_

  - [ ] 16.3 Realtime既読更新
    - lib/hooks/useReadReceipts.tsでread_receiptsテーブルのINSERTイベントを購読
    - 新しい既読情報をリアルタイムで反映
    - _Requirements: 9.4_

  - [ ] 16.4 既読機能のユニットテスト
    - tests/unit/hooks/useReadReceipts.test.tsを作成
    - _Requirements: 16.1_

- [ ] 17. レスポンシブデザインの実装
  - [ ] 17.1 モバイルレイアウト
    - ChannelSidebarをモバイルで折りたたみ可能にする
    - ハンバーガーメニューボタンを追加
    - 768px未満でモバイルレイアウトに切り替え
    - _Requirements: 14.1, 14.2_

  - [ ] 17.2 タッチフレンドリーUI
    - すべてのボタンとインタラクティブ要素を44x44px以上に設定
    - タップ領域を拡大
    - _Requirements: 14.3_

  - [ ] 17.3 モバイルキーボード対応
    - MessageInputがフォーカスされたときにビューポートを調整
    - キーボード表示時もメッセージリストが見えるように調整
    - _Requirements: 14.4_

  - [ ] 17.4 モバイルでのファイルアップロード
    - モバイルデバイスのカメラとギャラリーからのファイル選択をサポート
    - _Requirements: 14.5_

- [ ] 18. エラーハンドリングとトースト通知
  - lib/utils/error-handling.tsのカスタムエラークラスを使用
  - components/shared/Toaster.tsxを作成（Shadcn/ui Toast使用）
  - すべてのmutationにonErrorハンドラーを追加
  - ネットワークエラー、認証エラー、バリデーションエラーに対応したメッセージを表示
  - _Requirements: 7.6, 11.5, 12.5_

- [ ] 19. パフォーマンス最適化
  - [ ] 19.1 画像の遅延読み込み
    - MessageAttachmentコンポーネントにloading="lazy"を追加
    - 画像読み込みエラー時のフォールバック画像を設定
    - _Requirements: 17.4_

  - [ ] 19.2 プリフェッチ
    - ChannelListItemにマウスホバーでチャンネルメッセージをプリフェッチ
    - queryClient.prefetchQueryを使用
    - _Requirements: 17.5_

  - [ ] 19.3 キャッシュ戦略の最適化
    - TanStack QueryのstaleTimeとcacheTimeを調整
    - 頻繁に変更されるデータ（メッセージ）と静的なデータ（ユーザープロフィール）で異なる設定を使用
    - _Requirements: 17.2_


- [ ] 20. E2Eテストの実装
  - [ ] 20.1 Playwright設定
    - Playwrightをインストールして設定
    - playwright.config.tsを作成
    - テスト用のSupabaseプロジェクトまたはローカルSupabaseを設定
    - _Requirements: 16.4_

  - [ ] 20.2 認証フローのE2Eテスト
    - tests/e2e/auth.spec.tsを作成
    - サインアップ、ログイン、ログアウトのテストを実装
    - OAuth認証のテスト（モック使用）
    - _Requirements: 16.4_

  - [ ] 20.3 チャンネル機能のE2Eテスト
    - tests/e2e/channels.spec.tsを作成
    - チャンネル作成、検索、参加のテストを実装
    - _Requirements: 16.4_

  - [ ] 20.4 メッセージ送受信のE2Eテスト
    - tests/e2e/messages.spec.tsを作成
    - メッセージ送信、編集、削除のテストを実装
    - 複数ブラウザコンテキストでリアルタイム通信をテスト
    - _Requirements: 16.4_

  - [ ] 20.5 ファイルアップロードのE2Eテスト
    - tests/e2e/file-upload.spec.tsを作成
    - 画像とドキュメントのアップロードをテスト
    - _Requirements: 16.4_

  - [ ] 20.6 DMのE2Eテスト
    - tests/e2e/direct-messages.spec.tsを作成
    - DM開始、メッセージ送信のテストを実装
    - _Requirements: 16.4_

- [ ] 21. コード品質とドキュメント
  - [ ] 21.1 JSDocコメント追加
    - すべてのカスタムフックに詳細なJSDocを追加
    - 複雑なユーティリティ関数にJSDocを追加
    - Realtime購読ロジックにインラインコメントを追加
    - _Requirements: 15.1_

  - [ ] 21.2 README作成
    - プロジェクトの概要、技術スタック、セットアップ手順を記載
    - 環境変数の設定方法を記載
    - 開発サーバーの起動方法を記載
    - テストの実行方法を記載
    - デプロイ手順を記載

  - [ ] 21.3 型安全性の最終チェック
    - TypeScriptのstrict modeが有効であることを確認
    - すべてのanyタイプを排除
    - npm run type-checkでエラーがないことを確認
    - _Requirements: 15.1_

- [ ] 22. CI/CDパイプラインの設定
  - [ ] 22.1 GitHub Actions設定
    - .github/workflows/ci.ymlを作成
    - Lint、型チェック、ユニットテストを実行するジョブを追加
    - E2Eテストを実行するジョブを追加（オプション）
    - _Requirements: 16.5_

  - [ ] 22.2 デプロイ設定
    - Vercelへのデプロイ設定を追加
    - 環境変数の設定手順をドキュメント化
    - プレビューデプロイとプロダクションデプロイの設定

- [ ] 23. 最終統合とテスト
  - [ ] 23.1 全機能の統合テスト
    - すべての機能が正しく連携していることを手動で確認
    - チャンネル作成→メッセージ送信→編集→削除の一連のフローをテスト
    - DM開始→メッセージ送信→ファイル添付のフローをテスト
    - 複数ブラウザでリアルタイム同期を確認

  - [ ] 23.2 パフォーマンステスト
    - 大量のメッセージ（1000件以上）での動作を確認
    - 仮想スクロールが正しく機能することを確認
    - ページ読み込み時間を測定

  - [ ] 23.3 セキュリティ監査
    - すべてのテーブルでRLSが有効であることを確認
    - Supabase Storageのポリシーが正しく設定されていることを確認
    - XSS、CSRF対策が実装されていることを確認
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_

  - [ ] 23.4 アクセシビリティチェック
    - キーボードナビゲーションが機能することを確認
    - スクリーンリーダーでの使用を確認
    - カラーコントラストが適切であることを確認
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ] 23.5 ブラウザ互換性テスト
    - Chrome、Firefox、Safari、Edgeでの動作を確認
    - モバイルブラウザ（iOS Safari、Chrome Mobile）での動作を確認
    - _Requirements: 14.5_
