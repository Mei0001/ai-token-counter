"use client";

import { Loader2 } from "lucide-react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  isCalculating: boolean;
}

export default function TextInput({
  value,
  onChange,
  isCalculating,
}: TextInputProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">
          テキスト入力
        </label>
        {isCalculating && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            計算中...
          </div>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ここにテキストを入力してください..."
        className="w-full h-48 px-3 py-2 border border-gray-300 rounded-md resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="mt-2 text-sm text-gray-500">
        文字数: {value.length.toLocaleString()} 文字
      </div>
    </div>
  );
}