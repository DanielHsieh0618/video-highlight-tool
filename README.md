# Document about the technical choices

## 環境 / Environment

- node : 20.x ( LTS )
- node package manager :
  - pnpm : 9.13.2 ( 最快的套件管理工具 )

## 前端框架 / Frontend Framework

- Vue.js：當前最熟悉的前端框架

## 基本設定 / Basic Configuration

- ESLint：為確保程式碼的品質與一致性
- Prettier：為確保程式碼的風格與排版一致

## 開發與部署 / Development and Deployment

- Vite：Vue 預設的開發工具，也支援 React ，啟動開發伺服器與打包效率佳。
- MSW ( Mock Service Worker )： 模擬 API 的工具，不用架設另外的伺服器，僅在瀏覽器使用 service worker 即可運行，開發迅速也跨框架支援。
- Pinia：狀態管理工具，若跨 Components 存取資料時可以使用。（本次未使用，若未來實作不同使存取自己的 Tokens 有可能使用到）

## 測試 / Test

- Vitest ( unit test )：Vite 原生的測試框架，支援 Jest 語法，執行速度快。(本次因時間關係未使用)
- Cypress ( end-to-end test )：支援多種裝置的端點測試框架，在 Vue 的社群也被廣泛使用。(本次因時間關係未使用)
