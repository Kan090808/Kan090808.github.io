# Kan090808.github.io

GitHub Pages 個人站：四個分頁（個人資料、作品、推薦列表、貼文）。公開網站是靜態、唯讀的；內容存在 `content/`，用 git push 發布。作品放在 `content/works.json`。

## 本機編輯

```bash
npm install
npm run dev
```

瀏覽器打開 `http://localhost:5173`。右下角會有一顆「編輯」按鈕；點下去進入編輯模式，再點頁面上的文字就能改。完成後再點「完成」離開。只有本機開發伺服器有這顆按鈕。存檔會直接改 `content/` 裡的檔案。

不要把 `vite` 綁到區網或公開 IP；寫入 API 只接受 `localhost`。

## 發布

```bash
git add content
git commit -m "更新內容"
git push
```

GitHub Actions 會執行測試、建置 `dist/`，並部署到 GitHub Pages。第一次請到 repo Settings → Pages，把 Source 設成 GitHub Actions。線上網站沒有編輯按鈕，也沒有寫入 API。

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 本機預覽 + 編輯 |
| `npm test` | 單元測試 |
| `npm run build` | 正式建置，並檢查包裡沒有本機 CMS |
| `npm run preview` | 預覽正式包（無編輯功能） |
