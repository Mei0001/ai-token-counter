// AIプロバイダーの統合管理

import { GEMINI_MODELS, GeminiModel } from "./gemini-models";
import { OPENAI_MODELS, OpenAIModel } from "./openai-models";
import { GeminiTokenCounter } from "./token-counter";
import { OpenAITokenCounter } from "./openai-token-counter";

export type AIModel = GeminiModel | OpenAIModel;

export interface Provider {
  id: string;
  name: string;
  displayName: string;
  description: string;
  models: AIModel[];
  requiresApiKey: boolean;
  apiKeyInstructions?: string;
  tokenCounter: GeminiTokenCounter | OpenAITokenCounter;
}

// プロバイダー定義
export const PROVIDERS: Provider[] = [
  {
    id: "google",
    name: "Google AI",
    displayName: "Google Gemini",
    description: "Google AIのGeminiモデル、高度なマルチモーダル機能と思考能力",
    models: GEMINI_MODELS,
    requiresApiKey: false, // 推定値でも利用可能
    apiKeyInstructions: "https://aistudio.google.com/app/apikey で無料で取得可能",
    tokenCounter: new GeminiTokenCounter(),
  },
  {
    id: "openai",
    name: "OpenAI",
    displayName: "OpenAI",
    description: "OpenAIのGPT-4、GPT-4o、o1/o3シリーズモデル",
    models: OPENAI_MODELS,
    requiresApiKey: false, // 推定値でも利用可能
    apiKeyInstructions: "https://platform.openai.com/api-keys で取得可能",
    tokenCounter: new OpenAITokenCounter(),
  },
];

// プロバイダーIDでプロバイダーを取得
export function getProviderById(providerId: string): Provider | undefined {
  return PROVIDERS.find(p => p.id === providerId);
}

// すべてのモデルを取得
export function getAllModels(): AIModel[] {
  return PROVIDERS.flatMap(p => p.models);
}

// モデルIDでモデルを取得
export function getModelById(modelId: string): AIModel | undefined {
  return getAllModels().find(m => m.id === modelId);
}

// モデルのプロバイダーを取得
export function getProviderForModel(modelId: string): Provider | undefined {
  return PROVIDERS.find(p => p.models.some(m => m.id === modelId));
}

// カテゴリ別にモデルを取得
export function getModelsByCategory(category: string, providerId?: string): AIModel[] {
  const providers = providerId 
    ? PROVIDERS.filter(p => p.id === providerId)
    : PROVIDERS;
  
  return providers.flatMap(p => 
    p.models.filter(m => m.category === category)
  );
}

// ステータス別にモデルを取得  
export function getModelsByStatus(status: string, providerId?: string): AIModel[] {
  const providers = providerId 
    ? PROVIDERS.filter(p => p.id === providerId)
    : PROVIDERS;
  
  return providers.flatMap(p => 
    p.models.filter(m => m.status === status)
  );
}

// 利用可能なカテゴリを取得
export function getAvailableCategories(providerId?: string): string[] {
  const models = providerId 
    ? PROVIDERS.find(p => p.id === providerId)?.models || []
    : getAllModels();
  
  const categories = new Set(models.map(m => m.category));
  return Array.from(categories);
}

// デフォルトモデルを取得
export function getDefaultModel(providerId?: string): AIModel | undefined {
  if (providerId) {
    const provider = getProviderById(providerId);
    return provider?.models.find(m => m.status === "stable") || provider?.models[0];
  }
  
  // プロバイダー指定なしの場合はGemini 2.5 Flashをデフォルトに
  return getModelById("gemini-2.5-flash");
}

// トークンカウントの実行
export async function countTokens(
  text: string, 
  modelId: string, 
  customOutputTokens?: number,
  apiKey?: string
) {
  const model = getModelById(modelId);
  const provider = getProviderForModel(modelId);
  
  if (!model || !provider) {
    throw new Error(`Model ${modelId} not found`);
  }
  
  // Geminiの場合はAPIキーを設定可能
  if (provider.id === "google" && apiKey) {
    (provider.tokenCounter as GeminiTokenCounter).setApiKey(apiKey);
  }
  
  return provider.tokenCounter.countTokens(text, modelId, customOutputTokens);
}