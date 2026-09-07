## Context

Repo `Kan090808.github.io` is an empty GitHub user Pages site. The product is a three-tab personal blog: profile, recommendation lists (starting with 開發工具 and 動漫), and posts. Authors need in-browser editing, but only while developing on their own machine. The live Pages site must be static and read-only.

Constraints: no accounts, no database, no third-party CMS, Traditional Chinese UI, deploy from `main` via GitHub Actions.

## Goals / Non-Goals

**Goals:**
- Ship a static three-tab site that GitHub Pages can host.
- Keep profile, recommendations, and posts as files in `content/` so git is the publish mechanism.
- Show create/edit/delete only during `vite` dev on localhost.
- Make tab URLs shareable without a server-side router.
- Keep the first implementation small enough to reason about: vanilla TypeScript, no UI framework.

**Non-Goals:**
- Online CMS, GitHub OAuth, passwords, or editing from the live site.
- Comments, RSS, search, tags-as-first-class-navigation, i18n, or analytics.
- React/Vue/Astro, a markdown WYSIWYG, image pipeline beyond copying files into `content/media/`, drafts/workflow, or multi-author support.

## Decisions

### Vanilla Vite + TypeScript, not Astro or React

Three tabs and a handful of forms do not justify a framework. Vite gives TypeScript, HMR, `import.meta.env.DEV`, `import.meta.glob` for content, and `configureServer` for the local write API. The production output is static files in `dist/`.

Alternative considered: Astro content collections. Better for large blogs, heavier for a tabbed personal site and for a custom local editor.

Alternative considered: React. Helps with forms later; adds runtime and build surface area now.

### Hash routing on a single `index.html`

Routes are `#/profile`, `#/recs`, `#/posts`, `#/posts/<slug>`. User Pages (`username.github.io`) are served at `/`, so `base` is `/`. Hash routing avoids GitHub Pages 404s on refresh without a `404.html` SPA fallback.

Alternative considered: History API plus `404.html` copy of `index.html`. Cleaner URLs, extra deploy trick, easy to get wrong on user Pages.

### Content files are the source of truth

```
content/
  profile.json
  recommendations.json
  posts/*.md
  media/
```

`profile.json` holds name, tagline, avatar, bio, links. `recommendations.json` holds `categories` and `items`. Each post is Markdown with `title`, `date`, `slug`, optional `tags`. Production reads these via `import.meta.glob` at build time. Local saves write the same files; Vite HMR refreshes the view.

Alternative considered: a single `content/site.json`. One file is easier to write, worse diffs for posts.

Alternative considered: File System Access API from the browser. No custom server, but the author must grant a directory every session and it does not obviously land in the git tree.

### Local CMS is a Vite dev-only middleware plus a DEV-gated UI

A Vite plugin registers `/__local-cms/*` only inside `configureServer`. Handlers:

- `PUT /__local-cms/profile`
- `PUT /__local-cms/recommendations`
- `POST /__local-cms/posts`
- `PUT /__local-cms/posts/:slug`
- `DELETE /__local-cms/posts/:slug`

Guards: Host must be `localhost` or `127.0.0.1`; resolved paths must stay under `content/`; JSON/Markdown is schema-validated before write. The UI uses `import.meta.env.DEV` so production Rollup drops the editor module. Production has no server, so even a crafted `/__local-cms` request cannot write.

The author-facing UI is a single floating `編輯` / `完成` button on every page. Edit mode makes content text clickable in place. Category names are edited on the existing filter chips; there are no extra rename tabs. Create and delete controls appear only while edit mode is on.

Alternative considered: Decap CMS / GitHub API from the live site. That is editing in production, which this change forbids.

Alternative considered: hostname check only in the UI. UI checks are necessary but not sufficient; the write server must also refuse.

### Publish path is git + GitHub Actions Pages

`main` holds source. A workflow runs `npm run build` and deploys `dist/` with `actions/upload-pages-artifact` and `actions/deploy-pages`. Authors publish by committing content and pushing. No editor on the live site.

Alternative considered: commit `dist/` to `main` and serve the branch root. Works without Actions, mixes source and artifacts, painful diffs.

### Visual direction: night desk with paper sheets

The site is a Taiwanese developer's public desk: dark metal surface, paper documents for reading. Avoid the usual AI palettes (cream+serif+terracotta, black+neon, newspaper broadsheet).

- Desk background `#243044`
- Paper surface `#F3EFE4`
- Ink text `#1F2430`
- Enamel accent `#C45C26` (tabs, links)
- Danger `#9B2C2C` (delete only)
- Display: Noto Serif TC for name and post titles
- Body: Noto Sans TC
- Code/meta: IBM Plex Mono for dates and slugs

Signature: binder-tab navigation. Desktop tabs sit on the header like labeled folder tabs; the active tab lifts the paper sheet. Mobile uses a three-item bottom bar with the same labels, 44px targets. Recommendation items are collection cards (tools = spec cards, anime = cover cards) on the paper, not a dashboard table.

Motion stays small: 150–250ms tab paper fade, press scale on cards. Honor `prefers-reduced-motion`.

### Test at the local-edit seam, not through the DOM first

Automated tests (Vitest) cover:

1. `isLocalEditEnabled()` is true only for Vite DEV.
2. Write-path resolver rejects `..` and escapes from `content/`.
3. Profile/recommendation/post schema validation.
4. Slug rules and duplicate-slug handling.
5. Hash route parsing.

Browser verification still required for tab switching, empty states, and the local editor flow.

## Risks / Trade-offs

- [Someone exposes `vite` bind `0.0.0.0` on a public network] → Host allowlist plus DEV-only plugin; document `npm run dev` as localhost-only.
- [Editor code leaks into the Pages bundle] → Dynamic-import the editor from a `if (import.meta.env.DEV)` branch and add a grep/test that production JS has no `/__local-cms` string.
- [Hash URLs are uglier than `/posts/slug`] → Accepted so Pages routing stays dumb.
- [Vanilla forms will feel plain] → Keep forms few and labeled; do not add a form library.
- [Markdown HTML can XSS if we ever render untrusted input] → This site only renders owner-authored files; still parse Markdown with a library that does not execute scripts, and do not `innerHTML` unsanitized foreign HTML.
- [GitHub Pages Actions permissions misconfigured] → Use the official `actions/deploy-pages` flow and `pages: write` / `id-token: write`.

## Migration Plan

Greenfield; no live content to migrate.

1. Scaffold Vite + TypeScript and `content/` seed files.
2. Render the three read-only tabs from content files.
3. Add the DEV-only editor and write middleware.
4. Add Vitest for gating, path safety, and schema.
5. Add the Pages workflow and verify the production bundle has no editor.

Rollback: revert the workflow or the repo. The live site has no user data store.

## Open Questions

- Avatar and recommendation images: first version can be URLs or files dropped into `content/media/` by hand; in-editor upload can wait.
- Extra recommendation categories beyond 開發工具 and 動漫: local editor will allow them; none are seeded.
- Real profile copy vs placeholders: seed with obvious placeholders so the layout is visible before personal content exists.
