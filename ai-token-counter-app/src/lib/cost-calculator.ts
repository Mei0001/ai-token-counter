// 料金計算機能

import { GeminiModel } from "./gemini-models";

export interface CostCalculation {
  inputCostUSD: number;
  outputCostUSD: number;
  thinkingCostUSD: number;
  totalCostUSD: number;
  inputCostJPY: number;
  outputCostJPY: number;
  thinkingCostJPY: number;
  totalCostJPY: number;
}

export function calculateCost(
  inputTokens: number,
  outputTokens: number,
  thinkingTokens: number,
  model: GeminiModel,
  exchangeRate: number
): CostCalculation {
  // トークン数を100万単位に変換
  const inputMillions = inputTokens / 1_000_000;
  const outputMillions = outputTokens / 1_000_000;
  const thinkingMillions = thinkingTokens / 1_000_000;

  // USD計算
  const inputCostUSD = inputMillions * model.pricing.input;
  const outputCostUSD = outputMillions * model.pricing.output;
  
  // 思考トークンは出力料金と同じ（Geminiの仕様）
  const thinkingCostUSD = model.features.supportsThinking 
    ? thinkingMillions * model.pricing.output 
    : 0;
  
  const totalCostUSD = inputCostUSD + outputCostUSD + thinkingCostUSD;

  // JPY計算
  const inputCostJPY = inputCostUSD * exchangeRate;
  const outputCostJPY = outputCostUSD * exchangeRate;
  const thinkingCostJPY = thinkingCostUSD * exchangeRate;
  const totalCostJPY = totalCostUSD * exchangeRate;

  return {
    inputCostUSD,
    outputCostUSD,
    thinkingCostUSD,
    totalCostUSD,
    inputCostJPY,
    outputCostJPY,
    thinkingCostJPY,
    totalCostJPY,
  };
}

// 数値を通貨形式でフォーマット
export function formatCurrency(amount: number, currency: "USD" | "JPY"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(amount);
  } else {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }
}