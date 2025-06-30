"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, RefreshCw, AlertCircle } from "lucide-react";
import { GEMINI_MODELS, DEFAULT_EXCHANGE_RATE } from "@/lib/gemini-models";
import { GeminiTokenCounter } from "@/lib/token-counter";
import { calculateCost, formatCurrency } from "@/lib/cost-calculator";
import ModelSelector from "./ModelSelector";
import TextInput from "./TextInput";
import ResultDisplay from "./ResultDisplay";

export default function TokenCounter() {
  const [selectedModelId, setSelectedModelId] = useState(GEMINI_MODELS[0].id);
  const [inputText, setInputText] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [exchangeRate, setExchangeRate] = useState(DEFAULT_EXCHANGE_RATE);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const tokenCounter = new GeminiTokenCounter();

  // トークンカウントの実行
  const calculateTokens = useCallback(async () => {
    if (!inputText.trim()) {
      setResult(null);
      return;
    }

    setIsCalculating(true);
    setError(null);

    try {
      let tokenResult;
      
      if (apiKey) {
        tokenCounter.setApiKey(apiKey);
        tokenResult = await tokenCounter.countTokens(inputText, selectedModelId);
      } else {
        // APIキーがない場合は推定値を使用
        tokenResult = tokenCounter.estimateTokens(inputText);
      }

      const selectedModel = GEMINI_MODELS.find(m => m.id === selectedModelId)!;
      const costResult = calculateCost(
        tokenResult.inputTokens,
        tokenResult.outputTokens,
        tokenResult.thinkingTokens,
        selectedModel,
        exchangeRate
      );

      setResult({
        ...tokenResult,
        ...costResult,
        model: selectedModel,
        isEstimated: !apiKey,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsCalculating(false);
    }
  }, [inputText, selectedModelId, apiKey, exchangeRate]);

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateTokens();
    }, 500);

    return () => clearTimeout(timer);
  }, [calculateTokens]);

  // 為替レート更新（簡易版）
  const refreshExchangeRate = async () => {
    // 実際のAPIを使用する場合はここで取得
    // 今回はデモのため固定値を使用
    setExchangeRate(DEFAULT_EXCHANGE_RATE);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator className="w-6 h-6" />
            AI Token Counter - Gemini
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              為替レート: ¥{exchangeRate.toFixed(2)}/USD
            </div>
            <button
              onClick={refreshExchangeRate}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="為替レート更新"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* API Key入力 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Gemini API Key（オプション）
            </label>
            <button
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showApiKeyInput ? "非表示" : "表示"}
            </button>
          </div>
          {showApiKeyInput && (
            <div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                APIキーを入力すると正確なトークン数を計算します。入力しない場合は推定値を表示します。
              </p>
            </div>
          )}
        </div>

        {/* モデル選択 */}
        <ModelSelector
          models={GEMINI_MODELS}
          selectedModelId={selectedModelId}
          onModelSelect={setSelectedModelId}
        />

        {/* テキスト入力 */}
        <TextInput
          value={inputText}
          onChange={setInputText}
          isCalculating={isCalculating}
        />

        {/* エラー表示 */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* 結果表示 */}
        {result && <ResultDisplay result={result} />}
      </div>
    </div>
  );
}