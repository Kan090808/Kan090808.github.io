## 1. Project Scaffold

- [x] 1.1 Initialize Vite + TypeScript with a single `index.html` entry, `src/` for app code, and `content/` for site data.
- [x] 1.2 Add `package.json` scripts for `dev`, `build`, `preview`, and `test`.
- [x] 1.3 Add `.gitignore` for `node_modules/`, `dist/`, and editor junk; keep `content/` tracked.

## 2. Content Model

- [x] 2.1 Define TypeScript types and runtime validators for profile, recommendation categories/items, and post front matter.
- [x] 2.2 Seed `content/profile.json`, `content/recommendations.json` (categories `dev-tools` / `anime`), one sample post under `content/posts/`, and `content/media/` for optional images.
- [x] 2.3 Load content at runtime with `import.meta.glob` so production bakes files into the static build and local writes can hot-reload.

## 3. Site Shell And Navigation

- [x] 3.1 Implement hash routing for `#/profile`, `#/recs`, `#/posts`, and `#/posts/<slug>`, defaulting unknown hashes to `#/profile`.
- [x] 3.2 Render exactly three Traditional Chinese tabs (`個人資料`, `推薦列表`, `貼文`) and switch the main view without a page reload.
- [x] 3.3 Use header binder-tabs above 768px and a 44px labeled bottom tab bar below 768px; support keyboard tab-list movement.
- [x] 3.4 Keep the production app readable with no login and no extra top-level tabs.

## 4. Profile Tab

- [x] 4.1 Render name, tagline, avatar, Markdown bio, and valid http(s) links from `profile.json`.
- [x] 4.2 Omit empty optional fields and drop invalid link URLs instead of showing broken UI.
- [x] 4.3 Show a Traditional Chinese empty state when no valid profile name exists, without mentioning local editing.

## 5. Recommendation Lists

- [x] 5.1 Render items grouped or filterable by category, with seed categories `開發工具` and `動漫`.
- [x] 5.2 Show title and summary for every item; open valid `url` in a new context with `rel="noopener noreferrer"`; keep URL-less items static.
- [x] 5.3 Show Traditional Chinese empty states for an empty tab and for a category with zero items.

## 6. Posts

- [x] 6.1 Parse post Markdown files, sort published posts by date descending, and list title plus date on the `貼文` tab.
- [x] 6.2 Render post detail at `#/posts/<slug>` with title, date, tags, and Markdown body.
- [x] 6.3 Show a Traditional Chinese not-found state for missing slugs, with a control back to the list.
- [x] 6.4 Enforce slug charset and duplicate-slug rules: invalid or duplicate posts are omitted from the public list and reported in the local environment.

## 7. Local Content Editing

- [x] 7.1 Gate all editor chrome and the editor module on `import.meta.env.DEV`; show `本機編輯模式` only on the local dev server.
- [x] 7.2 Add a Vite `configureServer` plugin with `/__local-cms` write routes only in `serve`, allowing Host `localhost` / `127.0.0.1` only.
- [x] 7.3 Reject path traversal and any write whose resolved path is outside `content/`.
- [x] 7.4 Implement profile and recommendation create/update/delete that writes JSON and refreshes the public view.
- [x] 7.5 Implement post create/update/delete that writes or removes Markdown under `content/posts/`, with confirmation that names the item before delete.
- [x] 7.6 Validate slugs and required fields before write; on failure show a Traditional Chinese error and leave disk unchanged.
- [x] 7.7 Confirm the production bundle does not include `/__local-cms` or editor copy.

## 8. Visual System

- [x] 8.1 Apply the night-desk tokens (desk `#243044`, paper `#F3EFE4`, ink `#1F2430`, enamel `#C45C26`, danger `#9B2C2C`) and Noto Serif TC / Noto Sans TC / IBM Plex Mono.
- [x] 8.2 Style binder-tab navigation, paper content sheets, and recommendation collection cards; keep motion 150–250ms and honor `prefers-reduced-motion`.
- [x] 8.3 Verify desktop and mobile layouts: no horizontal scroll, readable type ≥16px, visible focus rings.

## 9. Tests And Verification

- [x] 9.1 Add Vitest coverage for `isLocalEditEnabled`, write-path sandboxing, schema validation, slug rules, and hash route parsing.
- [x] 9.2 Manually verify local create/edit/delete on all three tabs, cancel-delete, and that `npm run preview` / production has no editor.
- [x] 9.3 Manually verify the three tabs, deep links, empty states, and missing-post state on a mobile-width viewport.

## 10. GitHub Pages Deploy

- [x] 10.1 Add a GitHub Actions workflow that builds `dist/` and deploys with official Pages actions from `main`.
- [x] 10.2 Document `npm run dev` (local edit) versus push-to-publish in the project README.
