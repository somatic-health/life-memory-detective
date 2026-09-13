# 《生活記憶偵探》Final Asset Integration QA

日期：2026-09-13

## 結果

**Final Asset Integration PASS**

24 張正式圖片已統一命名並掛載至 `public/assets/questions/`；12 題題庫的 before/after、scene、difficulty、memoryDuration、changeCount 與 hotspot 保持同步。Gameplay/UI Skeleton v1 的首頁、CRT、彩色測試條、流程、計分、結果頁與「我記住了」功能未改動。

## Hotspot 最終座標

座標均為圖片容器內的相對百分比：`x`、`y`、`width`、`height`。

| 題號 | 答案 | x | y | width | height |
|---|---|---:|---:|---:|---:|
| easy_01 | 咖啡杯消失 | 22 | 28 | 25 | 29 |
| easy_02 | 雨傘消失 | 38 | 23 | 56 | 28 |
| easy_03 | 報紙換成雜誌 | 27 | 54 | 60 | 40 |
| easy_04 | 毛巾換成小手帕 | 7 | 60 | 26 | 21 |
| normal_01 | 蘋果消失 | 35 | 41 | 34 | 25 |
| normal_02 | 湯匙位置移動 | 7 | 66 | 20 | 27 |
| normal_03 | 計算機換成小時鐘 | 73 | 45 | 25 | 26 |
| normal_04 | 帽子位置移動 | 40 | 30 | 38 | 36 |
| hard_01 | 雨傘消失 | 70 | 52 | 29 | 32 |
| hard_01 | 帽子移動 | 2 | 32 | 35 | 33 |
| hard_02 | 香蕉消失 | 5 | 54 | 29 | 20 |
| hard_02 | 水壺換成保溫瓶 | 10 | 12 | 18 | 40 |
| hard_03 | 70 年代發票消失 | 37 | 68 | 20 | 27 |
| hard_03 | 飲料位置移動 | 62 | 22 | 25 | 38 |
| hard_04 | 原子筆換成鉛筆 | 61 | 51 | 27 | 20 |
| hard_04 | 鑰匙位置移動 | 25 | 52 | 24 | 22 |

`hard_02` 的兩個區域特別調整為不重疊，確保香蕉與水壺／保溫瓶可以分別點擊。

## 實機回歸

- 簡單：4/4 題完成，結果頁 4/4、100%。
- 普通：4/4 題完成，結果頁 4/4、100%。
- 困難：4/4 題完成，結果頁 8/8、100%。
- 困難模式逐題驗證第一個答案後顯示「很好，還有 1 個地方不一樣。」。
- before/after 圖片未配反；CRT 內實際載入正式圖片。
- 「再玩一次」、遊戲中返回首頁、切換難度均可正常使用。
- 手機窄螢幕 390×844：無水平溢出，圖片維持 4:3，`object-fit: contain`，hotspot 可作答。
- 16:9 桌機 1600×900：無水平溢出，圖片維持 4:3，CRT 內不變形。
- 瀏覽器 console：無 error / warn。

## 靜態驗證

- `bun run lint`：PASS
- `bun run build`：PASS
- 24 張 PNG：全部存在於 `public/assets/questions/`

## 修改範圍

- `src/data/questions.ts`：正式圖片路徑與 16 個 hotspot 座標。
- `public/assets/questions/`：24 張正式 PNG。
- `ASSET_MAPPING.md`、`assets-manifest.json`：整合後對照與狀態。
- `FINAL_ASSET_INTEGRATION_QA.md`：本驗收紀錄。

其餘 Gameplay/UI 元件未修改。

## Git

AI Studio 提供的程式碼 ZIP 不含 `.git` 或既有 remote，因此未建立新 repository、未產生虛構 commit，也未推送外部服務。最終交付以本 ZIP 為準。
