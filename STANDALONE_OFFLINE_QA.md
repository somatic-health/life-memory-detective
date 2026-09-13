# 《生活記憶偵探》Standalone Offline QA

## 結論

**Standalone Offline Final PASS**

驗收日期：2026-09-13

本交付以既有 `Final Asset Integration PASS` 為 Gameplay/UI 封版基準；本次只增加離線建置設定與交付文件，未修改既有 Gameplay/UI、題庫邏輯或正式 PNG。

## 離線建置

- `vite.offline.config.ts` 只負責產生 standalone IIFE bundle。
- standalone bundle 使用相對圖片路徑 `assets/questions/...`。
- standalone CSS 使用系統字型 fallback，不載入 Google Fonts。
- 交付執行不需要 Node/Bun/Python、API、backend 或網路服務。

## 完整回歸

- 簡單：4/4 題，100%。
- 普通：4/4 題，100%。
- 困難：4/4 題、8/8 個差異，100%。
- 第一個困難 hotspot 後顯示「很好，還有 1 個地方不一樣。」。
- 390×844 與 1920×1080 / 16:9 均無水平溢位；圖片維持 4:3 與 `object-fit: contain`。
- 回首頁、再玩一次、切換難度、before/after、彩條轉場與結果頁均通過。
- 最終入口 console error/warn 0 筆；必要外部 network request 0。

詳細交付 QA 報告隨 standalone 資料夾附上：`STANDALONE_OFFLINE_QA.md`。

