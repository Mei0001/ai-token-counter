"use client";

import { GeminiModel } from "@/lib/gemini-models";

interface ModelSelectorProps {
  models: GeminiModel[];
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
}

export default function ModelSelector({
  models,
  selectedModelId,
  onModelSelect,
}: ModelSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        モデル選択
      </label>
      <select
        value={selectedModelId}
        onChange={(e) => onModelSelect(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.displayName} - 入力: ${model.pricing.input}/1M, 出力: ${model.pricing.output}/1M
          </option>
        ))}
      </select>
    </div>
  );
}