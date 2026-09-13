# 《生活記憶偵探》Final Interaction Patch v1.0.1 QA

## 結論

**Standalone Offline Interaction Patch PASS**

本版本以既有 `Standalone Offline Final PASS` 為 rollback 基準，只修改作答前 hotspot 視覺、答對紅色 ○ 與正確提示音。

## 修正摘要

- 移除 `QuestionImagePlaceholder.tsx` 的 `hotspot-*` absolute overlay、hover border、active scale、已找到綠色矩形與 easy miss 後的答案提示框。
- 改由整張圖片單一 click handler 命中既有百分比答案資料；游標固定為 default，作答前不產生任何答案區 DOM。
- 以實際 `<img>` 的 object-contain 內容區換算 click 百分比，紅色空心 ○ 對齊該內容區的 hotspot 中心與尺寸。
- 正確命中後顯示透明中央、紅色 `border-radius: 50%` 圓／橢圓標記，持續至本題離開；換題、重玩、回首頁會清除。
- 每個正確答案使用既有 `sound.playSuccess()` Web Audio API 成功音；仍受音效開關控制，無外部資源。

## 回歸結果

- 簡單 4/4，普通 4/4，困難 4/4、8/8：PASS。
- `hard_02` 兩個答案獨立命中且不重複計分：PASS。
- Hover／focus／cursor 洩漏測試：PASS。
- 390×844：PASS；1920×1080／16:9：PASS。
- Offline、Console error/warn 0、必要外部 network request 0：PASS。

修改 Gameplay source 僅 `src/components/QuestionImagePlaceholder.tsx` 與 `src/components/GamePlayView.tsx`；首頁、題庫、24 張 PNG、原始答案座標、memoryDuration、CRT、彩條、版面與離線啟動機制均未修改。

