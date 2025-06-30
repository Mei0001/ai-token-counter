"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { GEMINI_MODELS, GeminiModel } from "@/lib/gemini-models";
import { formatCurrency } from "@/lib/cost-calculator";

interface PricingTableProps {
  exchangeRate: number;
}

export default function PricingTable({ exchangeRate }: PricingTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "すべて" },
    { id: "multimodal", name: "マルチモーダル" },
    { id: "audio", name: "オーディオ" },
    { id: "tts", name: "音声合成" },
  ];

  const filteredModels = selectedCategory === "all" 
    ? GEMINI_MODELS 
    : GEMINI_MODELS.filter(model => model.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { text: "安定版", color: "bg-green-100 text-green-800" },
      preview: { text: "プレビュー", color: "bg-yellow-100 text-yellow-800" },
      experimental: { text: "実験版", color: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const formatPrice = (priceUSD: number) => ({
    usd: formatCurrency(priceUSD, "USD"),
    jpy: formatCurrency(priceUSD * exchangeRate, "JPY"),
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Info className="w-5 h-5" />
          モデル料金表
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {isExpanded ? "非表示" : "表示"}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* カテゴリ選択 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* 料金表 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">モデル</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ステータス</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">入力料金</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">出力料金</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">特徴</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{model.displayName}</div>
                        <div className="text-sm text-gray-500">{model.features.description}</div>
                        {model.features.contextWindow && (
                          <div className="text-xs text-blue-600">
                            コンテキスト: {model.features.contextWindow}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(model.status)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{formatPrice(model.pricing.input).usd}</span>
                          <span className="text-gray-500 ml-1">({formatPrice(model.pricing.input).jpy})</span>
                        </div>
                        {model.pricing.inputHighContext && (
                          <div className="text-xs text-orange-600">
                            高コンテキスト: {formatPrice(model.pricing.inputHighContext).usd}
                          </div>
                        )}
                        {model.pricing.inputAudio && (
                          <div className="text-xs text-purple-600">
                            オーディオ: {formatPrice(model.pricing.inputAudio).usd}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{formatPrice(model.pricing.output).usd}</span>
                          <span className="text-gray-500 ml-1">({formatPrice(model.pricing.output).jpy})</span>
                        </div>
                        {model.pricing.outputHighContext && (
                          <div className="text-xs text-orange-600">
                            高コンテキスト: {formatPrice(model.pricing.outputHighContext).usd}
                          </div>
                        )}
                        {model.pricing.outputAudio && (
                          <div className="text-xs text-purple-600">
                            オーディオ: {formatPrice(model.pricing.outputAudio).usd}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {model.features.supportsThinking && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">思考</span>
                        )}
                        {model.features.supportsAudio && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">音声</span>
                        )}
                        {model.features.supportsVideo && (
                          <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">動画</span>
                        )}
                        {model.features.supportsGrounding && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">検索</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>※ 料金は1Mトークンあたりの価格です</p>
            <p>※ 高コンテキストは128K/200Kトークンを超える場合の料金です</p>
            <p>※ 思考トークンは出力料金と同じレートで計算されます</p>
          </div>
        </div>
      )}
    </div>
  );
}