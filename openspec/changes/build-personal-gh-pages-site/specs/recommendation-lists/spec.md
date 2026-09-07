## ADDED Requirements

### Requirement: Recommendation tab SHALL group items by category
The `推薦列表` tab SHALL show recommendation items grouped or filterable by category. The site SHALL ship with two seed categories: `開發工具` (id `dev-tools`) and `動漫` (id `anime`). Additional categories created in local editing SHALL appear on the public site after the next published build if they contain at least one item.

#### Scenario: Visitor opens the recommendation tab with seed data
- **WHEN** a visitor opens `推薦列表` and both seed categories have items
- **THEN** the visitor can see `開發工具` items
- **THEN** the visitor can see `動漫` items
- **THEN** each item shows a title and a short summary

#### Scenario: Visitor filters to one category
- **WHEN** a visitor selects the `動漫` category filter
- **THEN** only items whose category is `動漫` are listed
- **THEN** `開發工具` items are hidden

#### Scenario: Category with no items
- **WHEN** a published category has zero items
- **THEN** that category's empty state is shown in Traditional Chinese
- **THEN** other categories remain available

### Requirement: Each recommendation item SHALL expose enough to act on it
A recommendation item SHALL have `id`, `categoryId`, `title`, and `summary`. Optional fields SHALL be `url`, `image`, and `tags`. If `url` is present and valid http(s), the item SHALL be a link that opens in a new browsing context. If `url` is absent, the item SHALL still display title and summary as static content.

#### Scenario: Tool recommendation with a URL
- **WHEN** a `開發工具` item has title, summary, and a valid `url`
- **THEN** the visitor can activate the item to open that URL
- **THEN** the link uses `rel="noopener noreferrer"`

#### Scenario: Anime recommendation without a URL
- **WHEN** an `動漫` item has title and summary but no `url`
- **THEN** the item still appears in the `動漫` list
- **THEN** activating it does not navigate away

### Requirement: Recommendation empty site SHALL remain usable
If there are no published recommendation items, the `推薦列表` tab SHALL show a Traditional Chinese empty state. The tab SHALL still be reachable from the tab bar.

#### Scenario: No recommendations published
- **WHEN** a visitor opens `推薦列表` and the published item list is empty
- **THEN** an empty-state message is shown in Traditional Chinese
- **THEN** the visitor can still switch to other tabs
