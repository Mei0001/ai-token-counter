# AI Token Counter

Gemini APIのトークン数を計算し、料金を見積もるWebツールです。Google AI Studioで利用可能な全モデルに対応し、無料で正確なトークン数計算が可能です。

## 🚀 Live Demo

**公開URL**: [Vercel で利用可能](https://ai-token-counter.vercel.app/) 

## ✨ 主な機能

- **🔢 正確なトークン計算**: Gemini APIの公式CountTokensを使用（完全無料）
- **💰 詳細料金見積もり**: USD/JPY対応、入力/出力/思考トークン別計算
- **📝 柔軟な出力設定**: 自動推定・トークン数指定・出力文章入力の3モード
- **📊 15モデル対応**: Gemini 2.5/2.0/1.5シリーズの全モデル
- **🎨 直感的UI**: 階層型モデル選択、簡潔な料金表、リアルタイム更新
- **🔒 セキュリティ重視**: APIキーはローカル管理、データ保存なし

## 📁 プロジェクト構成

```
ai-token-counter/
├── README.md                 # このファイル
├── docs/requirements/MVP/    # 要件定義ドキュメント
│   ├── 00_mvp_summary.md
│   ├── 01_project_overview.md
│   ├── 02_functional_requirements.md
│   ├── 03_technical_requirements.md
│   ├── 04_ui_ux_requirements.md
│   └── 05_data_models.md
├── 参考/                     # 参考資料
│   ├── Understand-and-count-tokens-Gemini-API-Google-AI-for-Developers.md
│   └── Gemini-Developer-API-Pricing-Gemini-API Google AI for Developers.md
├── ai-token-counter-app/     # メインアプリケーション
│   ├── src/
│   │   ├── components/       # UIコンポーネント
│   │   └── lib/              # ビジネスロジック
│   ├── README.md            # アプリ詳細ドキュメント
│   └── package.json
└── CLAUDE.md                # Claude Code用ガイド
```

## 🛠️ 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **API**: Google Generative AI SDK
- **デプロイ**: Vercel

## 🚀 クイックスタート

```bash
# リポジトリクローン
git clone https://github.com/your-username/ai-token-counter.git
cd ai-token-counter/ai-token-counter-app

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで `http://localhost:3000` を開いてください。

## 📖 ドキュメント

### 要件定義
- [MVP要件サマリー](docs/requirements/MVP/00_mvp_summary.md)
- [プロジェクト概要](docs/requirements/MVP/01_project_overview.md)
- [機能要件](docs/requirements/MVP/02_functional_requirements.md)
- [技術要件](docs/requirements/MVP/03_technical_requirements.md)
- [UI/UX要件](docs/requirements/MVP/04_ui_ux_requirements.md)
- [データモデル](docs/requirements/MVP/05_data_models.md)

### アプリケーション
- [アプリ詳細README](ai-token-counter-app/README.md) - 使用方法、開発、デプロイの詳細

### 開発ガイド
- [CLAUDE.md](CLAUDE.md) - Claude Code用の開発ガイド

## 🎯 対応モデル

### Gemini 2.5シリーズ
- Pro, Flash, Flash-Lite, Native Audio, TTS

### Gemini 2.0シリーズ  
- Flash, Flash-Lite, 実験版

### Gemini 1.5シリーズ
- Pro, Flash, Flash-8B

### 実験版モデル
- 最新の実験的モデル

## 💰 料金について

- **CountTokens API**: 完全無料（3000 requests/minute）
- **料金データ**: 2024年12月時点の公式料金
- **通貨対応**: USD/JPY同時表示
- **料金表**: 入力・出力・思考トークンの3列構成で見やすく整理

## 🔒 セキュリティ

- APIキーはローカルストレージのみに保存
- 入力テキストは一切保存されない
- 外部への送信なし（トークン計算APIを除く）
- Vercelでの安全な公開

## 🤝 コントリビューション

1. Issues で機能要求やバグ報告
2. Pull Request で改善提案
3. 料金情報の更新は `ai-token-counter-app/src/lib/gemini-models.ts`

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)