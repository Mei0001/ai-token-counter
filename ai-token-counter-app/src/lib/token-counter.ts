// Gemini API を使用したトークンカウント機能

import { GoogleGenerativeAI } from "@google/generative-ai";

interface TokenCountResult {
  inputTokens: number;
  outputTokens: number; // 推定値（入力の50%）
  thinkingTokens: number; // 推定値（入力の5%）
  totalTokens: number;
  characterCount: number;
  characterCountNoSpace: number;
  wordCount: number;
  lineCount: number;
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

  async countTokens(text: string, modelId: string): Promise<TokenCountResult> {
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
      const outputTokens = Math.round(inputTokens * 0.5); // 出力は入力の50%と仮定
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
      };
    } catch (error) {
      console.error("Token counting error:", error);
      throw new Error("トークンカウントに失敗しました");
    }
  }

  // APIキーなしでの推定計算（フォールバック用）
  estimateTokens(text: string): TokenCountResult {
    // Geminiの場合、1トークン ≈ 4文字
    const estimatedInputTokens = Math.ceil(text.length / 4);
    const outputTokens = Math.round(estimatedInputTokens * 0.5);
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
    };
  }
}