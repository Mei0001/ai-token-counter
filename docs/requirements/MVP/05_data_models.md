# データモデル定義

## 1. プロバイダー情報

### 1.1 Provider
```typescript
interface Provider {
  id: string;              // "openai", "google", "anthropic"
  name: string;            // "OpenAI", "Google", "Anthropic"
  displayName: string;     // 表示用名称
  models: Model[];         // 提供モデルリスト
}
```

## 2. モデル情報

### 2.1 Model
```typescript
interface Model {
  id: string;              // "gpt-4", "claude-3-opus", etc.
  providerId: string;      // 所属プロバイダーID
  name: string;            // モデル名
  displayName: string;     // 表示用名称
  tokenizer: string;       // 使用するトークナイザー識別子
  maxTokens: number;       // 最大トークン数
  pricing: Pricing;        // 料金情報
  features: ModelFeatures; // モデルの機能
}
```

### 2.2 ModelFeatures
```typescript
interface ModelFeatures {
  supportsSystemPrompt: boolean;  // システムプロンプト対応
  supportsThinking: boolean;      // 思考トークン対応
  supportsFunctionCalling: boolean; // Function Calling対応
}
```

## 3. 料金情報

### 3.1 Pricing
```typescript
interface Pricing {
  currency: "USD";         // 基準通貨（USD固定）
  input: number;          // 入力トークン単価（per 1M tokens）
  output: number;         // 出力トークン単価（per 1M tokens）
  thinking?: number;      // 思考トークン単価（対応モデルのみ）
  updatedAt: string;      // 最終更新日時（ISO 8601）
}
```

### 3.2 ExchangeRate
```typescript
interface ExchangeRate {
  base: "USD";            // 基準通貨
  target: "JPY";          // 変換先通貨
  rate: number;           // 為替レート
  updatedAt: string;      // 最終更新日時（ISO 8601）
}
```

## 4. 計算関連

### 4.1 TextAnalysis
```typescript
interface TextAnalysis {
  text: string;           // 入力テキスト
  characterCount: number; // 文字数（スペース含む）
  characterCountNoSpace: number; // 文字数（スペース除く）
  wordCount: number;      // ワード数
  lineCount: number;      // 行数
}
```

### 4.2 TokenCount
```typescript
interface TokenCount {
  modelId: string;        // モデルID
  input: number;          // 入力トークン数
  output: number;         // 出力トークン数（推定）
  thinking: number;       // 思考トークン数（推定）
  total: number;          // 合計トークン数
}
```

### 4.3 CostEstimate
```typescript
interface CostEstimate {
  modelId: string;        // モデルID
  tokenCount: TokenCount; // トークン数
  costs: {
    input: CurrencyAmount;   // 入力コスト
    output: CurrencyAmount;  // 出力コスト
    thinking?: CurrencyAmount; // 思考コスト
    total: CurrencyAmount;   // 合計コスト
  };
}
```

### 4.4 CurrencyAmount
```typescript
interface CurrencyAmount {
  usd: number;            // USD金額
  jpy: number;            // JPY金額
}
```

## 5. アプリケーション状態

### 5.1 AppState
```typescript
interface AppState {
  // 入力状態
  inputText: string;
  selectedModels: string[]; // 選択中のモデルID配列（最大3つ）
  
  // 計算結果
  textAnalysis: TextAnalysis | null;
  tokenCounts: TokenCount[];
  costEstimates: CostEstimate[];
  
  // 設定
  displayCurrency: "JPY" | "USD" | "BOTH";
  exchangeRate: ExchangeRate;
  
  // UI状態
  isCalculating: boolean;
  error: string | null;
}
```

## 6. 設定データ

### 6.1 AppConfig
```typescript
interface AppConfig {
  providers: Provider[];
  defaultExchangeRate: number; // デフォルト為替レート
  maxInputLength: number;      // 最大入力文字数
  maxCompareModels: number;    // 最大比較モデル数
  debounceDelay: number;       // デバウンス遅延（ms）
}
```

## 7. データ保存形式

### 7.1 料金マスターデータ (pricing-data.json)
```json
{
  "version": "1.0.0",
  "updatedAt": "2024-01-15T00:00:00Z",
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "models": [
        {
          "id": "gpt-4",
          "name": "GPT-4",
          "pricing": {
            "input": 30.0,
            "output": 60.0
          }
        }
      ]
    }
  ]
}
```

### 7.2 サンプルテキストデータ (sample-texts.json)
```json
{
  "samples": [
    {
      "id": "greeting_ja",
      "title": "挨拶（日本語）",
      "text": "こんにちは、お元気ですか？",
      "language": "ja"
    },
    {
      "id": "greeting_en",
      "title": "Greeting (English)",
      "text": "Hello, how are you?",
      "language": "en"
    }
  ]
}
```

## 8. エラー定義

### 8.1 ErrorType
```typescript
enum ErrorType {
  NETWORK_ERROR = "NETWORK_ERROR",
  TOKENIZER_ERROR = "TOKENIZER_ERROR",
  EXCHANGE_RATE_ERROR = "EXCHANGE_RATE_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}
```

### 8.2 AppError
```typescript
interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: string;
}
```