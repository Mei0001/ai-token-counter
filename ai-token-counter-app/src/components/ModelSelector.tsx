"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { PROVIDERS, GeminiModel } from "@/lib/gemini-models";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
}

export default function ModelSelector({
  selectedModelId,
  onModelSelect,
}: ModelSelectorProps) {
  const [expandedProvider, setExpandedProvider] = useState<string>("google");

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      stable: { text: "安定版", color: "bg-green-100 text-green-700" },
      preview: { text: "プレビュー", color: "bg-yellow-100 text-yellow-700" },
      experimental: { text: "実験版", color: "bg-red-100 text-red-700" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 text-xs rounded ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const groupModelsByVersion = (models: GeminiModel[]) => {
    const groups: { [key: string]: GeminiModel[] } = {};
    
    models.forEach(model => {
      let version = "その他";
      if (model.name.includes("2.5")) {
        version = "Gemini 2.5";
      } else if (model.name.includes("2.0")) {
        version = "Gemini 2.0";
      } else if (model.name.includes("1.5")) {
        version = "Gemini 1.5";
      } else if (model.name.includes("Experimental")) {
        version = "実験版";
      }
      
      if (!groups[version]) {
        groups[version] = [];
      }
      groups[version].push(model);
    });
    
    return groups;
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        モデル選択
      </label>
      
      <div className="space-y-2">
        {PROVIDERS.map((provider) => {
          const isExpanded = expandedProvider === provider.id;
          const modelGroups = groupModelsByVersion(provider.models);
          
          return (
            <div key={provider.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* プロバイダーヘッダー */}
              <div
                className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => setExpandedProvider(isExpanded ? "" : provider.id)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="font-medium text-gray-900">{provider.displayName}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {provider.models.length} モデル
                </span>
              </div>

              {/* モデル一覧 */}
              {isExpanded && (
                <div className="p-3 space-y-3">
                  {Object.entries(modelGroups).map(([version, models]) => (
                    <div key={version} className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                        {version}
                      </h4>
                      <div className="space-y-1">
                        {models.map((model) => (
                          <label
                            key={model.id}
                            className={`block p-3 rounded-md border-2 cursor-pointer transition-all ${
                              selectedModelId === model.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                                </div>
                                {model.features.description && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {model.features.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>入力: ${model.pricing.input}/1M</span>
                                  <span>出力: ${model.pricing.output}/1M</span>
                                  {model.features.contextWindow && (
                                    <span>コンテキスト: {model.features.contextWindow}</span>
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