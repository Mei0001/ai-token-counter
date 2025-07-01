# App Icon Setup

## Overview
このアプリのアイコンは、LLM、入力、計算の概念を表現したカスタムSVGアイコンです。

## Icon Files Created

### 1. Main Icon (`/src/app/icon.svg` & `/public/icon.svg`)
- メインのアプリアイコン
- SVG形式で、モダンブラウザで高品質表示
- サイズ: 100x100px

### 2. Apple Touch Icon (`/src/app/apple-icon.svg` & `/public/apple-icon.svg`)
- iOS Safari用のアイコン
- 180x180pxのサイズ指定
- PWA対応

### 3. Favicon (`/src/app/favicon.ico`)
- 従来のブラウザ互換性のため保持
- バックアップは `favicon.ico.backup` として保存

### 4. Web App Manifest (`/public/manifest.json`)
- PWA (Progressive Web App) 対応
- アプリ名、説明、アイコンを定義
- スタンドアロンモードでの表示設定

## Icon Design Elements
- **LLM Speech Bubble**: 大規模言語モデルを表現
- **Input Speech Bubble**: ユーザー入力を表現  
- **Document with Dollar Sign**: コスト計算書類を表現
- **Calculator with Dollar Coin**: 料金計算機能を表現

## Browser Support
- **Modern Browsers**: SVGアイコンを使用（高品質）
- **Legacy Browsers**: favicon.icoにフォールバック
- **iOS Safari**: Apple touch iconを使用
- **PWA**: manifest.jsonで定義されたアイコンを使用

## Configuration
`layout.tsx`のmetadataオブジェクトで設定:
```typescript
icons: {
  icon: [
    { url: '/icon.svg', type: 'image/svg+xml' },
    { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
  ],
  apple: [
    { url: '/apple-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
  ],
},
manifest: '/manifest.json',
```

## Testing
開発サーバーを起動してブラウザで確認:
```bash
npm run dev
```

ブラウザタブ、ブックマーク、PWAインストール時にアイコンが表示されることを確認してください。