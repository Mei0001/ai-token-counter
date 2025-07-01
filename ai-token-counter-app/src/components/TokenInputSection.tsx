"use client";

import { Loader2 } from "lucide-react";

interface TokenInputSectionProps {
  inputText: string;
  onInputTextChange: (value: string) => void;
  outputTokens: string;
  onOutputTokensChange: (value: string) => void;
  outputText: string;
  onOutputTextChange: (value: string) => void;
  outputMode: "auto" | "tokens" | "text";
  onOutputModeChange: (mode: "auto" | "tokens" | "text") => void;
  isCalculating: boolean;
}

export default function TokenInputSection({
  inputText,
  onInputTextChange,
  outputTokens,
  onOutputTokensChange,
  outputText,
  onOutputTextChange,
  outputMode,
  onOutputModeChange,
  isCalculating,
}: TokenInputSectionProps) {
  return (
    <div className="mb-6 space-y-4">
      {/* テキスト入力 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">
            入力テキスト
          </label>
          {isCalculating && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              計算中...
            </div>
          )}
        </div>
        <textarea
          value={inputText}
          onChange={(e) => onInputTextChange(e.target.value)}
          placeholder="ここにテキストを入力してください..."
          className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2 text-sm text-gray-500">
          文字数: {inputText.length.toLocaleString()} 文字
        </div>
      </div>

      {/* 出力設定 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">出力設定</h3>
        
        <div className="space-y-3">
          {/* 自動推定 */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="outputMode"
              value="auto"
              checked={outputMode === "auto"}
              onChange={(e) => onOutputModeChange(e.target.value as "auto")}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div>
              <span className="text-sm font-medium text-gray-700">自動推定</span>
              <p className="text-xs text-gray-600">入力トークンの50%で推定</p>
            </div>
          </label>

          {/* トークン数指定 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="outputMode"
              value="tokens"
              checked={outputMode === "tokens"}
              onChange={(e) => onOutputModeChange(e.target.value as "tokens")}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">トークン数指定</span>
              <p className="text-xs text-gray-600 mb-2">予想される出力トークン数を直接入力</p>
              {outputMode === "tokens" && (
                <input
                  type="number"
                  value={outputTokens}
                  onChange={(e) => onOutputTokensChange(e.target.value)}
                  placeholder="予想される出力トークン数"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          </label>

          {/* 文章入力 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="outputMode"
              value="text"
              checked={outputMode === "text"}
              onChange={(e) => onOutputModeChange(e.target.value as "text")}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-0.5"
            />
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">出力文章入力</span>
              <p className="text-xs text-gray-600 mb-2">予想される出力文章を入力してトークン数を計算</p>
              {outputMode === "text" && (
                <div>
                  <textarea
                    value={outputText}
                    onChange={(e) => onOutputTextChange(e.target.value)}
                    placeholder="予想される出力文章を入力してください..."
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    文字数: {outputText.length.toLocaleString()} 文字
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}