// Geminiモデルの定義と料金情報

export interface ModelPricing {
  input: number; // USD per 1M tokens
  output: number; // USD per 1M tokens
  inputAudio?: number; // USD per 1M tokens (audio input)
  outputAudio?: number; // USD per 1M tokens (audio output)
  contextSize?: string; // Context size description
  inputHighContext?: number; // USD per 1M tokens for high context (>128k or >200k)
  outputHighContext?: number; // USD per 1M tokens for high context
}

export interface ModelFeatures {
  supportsThinking?: boolean;
  supportsAudio?: boolean;
  supportsVideo?: boolean;
  supportsGrounding?: boolean;
  contextWindow?: string;
  description?: string;
}

export interface GeminiModel {
  id: string;
  name: string;
  displayName: string;
  category: string; // "text" | "audio" | "multimodal" | "tts"
  status: "stable" | "preview" | "experimental";
  pricing: ModelPricing;
  features: ModelFeatures;
}

export interface Provider {
  id: string;
  name: string;
  displayName: string;
  models: GeminiModel[];
}

export const GEMINI_MODELS: GeminiModel[] = [
  // Gemini 2.5 シリーズ
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    displayName: "Gemini 2.5 Pro",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 1.25,
      output: 10.0,
      inputHighContext: 2.50,
      outputHighContext: 15.0,
      contextSize: "≤200K tokens: $1.25, >200K tokens: $2.50",
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
      contextWindow: "2M tokens",
      description: "最高性能の多目的モデル、コーディングと複雑な推論に優れる",
    },
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    displayName: "Gemini 2.5 Flash",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 0.30,
      output: 2.50,
      inputAudio: 1.00,
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
      contextWindow: "1M tokens",
      description: "ハイブリッド推論モデル、思考予算をサポート",
    },
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash-Lite",
    displayName: "Gemini 2.5 Flash-Lite",
    category: "multimodal",
    status: "preview",
    pricing: {
      input: 0.10,
      output: 0.40,
      inputAudio: 0.50,
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
      contextWindow: "1M tokens",
      description: "最小・最安のモデル、大規模利用向け",
    },
  },
  {
    id: "gemini-2.5-flash-native-audio",
    name: "Gemini 2.5 Flash Native Audio",
    displayName: "Gemini 2.5 Flash Native Audio",
    category: "audio",
    status: "preview",
    pricing: {
      input: 0.50,
      output: 2.00,
      inputAudio: 3.00,
      outputAudio: 12.00,
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      description: "ネイティブオーディオモデル、高品質な音声出力",
    },
  },
  {
    id: "gemini-2.5-flash-tts",
    name: "Gemini 2.5 Flash TTS",
    displayName: "Gemini 2.5 Flash TTS",
    category: "tts",
    status: "preview",
    pricing: {
      input: 0.50,
      output: 10.00, // audio output
    },
    features: {
      supportsAudio: true,
      description: "音声合成モデル、高性能・低遅延",
    },
  },
  {
    id: "gemini-2.5-pro-tts",
    name: "Gemini 2.5 Pro TTS",
    displayName: "Gemini 2.5 Pro TTS",
    category: "tts",
    status: "preview",
    pricing: {
      input: 1.00,
      output: 20.00, // audio output
    },
    features: {
      supportsAudio: true,
      description: "Proレベルの音声合成、より自然な出力",
    },
  },

  // Gemini 2.0 シリーズ
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    displayName: "Gemini 2.0 Flash",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 0.10,
      output: 0.40,
      inputAudio: 0.70,
    },
    features: {
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
      contextWindow: "1M tokens",
      description: "バランスの取れたマルチモーダルモデル、エージェント時代向け",
    },
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash-Lite",
    displayName: "Gemini 2.0 Flash-Lite",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 0.075,
      output: 0.30,
    },
    features: {
      contextWindow: "1M tokens",
      description: "最小・最安のモデル、大規模利用向け",
    },
  },
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash Experimental",
    displayName: "Gemini 2.0 Flash (実験版)",
    category: "multimodal",
    status: "experimental",
    pricing: {
      input: 0.30,
      output: 2.50,
      inputAudio: 1.00,
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
      description: "実験版のハイブリッド推論モデル",
    },
  },

  // Gemini 1.5 シリーズ
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    displayName: "Gemini 1.5 Pro",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 1.25,
      output: 5.0,
      inputHighContext: 2.50,
      outputHighContext: 10.0,
      contextSize: "≤128K tokens: $1.25, >128K tokens: $2.50",
    },
    features: {
      supportsGrounding: true,
      contextWindow: "2M tokens",
      description: "最高知能のGemini 1.5シリーズモデル",
    },
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    displayName: "Gemini 1.5 Flash",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 0.075,
      output: 0.30,
      inputHighContext: 0.15,
      outputHighContext: 0.60,
      contextSize: "≤128K tokens: $0.075, >128K tokens: $0.15",
    },
    features: {
      supportsGrounding: true,
      contextWindow: "1M tokens",
      description: "最高速のマルチモーダルモデル",
    },
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    displayName: "Gemini 1.5 Flash-8B",
    category: "multimodal",
    status: "stable",
    pricing: {
      input: 0.0375,
      output: 0.15,
      inputHighContext: 0.075,
      outputHighContext: 0.30,
      contextSize: "≤128K tokens: $0.0375, >128K tokens: $0.075",
    },
    features: {
      supportsGrounding: true,
      contextWindow: "1M tokens",
      description: "最小モデル、低知能用途向け",
    },
  },

  // その他の実験版モデル
  {
    id: "gemini-exp-1206",
    name: "Gemini Experimental 1206",
    displayName: "Gemini Experimental 1206",
    category: "multimodal",
    status: "experimental",
    pricing: {
      input: 1.25,
      output: 10.0,
      inputHighContext: 2.50,
      outputHighContext: 15.0,
      contextSize: "≤200K tokens: $1.25, >200K tokens: $2.50",
    },
    features: {
      supportsThinking: true,
      description: "実験版のマルチパーパスモデル",
    },
  },
];

export const PROVIDERS: Provider[] = [
  {
    id: "google",
    name: "Google",
    displayName: "Google AI",
    models: GEMINI_MODELS,
  },
];

// 為替レート（デフォルト値）
export const DEFAULT_EXCHANGE_RATE = 150; // 1 USD = 150 JPY

// モデルをカテゴリ別に取得
export function getModelsByCategory(category?: string): GeminiModel[] {
  if (!category) return GEMINI_MODELS;
  return GEMINI_MODELS.filter(model => model.category === category);
}

// モデルをステータス別に取得
export function getModelsByStatus(status?: string): GeminiModel[] {
  if (!status) return GEMINI_MODELS;
  return GEMINI_MODELS.filter(model => model.status === status);
}