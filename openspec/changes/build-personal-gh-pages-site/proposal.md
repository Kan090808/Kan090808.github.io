## Why

這個 repo 是空的 GitHub Pages 個人站，需要一份可實作的合約：公開面是三個分頁的靜態部落格，作者只在本機新增、編輯、刪除內容，部署後的網站必須是唯讀。現在定義邊界，之後才不會把後端、帳號或線上 CMS 做進去。

## What Changes

- 建立可部署到 GitHub Pages 的靜態個人站，公開語言為繁體中文。
- 提供四個頂層分頁：**個人資料**、**作品**、**推薦列表**、**貼文**。
- 作品分頁列出做過的網站與 GitHub 專案，含標題、介紹與連結。
- 推薦列表至少包含 **開發工具** 與 **動漫** 兩個分類，並可在本機新增分類與項目。
- 貼文以 Markdown 撰寫，公開站提供列表與單篇閱讀。
- 新增、編輯、刪除只在本機開發環境出現；GitHub Pages 上不得顯示編輯介面，也不得提供任何寫入 API。
- 內容以 repo 內檔案為單一真相來源，本機存檔寫入這些檔案，push 後由 CI 建置並發布。

## Capabilities

### New Capabilities
- `site-shell-and-navigation`: 靜態站外殼、三個分頁切換、深層連結、GitHub Pages 部署後的公開瀏覽。
- `profile`: 公開個人資料的顯示與欄位契約。
- `works`: 公開作品列表，每項含標題、介紹，以及網站或 GitHub 連結。
- `recommendation-lists`: 依分類（開發工具、動漫等）展示推薦項目。
- `posts`: 貼文列表、單篇閱讀、Markdown 內容契約。
- `local-content-editing`: 僅本機可用的新增、編輯、刪除，以及正式環境的唯讀保證。

### Modified Capabilities

None.

## Impact

- 從空 repo 建立前端、內容目錄、本機寫入中介層、測試與 GitHub Pages 工作流程。
- 公開站沒有伺服器與帳號系統；寫入只存在於本機 Vite 開發伺服器。
- 發布路徑變成本機改內容 → git commit/push → GitHub Actions 建置靜態檔 → Pages。
- 依賴範圍：Vite、TypeScript、Markdown 解析，以及 GitHub Pages / Actions。不引入資料庫、OAuth 或第三方 CMS。
