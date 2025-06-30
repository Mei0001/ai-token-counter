# 技術要件

## 1. アーキテクチャ

### 1.1 全体構成
- **アーキテクチャパターン**: SPA (Single Page Application)
- **デプロイメント**: 静的ホスティング（Vercel、Netlify等）

### 1.2 技術スタック
- **フロントエンド**:
  - フレームワーク: Next.js 14+ (App Router)
  - 言語: TypeScript 5+
  - UIライブラリ: Tailwind CSS + shadcn/ui
  - 状態管理: React Context API / Zustand
  
- **トークナイザー**:
  - OpenAI: tiktoken (js-tiktoken)
  - Anthropic: @anthropic-ai/tokenizer（利用可能な場合）
  - Google: 公式SDKまたは代替実装

## 2. 外部API連携

### 2.1 為替レートAPI
- **候補**:
  - ExchangeRate-API
  - Fixer.io
  - Open Exchange Rates
- **要件**:
  - 無料枠で十分な利用が可能
  - USD/JPYレートの取得
  - CORS対応またはプロキシ経由

### 2.2 トークナイザーAPI（必要に応じて）
- クライアントサイドで処理困難な場合はサーバーレス関数を使用
- Vercel Functions / Netlify Functions

## 3. パフォーマンス要件

### 3.1 レスポンス時間
- テキスト入力から結果表示まで: 1秒以内
- 初回ロード: 3秒以内

### 3.2 制限事項
- 最大入力文字数: 100,000文字
- 同時比較モデル数: 3モデルまで

## 4. ブラウザ対応

### 4.1 対応ブラウザ
- Chrome/Edge: 最新2バージョン
- Firefox: 最新2バージョン
- Safari: 最新2バージョン
- モバイルブラウザ: iOS Safari、Chrome (Android)

### 4.2 画面サイズ
- デスクトップ: 1024px以上
- タブレット: 768px〜1023px
- モバイル: 767px以下

## 5. セキュリティ要件

### 5.1 データ保護
- HTTPSでの通信
- 入力データのクライアントサイド処理
- APIキーの環境変数管理
- CSP (Content Security Policy) の設定

### 5.2 入力検証
- XSS対策: 入力値のサニタイズ
- 文字数制限の実装

## 6. 開発環境

### 6.1 必須ツール
- Node.js: 18.x以上
- npm/yarn/pnpm
- Git

### 6.2 開発ツール
- ESLint: コード品質管理
- Prettier: コードフォーマット
- Husky: Git hooks
- Jest/Vitest: ユニットテスト
- Playwright: E2Eテスト（オプション）

## 7. デプロイメント

### 7.1 CI/CD
- GitHub Actions
- 自動ビルド・デプロイ
- プレビューデプロイメント

### 7.2 環境管理
- 開発環境: localhost
- ステージング環境: プレビューURL
- 本番環境: カスタムドメイン

## 8. モニタリング

### 8.1 アナリティクス
- Google Analytics 4 / Vercel Analytics
- エラートラッキング: Sentry（オプション）

### 8.2 パフォーマンス監視
- Core Web Vitals
- Lighthouse CI

## 9. 料金データ管理

### 9.1 データ形式
- JSON形式での管理
- バージョン管理
- 更新日時の記録

### 9.2 更新方法
- 初期: 手動でJSONファイル更新
- 将来: 管理画面からの更新（Phase 2）