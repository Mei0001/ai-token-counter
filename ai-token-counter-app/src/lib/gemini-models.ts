// Geminiモデルの定義と料金情報

export interface GeminiModel {
  id: string;
  name: string;
  displayName: string;
  pricing: {
    input: number; // USD per 1M tokens
    output: number; // USD per 1M tokens
    inputAudio?: number; // USD per 1M tokens (audio)
    outputAudio?: number; // USD per 1M tokens (audio)
    contextSize?: string; // Context size description
  };
  features: {
    supportsThinking?: boolean;
    supportsAudio?: boolean;
    supportsVideo?: boolean;
    supportsGrounding?: boolean;
  };
}

export const GEMINI_MODELS: GeminiModel[] = [
  {
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash Experimental",
    displayName: "Gemini 2.0 Flash (実験版)",
    pricing: {
      input: 0.3,
      output: 2.5,
      inputAudio: 1.0,
    },
    features: {
      supportsThinking: true,
      supportsAudio: true,
      supportsVideo: true,
      supportsGrounding: true,
    },
  },
  {
    id: "gemini-exp-1206",
    name: "Gemini Experimental 1206",
    displayName: "Gemini Experimental 1206",
    pricing: {
      input: 1.25,
      output: 10.0,
      contextSize: "≤200K tokens",
    },
    features: {
      supportsThinking: true,
    },
  },
  {
    id: "gemini-1.5-flash-8b",
    name: "Gemini 1.5 Flash-8B",
    displayName: "Gemini 1.5 Flash-8B",
    pricing: {
      input: 0.0375,
      output: 0.15,
      contextSize: "≤128K tokens",
    },
    features: {},
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    displayName: "Gemini 1.5 Flash",
    pricing: {
      input: 0.075,
      output: 0.30,
      contextSize: "≤128K tokens",
    },
    features: {},
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    displayName: "Gemini 1.5 Pro",
    pricing: {
      input: 1.25,
      output: 5.0,
      contextSize: "≤128K tokens",
    },
    features: {},
  },
];

// 為替レート（デフォルト値）
export const DEFAULT_EXCHANGE_RATE = 150; // 1 USD = 150 JPY