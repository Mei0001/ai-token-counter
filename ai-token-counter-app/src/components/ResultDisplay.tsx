"use client";

import { formatCurrency } from "@/lib/cost-calculator";
import { AlertCircle } from "lucide-react";

interface ResultDisplayProps {
  result: any;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  return (
    <div className="mt-6 space-y-4">
      {result.isEstimated && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-700">
            APIキーが設定されていないため、推定値を表示しています。
            正確なトークン数を取得するにはAPIキーを入力してください。
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 基本情報 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">基本情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">文字数:</span>
              <span className="font-medium">{result.characterCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">文字数（スペース除く）:</span>
              <span className="font-medium">{result.characterCountNoSpace.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ワード数:</span>
              <span className="font-medium">{result.wordCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">行数:</span>
              <span className="font-medium">{result.lineCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* トークン情報 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-3">トークン情報</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">入力トークン:</span>
              <span className="font-medium">{result.inputTokens.toLocaleString()} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">
                出力トークン{result.isOutputEstimated ? "（推定）" : "（指定）"}:
              </span>
              <span className="font-medium">{result.outputTokens.toLocaleString()} tokens</span>
            </div>
            {result.model.features.supportsThinking && (
              <div className="flex justify-between">
                <span className="text-gray-600">思考トークン（推定）:</span>
                <span className="font-medium">{result.thinkingTokens.toLocaleString()} tokens</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">合計:</span>
              <span className="font-bold">{result.totalTokens.toLocaleString()} tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* 料金情報 */}
      <div className="bg-green-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-3">料金計算</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* USD */}
          <div className="space-y-2 text-sm">
            <h4 className="font-medium text-gray-700">米ドル (USD)</h4>
            <div className="flex justify-between">
              <span className="text-gray-600">入力:</span>
              <span className="font-medium">{formatCurrency(result.inputCostUSD, "USD")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">出力:</span>
              <span className="font-medium">{formatCurrency(result.outputCostUSD, "USD")}</span>
            </div>
            {result.model.features.supportsThinking && (
              <div className="flex justify-between">
                <span className="text-gray-600">思考:</span>
                <span className="font-medium">{formatCurrency(result.thinkingCostUSD, "USD")}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">合計:</span>
              <span className="font-bold text-green-700">{formatCurrency(result.totalCostUSD, "USD")}</span>
            </div>
          </div>

          {/* JPY */}
          <div className="space-y-2 text-sm">
            <h4 className="font-medium text-gray-700">日本円 (JPY)</h4>
            <div className="flex justify-between">
              <span className="text-gray-600">入力:</span>
              <span className="font-medium">{formatCurrency(result.inputCostJPY, "JPY")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">出力:</span>
              <span className="font-medium">{formatCurrency(result.outputCostJPY, "JPY")}</span>
            </div>
            {result.model.features.supportsThinking && (
              <div className="flex justify-between">
                <span className="text-gray-600">思考:</span>
                <span className="font-medium">{formatCurrency(result.thinkingCostJPY, "JPY")}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600 font-semibold">合計:</span>
              <span className="font-bold text-green-700">{formatCurrency(result.totalCostJPY, "JPY")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}