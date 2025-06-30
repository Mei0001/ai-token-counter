"use client";

import { useState, useEffect, useCallback } from "react";
import { Calculator, RefreshCw, AlertCircle } from "lucide-react";
import { GEMINI_MODELS, DEFAULT_EXCHANGE_RATE } from "@/lib/gemini-models";
import { GeminiTokenCounter } from "@/lib/token-counter";
import { calculateCost, formatCurrency } from "@/lib/cost-calculator";
import ModelSelector from "./ModelSelector";
import TextInput from "./TextInput";
import ResultDisplay from "./ResultDisplay";
import PricingTable from "./PricingTable";

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

  // ローカルストレージからAPIキーを読み込み
  useEffect(() => {
    const savedApiKey = localStorage.getItem('gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // APIキーをローカルストレージに保存
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey) {
      localStorage.setItem('gemini-api-key', newApiKey);
    } else {
      localStorage.removeItem('gemini-api-key');
    }
  };

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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  より正確な結果を得るには
                </h3>
                <p className="text-sm text-blue-700 mb-2">
                  Gemini APIキーを設定すると、<strong>無料で正確な</strong>トークン数を計算できます。
                  APIキーがない場合は推定値を表示します。<br/>
                  <strong>セキュリティ重視</strong>：APIキーはお使いのブラウザにのみ保存され、サーバーには送信されません。
                </p>
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  → APIキーを無料で取得
                </a>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Gemini API Key
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
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <p>✅ CountTokens APIは完全無料です</p>
                <p>✅ APIキーはブラウザのみに保存され、送信されません</p>
                <p>✅ 正確なトークン数でより精密な料金計算が可能</p>
              </div>
            </div>
          )}
        </div>

        {/* モデル選択 */}
        <ModelSelector
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

      {/* 料金表 */}
      <PricingTable exchangeRate={exchangeRate} />
    </div>
  );
}