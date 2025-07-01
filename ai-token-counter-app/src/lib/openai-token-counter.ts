// OpenAI トークンカウント機能（推定ベース）

import { OPENAI_MODELS, OpenAIModel } from "./openai-models";

interface TokenCountResult {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  characterCount: number;
  characterCountNoSpace: number;
  wordCount: number;
  lineCount: number;
  isOutputEstimated: boolean;
}

// エンコーディング名とトークン/文字の平均比率
// OpenAIの経験則に基づく推定値
const ENCODING_RATIOS: Record<string, number> = {
  'cl100k_base': 3.5,  // GPT-3.5/4で使用（日本語: 約2.0、英語: 約4.0の平均）
  'o200k_base': 3.8,   // GPT-4o, o1/o3で使用（改善されたエンコーディング）
  'p50k_base': 4.0,    // レガシーモデル
  'r50k_base': 4.0,    // 古いモデル
  'gpt2': 4.0,         // GPT-2
};

// 言語別の調整係数
const LANGUAGE_ADJUSTMENTS = {
  // 日本語文字の割合による調整
  getJapaneseRatio(text: string): number {
    const japaneseChars = text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g);
    return japaneseChars ? japaneseChars.length / text.length : 0;
  },
  
  // 調整された比率を計算
  getAdjustedRatio(baseRatio: number, text: string): number {
    const japaneseRatio = this.getJapaneseRatio(text);
    // 日本語は平均2文字/トークン、英語は4文字/トークン
    const adjustedRatio = baseRatio * (1 - japaneseRatio) + 2.0 * japaneseRatio;
    return adjustedRatio;
  }
};

export class OpenAITokenCounter {
  constructor() {}

  async countTokens(text: string, modelId: string, customOutputTokens?: number): Promise<TokenCountResult> {
    // モデルを取得
    const model = OPENAI_MODELS.find(m => m.id === modelId);
    if (!model) {
      throw new Error(`Unknown model: ${modelId}`);
    }

    // 推定値を使用（OpenAI APIを使用しない簡易版）
    return this.estimateTokens(text, model, customOutputTokens);
  }

  // 推定計算
  estimateTokens(text: string, model: OpenAIModel, customOutputTokens?: number): TokenCountResult {
    // テキストの基本統計
    const characterCount = text.length;
    const characterCountNoSpace = text.replace(/\s/g, "").length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split("\n").length;

    // エンコーディングに基づいた推定
    const baseRatio = ENCODING_RATIOS[model.encoding] || 4.0;
    const adjustedRatio = LANGUAGE_ADJUSTMENTS.getAdjustedRatio(baseRatio, text);
    
    // より精密な推定のための追加要素
    const punctuationBonus = (text.match(/[.,;:!?\-'"(){}[\]]/g) || []).length * 0.1;
    const numberBonus = (text.match(/\d+/g) || []).length * 0.2;
    const whitespaceBonus = (text.match(/\s+/g) || []).length * 0.1;
    
    const estimatedInputTokens = Math.ceil(
      (characterCount / adjustedRatio) + punctuationBonus + numberBonus + whitespaceBonus
    );
    
    // 出力トークン数
    const outputTokens = customOutputTokens ?? Math.round(estimatedInputTokens * 0.5);
    const isOutputEstimated = customOutputTokens === undefined;
    
    const totalTokens = estimatedInputTokens + outputTokens;

    return {
      inputTokens: estimatedInputTokens,
      outputTokens,
      totalTokens,
      characterCount,
      characterCountNoSpace,
      wordCount,
      lineCount,
      isOutputEstimated,
    };
  }

  // 特定のエンコーディングでの推定（モデルIDなしで使用可能）
  estimateTokensByEncoding(text: string, encodingName: string, customOutputTokens?: number): TokenCountResult {
    const characterCount = text.length;
    const characterCountNoSpace = text.replace(/\s/g, "").length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split("\n").length;

    const baseRatio = ENCODING_RATIOS[encodingName] || 4.0;
    const adjustedRatio = LANGUAGE_ADJUSTMENTS.getAdjustedRatio(baseRatio, text);
    
    const punctuationBonus = (text.match(/[.,;:!?\-'"(){}[\]]/g) || []).length * 0.1;
    const numberBonus = (text.match(/\d+/g) || []).length * 0.2;
    const whitespaceBonus = (text.match(/\s+/g) || []).length * 0.1;
    
    const estimatedInputTokens = Math.ceil(
      (characterCount / adjustedRatio) + punctuationBonus + numberBonus + whitespaceBonus
    );
    
    const outputTokens = customOutputTokens ?? Math.round(estimatedInputTokens * 0.5);
    const isOutputEstimated = customOutputTokens === undefined;
    
    const totalTokens = estimatedInputTokens + outputTokens;

    return {
      inputTokens: estimatedInputTokens,
      outputTokens,
      totalTokens,
      characterCount,
      characterCountNoSpace,
      wordCount,
      lineCount,
      isOutputEstimated,
    };
  }

  // OpenAI特有の考慮事項を含む高度な推定
  advancedEstimate(text: string, model: OpenAIModel, options?: {
    customOutputTokens?: number;
    systemPrompt?: string;
    functionCalls?: number;
  }): TokenCountResult {
    const baseResult = this.estimateTokens(text, model, options?.customOutputTokens);
    
    // システムプロンプトのトークン数を追加
    if (options?.systemPrompt) {
      const systemTokens = this.estimateTokens(options.systemPrompt, model).inputTokens;
      baseResult.inputTokens += systemTokens;
    }
    
    // Function calling のオーバーヘッド（推定）
    if (options?.functionCalls && model.features.supportsFunctionCalling) {
      baseResult.inputTokens += options.functionCalls * 50; // 各関数呼び出しで約50トークン
    }
    
    baseResult.totalTokens = baseResult.inputTokens + baseResult.outputTokens;
    
    return baseResult;
  }
}