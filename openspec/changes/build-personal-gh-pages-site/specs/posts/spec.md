## ADDED Requirements

### Requirement: Posts tab SHALL list published posts newest first
The `貼文` tab list view SHALL show every published post as a row with title and date. Posts SHALL be ordered by `date` descending, then by `slug` ascending for ties. Unpublished or unreadable files SHALL not appear in the public list.

#### Scenario: Visitor opens the post list
- **WHEN** a visitor opens `#/posts` and two published posts exist with dates `2026-09-01` and `2026-08-01`
- **THEN** the newer post appears first
- **THEN** each row shows title and date
- **THEN** each row can be activated to open that post's detail

#### Scenario: No published posts
- **WHEN** a visitor opens `貼文` and there are no published posts
- **THEN** a Traditional Chinese empty state is shown
- **THEN** the visitor can still switch to other tabs

### Requirement: Post detail SHALL render Markdown body
A post SHALL have front matter `title` (required), `date` (required ISO date `YYYY-MM-DD`), and `slug` (required URL-safe string), plus a Markdown body. Optional `tags` SHALL be a string array. The detail view SHALL show title, date, tags if present, and the rendered body.

#### Scenario: Visitor opens an existing post
- **WHEN** a visitor opens `#/posts/hello-world` and that slug exists
- **THEN** the post title is the page heading
- **THEN** the date is visible
- **THEN** the Markdown body is rendered as HTML

#### Scenario: Visitor opens a missing post
- **WHEN** a visitor opens `#/posts/does-not-exist`
- **THEN** the site shows a Traditional Chinese not-found message on the `貼文` tab
- **THEN** a control is available to return to the post list

### Requirement: Post slugs SHALL be stable public identifiers
The public URL for a post SHALL be `#/posts/<slug>`. Slugs SHALL contain only lowercase letters, digits, and hyphens. Two posts SHALL not share a slug; if a duplicate is present in content files, only one post SHALL be published and the duplicate SHALL be ignored with a build-time or local-editor warning.

#### Scenario: Duplicate slug at build time
- **WHEN** two post files declare the same slug
- **THEN** the public site exposes only one of them
- **THEN** the author-facing local environment reports the duplicate

#### Scenario: Invalid slug is not publicly listed
- **WHEN** a post file has a slug containing spaces or uppercase letters
- **THEN** that post is omitted from the public list
- **THEN** `#/posts/<that-raw-slug>` shows the not-found state
