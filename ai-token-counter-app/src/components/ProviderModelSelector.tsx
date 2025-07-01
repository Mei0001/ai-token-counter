"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Sparkles, Bot } from "lucide-react";
import { PROVIDERS, Provider, AIModel, getProviderForModel } from "@/lib/providers";

interface ProviderModelSelectorProps {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
}

export default function ProviderModelSelector({
  selectedModelId,
  onModelSelect,
}: ProviderModelSelectorProps) {
  const selectedProvider = getProviderForModel(selectedModelId);
  const [expandedProvider, setExpandedProvider] = useState<string>(selectedProvider?.id || "google");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { text: "安定版", color: "bg-green-100 text-green-700" },
      preview: { text: "プレビュー", color: "bg-yellow-100 text-yellow-700" },
      experimental: { text: "実験版", color: "bg-red-100 text-red-700" },
      deprecated: { text: "非推奨", color: "bg-gray-100 text-gray-700" },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.experimental;
    return (
      <span className={`px-2 py-1 text-xs rounded ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case "google":
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case "openai":
        return <Bot className="w-5 h-5 text-green-600" />;
      default:
        return <Bot className="w-5 h-5 text-gray-500" />;
    }
  };

  const groupModelsByCategory = (models: AIModel[]) => {
    const groups: { [key: string]: AIModel[] } = {};
    
    models.forEach(model => {
      const category = model.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(model);
    });
    
    // カテゴリの表示順序
    const categoryOrder = ["chat", "multimodal", "reasoning", "audio", "tts", "embedding", "legacy"];
    const sortedGroups: { [key: string]: AIModel[] } = {};
    
    categoryOrder.forEach(cat => {
      if (groups[cat]) {
        sortedGroups[cat] = groups[cat];
      }
    });
    
    // その他のカテゴリを追加
    Object.keys(groups).forEach(cat => {
      if (!sortedGroups[cat]) {
        sortedGroups[cat] = groups[cat];
      }
    });
    
    return sortedGroups;
  };

  const getCategoryDisplayName = (category: string) => {
    const names: { [key: string]: string } = {
      chat: "チャット",
      multimodal: "マルチモーダル",
      reasoning: "推論",
      audio: "オーディオ",
      tts: "音声合成",
      embedding: "埋め込み",
      legacy: "レガシー",
    };
    return names[category] || category;
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "無料";
    if (price < 1) return `$${price.toFixed(3)}`;
    if (price < 10) return `$${price.toFixed(2)}`;
    return `$${price.toFixed(0)}`;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        AIモデル選択
      </label>
      
      <div className="space-y-2">
        {PROVIDERS.map((provider) => {
          const isExpanded = expandedProvider === provider.id;
          const modelGroups = groupModelsByCategory(provider.models);
          
          return (
            <div key={provider.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* プロバイダーヘッダー */}
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedProvider(isExpanded ? "" : provider.id)}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  {getProviderIcon(provider.id)}
                  <div>
                    <span className="font-medium text-gray-900">{provider.displayName}</span>
                    <p className="text-xs text-gray-600">{provider.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {provider.models.length} モデル
                </span>
              </div>

              {/* モデル一覧 */}
              {isExpanded && (
                <div className="p-3 space-y-3 bg-gray-50/50">
                  {Object.entries(modelGroups).map(([category, models]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                        {getCategoryDisplayName(category)}
                      </h4>
                      <div className="space-y-1">
                        {models.map((model) => (
                          <label
                            key={model.id}
                            className={`block p-3 rounded-md border-2 cursor-pointer transition-all ${
                              selectedModelId === model.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="model"
                              value={model.id}
                              checked={selectedModelId === model.id}
                              onChange={(e) => onModelSelect(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">
                                    {model.displayName}
                                  </span>
                                  {getStatusBadge(model.status)}
                                  {'isReasoning' in model.features && (model.features as any).isReasoning && (
                                    <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                                      推論強化
                                    </span>
                                  )}
                                </div>
                                {model.features.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {model.features.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>入力: {formatPrice(model.pricing.input)}/1M</span>
                                  <span>出力: {formatPrice(model.pricing.output)}/1M</span>
                                  {'cachedInput' in model.pricing && (model.pricing as any).cachedInput && (
                                    <span className="text-orange-600">
                                      キャッシュ: {formatPrice((model.pricing as any).cachedInput)}/1M
                                    </span>
                                  )}
                                  {model.features.contextWindow && (
                                    <span>コンテキスト: {model.features.contextWindow}</span>
                                  )}
                                </div>
                                {/* 特殊機能の表示 */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {'supportsThinking' in model.features && model.features.supportsThinking && (
                                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">思考</span>
                                  )}
                                  {'supportsAudio' in model.features && model.features.supportsAudio && (
                                    <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">音声</span>
                                  )}
                                  {'supportsVideo' in model.features && model.features.supportsVideo && (
                                    <span className="px-2 py-0.5 text-xs bg-pink-100 text-pink-700 rounded">動画</span>
                                  )}
                                  {'supportsVision' in model.features && model.features.supportsVision && (
                                    <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">画像</span>
                                  )}
                                  {'supportsFunctionCalling' in model.features && model.features.supportsFunctionCalling && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">関数</span>
                                  )}
                                  {'supportsRealtime' in model.features && (model.features as any).supportsRealtime && (
                                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded">リアルタイム</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}