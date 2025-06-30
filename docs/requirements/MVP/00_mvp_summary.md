# MVP要件定義サマリー

## プロジェクト概要
AI Token Counterは、開発者向けのWebベースのトークン計算・料金見積もりツールです。

## MVP スコープ

### 対応プロバイダー・モデル
1. **OpenAI**
   - GPT-3.5-turbo, GPT-4, GPT-4-turbo, GPT-4o, GPT-4o-mini

2. **Google**
   - Gemini Pro, Gemini Flash

3. **Anthropic**
   - Claude 3 Haiku, Claude 3 Sonnet, Claude 3 Opus, Claude 3.5 Sonnet

### 主要機能
1. **テキスト分析**
   - トークン数計算（各プロバイダーの公式トークナイザー使用）
   - 文字数、ワード数、行数の表示
   - 入力/出力/思考トークンの区別

2. **料金計算**
   - 日本円・米ドルでの料金表示
   - リアルタイム為替レート取得
   - 詳細な料金内訳表示

3. **比較機能**
   - 最大3モデルの同時比較
   - 視覚的に分かりやすい比較表示

### 技術スタック
- **フロントエンド**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **トークナイザー**: 各プロバイダーの公式ライブラリ
- **ホスティング**: Vercel/Netlify（静的サイト）

### 制約事項
- テキストデータの保存なし（プライバシー重視）
- 履歴機能なし
- API提供なし
- エクスポート機能なし

## 次のステップ

### Phase 1 (MVP)
1. 基本的なトークン計算機能
2. シンプルなUI実装
3. 手動での料金データ更新

### Phase 2（将来拡張）
1. 管理画面による料金データ更新
2. ダークモード対応
3. 多言語対応（英語）
4. APIエンドポイント提供
5. 履歴・エクスポート機能

## ファイル構成
```
docs/requirements/MVP/
├── 00_mvp_summary.md          # このファイル
├── 01_project_overview.md     # プロジェクト概要
├── 02_functional_requirements.md  # 機能要件
├── 03_technical_requirements.md   # 技術要件
├── 04_ui_ux_requirements.md      # UI/UX要件
└── 05_data_models.md             # データモデル定義
```

## 開発開始前の確認事項
1. トークナイザーライブラリのライセンス確認
2. 為替レートAPIの選定と無料枠確認
3. ホスティングサービスの決定
4. ドメイン名の決定