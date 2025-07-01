// OpenAIモデルの定義と料金情報

export interface OpenAIModelPricing {
  input: number; // USD per 1M tokens
  output: number; // USD per 1M tokens
  cachedInput?: number; // USD per 1M tokens (cached)
  inputAudio?: number; // USD per 1M tokens (audio input)
  outputAudio?: number; // USD per 1M tokens (audio output)
}

export interface OpenAIModelFeatures {
  contextWindow?: string;
  description?: string;
  supportsCaching?: boolean;
  supportsAudio?: boolean;
  supportsRealtime?: boolean;
  supportsSearch?: boolean;
  supportsVision?: boolean;
  supportsFunctionCalling?: boolean;
  isReasoning?: boolean; // o1, o3系のモデル
  flexProcessing?: boolean; // Flex processing対応
}

export interface OpenAIModel {
  id: string;
  name: string;
  displayName: string;
  category: string; // "chat" | "reasoning" | "audio" | "embedding" | "legacy"
  status: "stable" | "preview" | "deprecated";
  pricing: OpenAIModelPricing;
  features: OpenAIModelFeatures;
  encoding: string; // tiktoken encoding name
}

export const OPENAI_MODELS: OpenAIModel[] = [
  // GPT-4.1シリーズ
  {
    id: "gpt-4.1",
    name: "gpt-4.1-2025-04-14",
    displayName: "GPT-4.1",
    category: "chat",
    status: "stable",
    pricing: {
      input: 2.0,
      output: 8.0,
      cachedInput: 0.5,
    },
    features: {
      contextWindow: "128K tokens",
      description: "最新のGPT-4.1モデル、高性能で効率的",
      supportsCaching: true,
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },
  {
    id: "gpt-4.1-mini",
    name: "gpt-4.1-mini-2025-04-14",
    displayName: "GPT-4.1 Mini",
    category: "chat",
    status: "stable",
    pricing: {
      input: 0.4,
      output: 1.6,
      cachedInput: 0.1,
    },
    features: {
      contextWindow: "128K tokens",
      description: "高速・低コストのGPT-4.1軽量版",
      supportsCaching: true,
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },
  {
    id: "gpt-4.1-nano",
    name: "gpt-4.1-nano-2025-04-14",
    displayName: "GPT-4.1 Nano",
    category: "chat",
    status: "stable",
    pricing: {
      input: 0.1,
      output: 0.4,
      cachedInput: 0.025,
    },
    features: {
      contextWindow: "64K tokens",
      description: "最小・最速のGPT-4.1超軽量版",
      supportsCaching: true,
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },

  // GPT-4.5シリーズ
  {
    id: "gpt-4.5-preview",
    name: "gpt-4.5-preview-2025-02-27",
    displayName: "GPT-4.5 Preview",
    category: "chat",
    status: "preview",
    pricing: {
      input: 75.0,
      output: 150.0,
      cachedInput: 37.5,
    },
    features: {
      contextWindow: "2M tokens",
      description: "次世代の超高性能モデル（プレビュー版）",
      supportsCaching: true,
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },

  // GPT-4oシリーズ
  {
    id: "gpt-4o",
    name: "gpt-4o-2024-08-06",
    displayName: "GPT-4o",
    category: "chat",
    status: "stable",
    pricing: {
      input: 2.5,
      output: 10.0,
      cachedInput: 1.25,
    },
    features: {
      contextWindow: "128K tokens",
      description: "マルチモーダル対応の高性能モデル",
      supportsCaching: true,
      supportsVision: true,
      supportsFunctionCalling: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "gpt-4o-mini",
    name: "gpt-4o-mini-2024-07-18",
    displayName: "GPT-4o Mini",
    category: "chat",
    status: "stable",
    pricing: {
      input: 0.15,
      output: 0.6,
      cachedInput: 0.075,
    },
    features: {
      contextWindow: "128K tokens",
      description: "コスト効率の高いマルチモーダルモデル",
      supportsCaching: true,
      supportsVision: true,
      supportsFunctionCalling: true,
    },
    encoding: "o200k_base",
  },

  // オーディオ対応モデル
  {
    id: "gpt-4o-audio-preview",
    name: "gpt-4o-audio-preview-2024-12-17",
    displayName: "GPT-4o Audio Preview",
    category: "audio",
    status: "preview",
    pricing: {
      input: 2.5,
      output: 10.0,
      inputAudio: 40.0,
      outputAudio: 80.0,
    },
    features: {
      contextWindow: "128K tokens",
      description: "音声入出力対応のマルチモーダルモデル",
      supportsAudio: true,
      supportsVision: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "gpt-4o-realtime-preview",
    name: "gpt-4o-realtime-preview-2025-06-03",
    displayName: "GPT-4o Realtime Preview",
    category: "audio",
    status: "preview",
    pricing: {
      input: 5.0,
      output: 20.0,
      cachedInput: 2.5,
      inputAudio: 40.0,
      outputAudio: 80.0,
    },
    features: {
      contextWindow: "128K tokens",
      description: "リアルタイム音声対話対応モデル",
      supportsRealtime: true,
      supportsAudio: true,
      supportsCaching: true,
    },
    encoding: "o200k_base",
  },

  // Reasoningモデル（o1, o3シリーズ）
  {
    id: "o1",
    name: "o1-2024-12-17",
    displayName: "o1",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 15.0,
      output: 60.0,
      cachedInput: 7.5,
    },
    features: {
      contextWindow: "128K tokens",
      description: "高度な推論能力を持つモデル",
      isReasoning: true,
      supportsCaching: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "o1-pro",
    name: "o1-pro-2025-03-19",
    displayName: "o1 Pro",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 150.0,
      output: 600.0,
    },
    features: {
      contextWindow: "128K tokens",
      description: "最高レベルの推論能力を持つプロフェッショナルモデル",
      isReasoning: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "o3",
    name: "o3-2025-04-16",
    displayName: "o3",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 2.0,
      output: 8.0,
      cachedInput: 0.5,
    },
    features: {
      contextWindow: "200K tokens",
      description: "次世代の推論モデル、高速・効率的",
      isReasoning: true,
      supportsCaching: true,
      flexProcessing: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "o3-pro",
    name: "o3-pro-2025-06-10",
    displayName: "o3 Pro",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 20.0,
      output: 80.0,
    },
    features: {
      contextWindow: "200K tokens",
      description: "o3の高性能版、複雑な推論タスク向け",
      isReasoning: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "o3-mini",
    name: "o3-mini-2025-01-31",
    displayName: "o3 Mini",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 1.1,
      output: 4.4,
      cachedInput: 0.55,
    },
    features: {
      contextWindow: "128K tokens",
      description: "コスト効率の高い推論モデル",
      isReasoning: true,
      supportsCaching: true,
    },
    encoding: "o200k_base",
  },
  {
    id: "o1-mini",
    name: "o1-mini-2024-09-12",
    displayName: "o1 Mini",
    category: "reasoning",
    status: "stable",
    pricing: {
      input: 1.1,
      output: 4.4,
      cachedInput: 0.55,
    },
    features: {
      contextWindow: "128K tokens",
      description: "軽量な推論モデル、高速処理",
      isReasoning: true,
      supportsCaching: true,
    },
    encoding: "o200k_base",
  },

  // レガシーモデル
  {
    id: "gpt-4-turbo",
    name: "gpt-4-turbo-2024-04-09",
    displayName: "GPT-4 Turbo",
    category: "chat",
    status: "stable",
    pricing: {
      input: 10.0,
      output: 30.0,
    },
    features: {
      contextWindow: "128K tokens",
      description: "GPT-4の高速版",
      supportsVision: true,
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },
  {
    id: "gpt-4",
    name: "gpt-4-0613",
    displayName: "GPT-4",
    category: "chat",
    status: "stable",
    pricing: {
      input: 30.0,
      output: 60.0,
    },
    features: {
      contextWindow: "8K tokens",
      description: "初代GPT-4モデル",
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },
  {
    id: "gpt-3.5-turbo",
    name: "gpt-3.5-turbo-0125",
    displayName: "GPT-3.5 Turbo",
    category: "chat",
    status: "stable",
    pricing: {
      input: 0.5,
      output: 1.5,
    },
    features: {
      contextWindow: "16K tokens",
      description: "高速・低コストのチャットモデル",
      supportsFunctionCalling: true,
    },
    encoding: "cl100k_base",
  },

  // Embedding モデル
  {
    id: "text-embedding-3-small",
    name: "text-embedding-3-small",
    displayName: "Text Embedding 3 Small",
    category: "embedding",
    status: "stable",
    pricing: {
      input: 0.02,
      output: 0,
    },
    features: {
      description: "小規模な埋め込みモデル",
    },
    encoding: "cl100k_base",
  },
  {
    id: "text-embedding-3-large",
    name: "text-embedding-3-large",
    displayName: "Text Embedding 3 Large",
    category: "embedding",
    status: "stable",
    pricing: {
      input: 0.13,
      output: 0,
    },
    features: {
      description: "大規模な埋め込みモデル",
    },
    encoding: "cl100k_base",
  },
  {
    id: "text-embedding-ada-002",
    name: "text-embedding-ada-002",
    displayName: "Text Embedding Ada 002",
    category: "embedding",
    status: "stable",
    pricing: {
      input: 0.1,
      output: 0,
    },
    features: {
      description: "レガシー埋め込みモデル",
    },
    encoding: "cl100k_base",
  },
];

// エンコーディング名からモデルを取得
export function getModelsByEncoding(encoding: string): OpenAIModel[] {
  return OPENAI_MODELS.filter(model => model.encoding === encoding);
}

// カテゴリ別にモデルを取得
export function getModelsByCategory(category?: string): OpenAIModel[] {
  if (!category) return OPENAI_MODELS;
  return OPENAI_MODELS.filter(model => model.category === category);
}

// ステータス別にモデルを取得
export function getModelsByStatus(status?: string): OpenAIModel[] {
  if (!status) return OPENAI_MODELS;
  return OPENAI_MODELS.filter(model => model.status === status);
}

// Flex Processing対応価格（50%割引）
export function getFlexPricing(model: OpenAIModel): OpenAIModelPricing | null {
  if (!model.features.flexProcessing) return null;
  
  return {
    input: model.pricing.input * 0.5,
    output: model.pricing.output * 0.5,
    cachedInput: model.pricing.cachedInput ? model.pricing.cachedInput * 0.5 : undefined,
  };
}