# AI Token Counter - Gemini

Gemini APIのトークン数を計算し、料金を見積もるツールです。

## 機能

- **トークン計算**: Gemini APIを使用した正確なトークン数計算
- **料金見積もり**: USD/JPYでの料金計算
- **リアルタイム計算**: 入力に応じてリアルタイムで更新
- **推定モード**: APIキーなしでも推定値を表示

## 対応モデル

- Gemini 2.0 Flash Experimental
- Gemini Experimental 1206
- Gemini 1.5 Flash-8B
- Gemini 1.5 Flash
- Gemini 1.5 Pro

## 使用方法

1. Gemini APIキーを取得（オプション）
   - [Google AI Studio](https://aistudio.google.com/app/apikey)でAPIキーを取得
   - APIキーがない場合は推定値を表示

2. モデルを選択

3. テキストを入力

4. 結果を確認
   - 基本情報（文字数、ワード数など）
   - トークン情報（入力/出力/思考トークン）
   - 料金情報（USD/JPY）

## 開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build
```

### 環境変数

`.env.local.example`を`.env.local`にコピーして設定してください。

```
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
```

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **API**: Google Generative AI SDK
- **アイコン**: Lucide React

## 注意事項

- APIキーはクライアントサイドで使用されます
- 入力されたテキストは保存されません
- 料金情報は2024年12月時点のものです
