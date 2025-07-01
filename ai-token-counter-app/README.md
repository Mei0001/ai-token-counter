# AI Token Counter - Gemini API トークン計算ツール

Gemini APIのトークン数を正確に計算し、料金を見積もるWebアプリケーションです。

## 🌟 特長

### 正確なトークン計算
- **Gemini CountTokens API**を使用した完全無料の正確なトークン計算
- APIキーなしでも推定値での計算が可能
- リアルタイム計算（500ms debounce）

### 柔軟な出力設定
- **自動推定**: 入力の50%で自動推定
- **トークン数指定**: 数値で直接指定
- **出力文章入力**: 実際の出力文章からトークン数を計算

### 包括的なモデルサポート
- Gemini 2.5シリーズ（Pro, Flash, Flash-Lite, Native Audio, TTS）
- Gemini 2.0シリーズ（Flash, Flash-Lite, 実験版）
- Gemini 1.5シリーズ（Pro, Flash, Flash-8B）
- 実験版・プレビュー版モデル

### 詳細料金計算
- **入力トークン**: 標準・高コンテキスト・音声入力対応
- **出力トークン**: 標準・高コンテキスト・音声出力対応
- **思考トークン**: 対応モデルの思考処理コスト
- **USD/JPY**: リアルタイム為替レート対応

## 🚀 使用方法

### 1. APIキー設定（推奨）
```
1. https://aistudio.google.com/app/apikey でAPIキーを無料取得
2. アプリで「表示」ボタンをクリック
3. APIキーを入力して保存
```

### 2. テキスト入力
- メインのテキストエリアに計算したいテキストを入力
- 文字数がリアルタイムで表示されます

### 3. 出力設定選択
- **自動推定**: 何も設定せずに自動で出力を推定
- **トークン数指定**: 数値フィールドで直接指定
- **出力文章入力**: 実際の出力文章を入力してトークン数を計算

### 4. モデル選択
- 15種類のGeminiモデルから選択
- 各モデルの特徴・価格・ステータスを確認

### 5. 結果確認
- トークン数（入力・出力・思考・合計）
- 料金計算（USD・JPY）
- 基本統計（文字数・ワード数・行数）

## 🛠️ 開発

### 必要条件
- Node.js 18.0+
- npm または yarn

### セットアップ
```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プロダクション実行
npm start
```

### 環境変数
```env
# 開発時のみ（オプション）
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

**注意**: 本番環境では環境変数にAPIキーを設定しないでください。セキュリティ上の理由により、ユーザーが個別に設定することを推奨します。

## 📁 プロジェクト構造

```
src/
├── components/           # UIコンポーネント
│   ├── TokenCounter.tsx     # メインコンポーネント
│   ├── TokenInputSection.tsx # テキスト・出力設定入力
│   ├── ModelSelector.tsx    # モデル選択UI
│   ├── ResultDisplay.tsx    # 結果表示
│   └── PricingTable.tsx     # 料金表
├── lib/                  # ビジネスロジック
│   ├── token-counter.ts     # トークン計算ロジック
│   ├── gemini-models.ts     # モデル定義・料金データ
│   └── cost-calculator.ts   # 料金計算ロジック
└── app/                  # Next.js App Router
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🔧 技術仕様

### フロントエンド
- **Next.js 15**: App Router使用
- **TypeScript**: 型安全性確保
- **Tailwind CSS**: ユーティリティファーストCSS
- **Lucide React**: アイコンライブラリ

### API統合
- **@google/generative-ai**: Google公式SDK
- **CountTokens API**: 無料のトークン計算
- **localStorage**: APIキーのローカル保存

### デプロイ
- **Vercel**: 本番環境
- **Static Export**: 完全静的サイト
- **Edge Runtime**: 最適化された実行環境

## 🔒 セキュリティ

### データプライバシー
- 入力テキスト・APIキーはサーバーに保存されません
- APIキーはブラウザのlocalStorageのみに保存
- トークン計算以外の外部通信なし

### API制限
- CountTokens API: 3000リクエスト/分（無料）
- レート制限によるエラーハンドリング実装済み

## 📊 料金データ更新

料金情報は `src/lib/gemini-models.ts` で管理されています：

```typescript
// 新しいモデル追加例
{
  id: "gemini-new-model",
  displayName: "Gemini New Model",
  pricing: {
    input: 1.0,  // USD per 1M tokens
    output: 3.0,
  },
  features: {
    supportsThinking: true,
    contextWindow: "1M tokens",
  }
}
```

## 🤝 コントリビューション

1. 料金データの更新
2. 新モデル対応
3. UI/UX改善
4. バグ修正・機能追加

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Docs](https://ai.google.dev/gemini-api/docs)
- [Gemini Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Vercel Deploy](https://vercel.com/)