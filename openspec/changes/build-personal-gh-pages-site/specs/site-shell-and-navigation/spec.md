## ADDED Requirements

### Requirement: Public site SHALL expose exactly four top-level tabs
The public site SHALL provide four and only four top-level tabs, labeled in Traditional Chinese as `個人資料`, `作品`, `推薦列表`, and `貼文`, in that order. Selecting a tab SHALL show that tab's content and hide the other tabs' main content.

#### Scenario: Visitor opens the site
- **WHEN** a visitor opens the site with no tab specified in the URL
- **THEN** the `個人資料` tab is selected
- **THEN** the profile content is visible
- **THEN** works, recommendation list, and post content are not shown as the main view

#### Scenario: Visitor switches tabs
- **WHEN** a visitor activates the `推薦列表` tab
- **THEN** recommendation list content is visible
- **THEN** the `推薦列表` tab is marked as the current tab
- **THEN** profile and post list/detail are not shown as the main view

#### Scenario: Tab labels are Traditional Chinese
- **WHEN** a visitor views the tab bar
- **THEN** the four labels are `個人資料`, `作品`, `推薦列表`, and `貼文`
- **THEN** no additional top-level tab is shown

### Requirement: Each tab SHALL be reachable by a shareable URL
The site SHALL encode the current view in the URL hash so GitHub Pages can serve a single static `index.html` without server-side routing. Supported hashes SHALL be `#/profile`, `#/works`, `#/recs`, `#/posts`, and `#/posts/<slug>`.

#### Scenario: Visitor opens a recommendation deep link
- **WHEN** a visitor opens `https://kan090808.github.io/#/recs`
- **THEN** the `推薦列表` tab is selected
- **THEN** recommendation list content is visible

#### Scenario: Visitor opens a post deep link
- **WHEN** a visitor opens `#/posts/example-slug` and that post exists
- **THEN** the `貼文` tab is selected
- **THEN** the matching post detail is visible

#### Scenario: Changing tabs updates the URL
- **WHEN** a visitor selects `貼文` from the tab bar while viewing profile
- **THEN** the URL hash becomes `#/posts`

### Requirement: Navigation SHALL work on desktop and mobile
On viewports narrower than 768px the three tabs SHALL appear as a labeled bottom bar with a minimum 44×44 CSS pixel hit target. On wider viewports the three tabs SHALL appear in the page header. Keyboard users SHALL be able to move between tabs with Tab/Enter or arrow keys on the tab list.

#### Scenario: Mobile visitor uses the tab bar
- **WHEN** the viewport width is below 768px
- **THEN** the three tabs are pinned to the bottom of the viewport
- **THEN** each tab control is at least 44×44 CSS pixels
- **THEN** each tab shows its Traditional Chinese label

#### Scenario: Keyboard user moves between tabs
- **WHEN** a keyboard user focuses the tab list and presses the key for the next tab
- **THEN** the next tab becomes selected
- **THEN** that tab's content is shown
- **THEN** focus remains on the tab list or moves into the newly shown content in a documented, consistent way

### Requirement: Production site SHALL be a static GitHub Pages site
The production artifact SHALL be static files with no runtime server. A visitor SHALL be able to read all published profile, recommendation, and post content without signing in.

#### Scenario: Anonymous visitor reads the live site
- **WHEN** a visitor opens the GitHub Pages URL without credentials
- **THEN** the four tabs and published content are readable
- **THEN** the visitor is not prompted to log in

#### Scenario: Unknown hash falls back safely
- **WHEN** a visitor opens a hash that is not one of the supported routes
- **THEN** the site shows the `個人資料` tab
- **THEN** the URL is corrected to `#/profile`
