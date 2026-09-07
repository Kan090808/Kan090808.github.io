## ADDED Requirements

### Requirement: Editing controls SHALL appear only in the local development environment
Create, edit, and delete controls SHALL be visible only when the app is running from the local Vite dev server. The production GitHub Pages build SHALL NOT render those controls, SHALL NOT include a local-edit bootstrap in the JavaScript bundle, and SHALL NOT document editor shortcuts in the public UI.

Local editing SHALL be entered and left from a single floating button on every page. While edit mode is on, the author SHALL edit text by clicking the content itself. Category names SHALL be edited that way; the UI SHALL NOT add extra rename tabs or rename chips beside the category filters.

#### Scenario: Author runs the site locally
- **WHEN** the author opens the site at `http://localhost` via `npm run dev`
- **THEN** a floating `編輯` button is shown on every page
- **THEN** create, inline-edit, and delete actions are not shown until that button is activated

#### Scenario: Author enters and leaves edit mode
- **WHEN** the author activates the floating `編輯` button
- **THEN** the button reads `完成`
- **THEN** content text can be clicked and edited in place
- **THEN** no extra `改名` tab or chip is rendered beside the category filters
- **WHEN** the author activates `完成`
- **THEN** the page returns to the public layout and the floating button reads `編輯`

#### Scenario: Visitor views GitHub Pages
- **WHEN** a visitor opens the deployed GitHub Pages site
- **THEN** no floating `編輯` button is shown
- **THEN** no create, edit, or delete controls are present in the DOM
- **THEN** the production JavaScript does not define a public `localCms` or write-client export

### Requirement: Local environment SHALL allow create, edit, and delete for all three content types
While local editing is enabled, the author SHALL be able to create, update, and delete profile fields, recommendation categories, recommendation items, and posts. Successful saves SHALL write files under `content/` and then show the updated public view. Delete SHALL require an explicit confirmation step naming the item.

#### Scenario: Author updates profile
- **WHEN** the author is in edit mode and changes name, bio, or links in place
- **THEN** `content/profile.json` is updated on disk
- **THEN** the `個人資料` tab shows the new values without a full manual refresh

#### Scenario: Author adds a work
- **WHEN** the author is in edit mode on the `作品` tab, creates a work with title, introduction, and a website or GitHub URL, and saves
- **THEN** the item is appended to `content/works.json`
- **THEN** the `作品` tab shows the new item

#### Scenario: Author adds a recommendation item
- **WHEN** the author creates a `開發工具` item with title and summary and saves
- **THEN** the item is appended to the recommendations content file
- **THEN** the `推薦列表` tab shows the new item under `開發工具`

#### Scenario: Author adds a post
- **WHEN** the author creates a post with title, date, slug, and Markdown body and saves
- **THEN** a Markdown file is written under `content/posts/`
- **THEN** the post appears in the `貼文` list and is reachable at `#/posts/<slug>`

#### Scenario: Author deletes a post after confirmation
- **WHEN** the author chooses delete on a post and confirms
- **THEN** the corresponding file is removed from `content/posts/`
- **THEN** the post disappears from the list
- **THEN** `#/posts/<slug>` shows the not-found state

#### Scenario: Author cancels delete
- **WHEN** the author chooses delete and then cancels the confirmation
- **THEN** the content file remains
- **THEN** the item remains visible

### Requirement: Write API SHALL exist only on the local dev server and only for localhost
The process that writes `content/` files SHALL be registered only in Vite `configureServer` (dev serve). It SHALL reject requests whose Host is not `localhost` or `127.0.0.1`. It SHALL reject path traversal and writes outside `content/`. Production preview and GitHub Pages SHALL have no such endpoint.

#### Scenario: Local save from the editor succeeds
- **WHEN** the local editor submits a valid profile save to the dev-server write endpoint from `http://localhost`
- **THEN** the server writes only under `content/`
- **THEN** the response indicates success

#### Scenario: Non-localhost host is rejected
- **WHEN** a write request reaches the dev server with `Host` set to a non-localhost name
- **THEN** the server does not write any file
- **THEN** the response is `403`

#### Scenario: Path traversal is rejected
- **WHEN** a write request asks to store a file at `content/../../.env`
- **THEN** the server does not write any file
- **THEN** the response is `400`

#### Scenario: Production has no write endpoint
- **WHEN** a visitor requests any `/__local-cms/*` path on GitHub Pages
- **THEN** GitHub Pages serves the static site fallback or 404
- **THEN** no content file on the server is modified (there is no write server)

### Requirement: Public site SHALL remain readable if local editing fails
A failed local save SHALL keep the last successfully written content on disk and SHALL show an error next to the form. The public tabs SHALL still render the last good content.

#### Scenario: Save fails because of invalid post slug
- **WHEN** the author saves a post with a slug containing spaces
- **THEN** the write is rejected
- **THEN** an error is shown in Traditional Chinese explaining that the slug may only use lowercase letters, digits, and hyphens
- **THEN** no partial post file is left behind
