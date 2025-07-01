"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { PROVIDERS, getAllModels, AIModel } from "@/lib/providers";
import { formatCurrency } from "@/lib/cost-calculator";

interface PricingTableProps {
  exchangeRate: number;
}

export default function PricingTable({ exchangeRate }: PricingTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allModels = getAllModels();
  
  const categories = [
    { id: "all", name: "すべて" },
    { id: "chat", name: "チャット" },
    { id: "multimodal", name: "マルチモーダル" },
    { id: "reasoning", name: "推論" },
    { id: "audio", name: "オーディオ" },
    { id: "tts", name: "音声合成" },
    { id: "embedding", name: "埋め込み" },
  ];

  const providers = [
    { id: "all", name: "すべて" },
    ...PROVIDERS.map(p => ({ id: p.id, name: p.displayName })),
  ];

  let filteredModels = allModels;
  
  if (selectedProvider !== "all") {
    const provider = PROVIDERS.find(p => p.id === selectedProvider);
    filteredModels = provider?.models || [];
  }
  
  if (selectedCategory !== "all") {
    filteredModels = filteredModels.filter(model => model.category === selectedCategory);
  }

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
          {/* プロバイダー・カテゴリ選択 */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">プロバイダー</label>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedProvider === provider.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {provider.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? "bg-green-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 簡潔な料金表 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  <th className="text-left py-3 px-4 font-bold text-gray-800">モデル</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-800">入力トークン数の費用</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-800">出力トークン数の費用</th>
                  <th className="text-left py-3 px-4 font-bold text-gray-800">使用その他トークン数の費用</th>
                </tr>
              </thead>
              <tbody>
                {filteredModels.map((model) => (
                  <tr key={model.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-gray-900">{model.displayName}</div>
                        <div className="text-sm text-gray-600 mt-1">{model.features.description}</div>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(model.status)}
                          {/* プロバイダーバッジ */}
                          <span className={`text-xs px-2 py-1 rounded ${
                            model.id.startsWith('gpt') || model.id.startsWith('o') || model.id.startsWith('text-') 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-blue-50 text-blue-700'
                          }`}>
                            {model.id.startsWith('gpt') || model.id.startsWith('o') || model.id.startsWith('text-') 
                              ? 'OpenAI' 
                              : 'Google'}
                          </span>
                          {model.features.contextWindow && (
                            <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded">
                              {model.features.contextWindow}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {formatPrice(model.pricing.input).usd}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(model.pricing.input).jpy}
                        </div>
                        {(model.pricing as any).cachedInput && (
                          <div className="text-xs text-blue-600 mt-1">
                            キャッシュ: {formatPrice((model.pricing as any).cachedInput).usd}
                          </div>
                        )}
                        {(model.pricing as any).inputHighContext && (
                          <div className="text-xs text-orange-600 mt-1">
                            高コンテキスト: {formatPrice((model.pricing as any).inputHighContext).usd}
                          </div>
                        )}
                        {(model.pricing as any).inputAudio && (
                          <div className="text-xs text-purple-600 mt-1">
                            音声入力: {formatPrice((model.pricing as any).inputAudio).usd}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {formatPrice(model.pricing.output).usd}
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatPrice(model.pricing.output).jpy}
                        </div>
                        {(model.pricing as any).outputHighContext && (
                          <div className="text-xs text-orange-600 mt-1">
                            高コンテキスト: {formatPrice((model.pricing as any).outputHighContext).usd}
                          </div>
                        )}
                        {(model.pricing as any).outputAudio && (
                          <div className="text-xs text-purple-600 mt-1">
                            音声出力: {formatPrice((model.pricing as any).outputAudio).usd}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {('supportsThinking' in model.features && model.features.supportsThinking) || 
                       ('isReasoning' in model.features && (model.features as any).isReasoning) ? (
                        <div className="space-y-1">
                          <div className="font-medium text-blue-900">
                            {formatPrice(model.pricing.output).usd}
                          </div>
                          <div className="text-sm text-blue-700">
                            {formatPrice(model.pricing.output).jpy}
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            {'supportsThinking' in model.features && model.features.supportsThinking 
                              ? "思考トークン対応" 
                              : "推論強化モデル"}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400">
                          対応なし
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-md">
            <p><strong>※ 料金説明：</strong></p>
            <p>• すべての価格は1Mトークンあたりの料金です</p>
            <p>• 高コンテキスト料金は128K/200Kトークンを超える場合に適用されます</p>
            <p>• 思考トークンは出力料金と同じレートで課金されます</p>
            <p>• 音声入力・出力はオーディオデータの処理に適用される特別料金です</p>
          </div>
        </div>
      )}
    </div>
  );
}