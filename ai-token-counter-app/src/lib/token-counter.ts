// Gemini API を使用したトークンカウント機能

import { GoogleGenerativeAI } from "@google/generative-ai";

interface TokenCountResult {
  inputTokens: number;
  outputTokens: number;
  thinkingTokens: number;
  totalTokens: number;
  characterCount: number;
  characterCountNoSpace: number;
  wordCount: number;
  lineCount: number;
  isOutputEstimated: boolean; // 出力が推定値かどうか
}

export class GeminiTokenCounter {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(apiKey?: string) {
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  setApiKey(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async countTokens(text: string, modelId: string, customOutputTokens?: number): Promise<TokenCountResult> {
    if (!this.genAI) {
      throw new Error("API key not set");
    }

    // テキストの基本統計
    const characterCount = text.length;
    const characterCountNoSpace = text.replace(/\s/g, "").length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split("\n").length;

    try {
      // Gemini APIでトークンカウント
      const model = this.genAI.getGenerativeModel({ model: modelId });
      const countResult = await model.countTokens(text);
      
      const inputTokens = countResult.totalTokens;
      
      // 出力トークン数：カスタム値または推定値
      const outputTokens = customOutputTokens ?? Math.round(inputTokens * 0.5);
      const isOutputEstimated = customOutputTokens === undefined;
      
      const thinkingTokens = Math.round(inputTokens * 0.05); // 思考は入力の5%と仮定
      const totalTokens = inputTokens + outputTokens + thinkingTokens;

      return {
        inputTokens,
        outputTokens,
        thinkingTokens,
        totalTokens,
        characterCount,
        characterCountNoSpace,
        wordCount,
        lineCount,
        isOutputEstimated,
      };
    } catch (error) {
      console.error("Token counting error:", error);
      throw new Error("トークンカウントに失敗しました");
    }
  }

  // APIキーなしでの推定計算（フォールバック用）
  estimateTokens(text: string, customOutputTokens?: number): TokenCountResult {
    // Geminiの場合、1トークン ≈ 4文字
    const estimatedInputTokens = Math.ceil(text.length / 4);
    
    // 出力トークン数：カスタム値または推定値
    const outputTokens = customOutputTokens ?? Math.round(estimatedInputTokens * 0.5);
    const isOutputEstimated = customOutputTokens === undefined;
    
    const thinkingTokens = Math.round(estimatedInputTokens * 0.05);
    const totalTokens = estimatedInputTokens + outputTokens + thinkingTokens;

    const characterCount = text.length;
    const characterCountNoSpace = text.replace(/\s/g, "").length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    const lineCount = text.split("\n").length;

    return {
      inputTokens: estimatedInputTokens,
      outputTokens,
      thinkingTokens,
      totalTokens,
      characterCount,
      characterCountNoSpace,
      wordCount,
      lineCount,
      isOutputEstimated,
    };
  }
}