## ADDED Requirements

### Requirement: Works tab SHALL list published projects
The `作品` tab SHALL list each work with a title, a short introduction, and an optional http(s) link to a website or a GitHub repository. GitHub hostnames SHALL be labeled `GitHub`; other valid http(s) links SHALL be labeled `網站`.

#### Scenario: Visitor opens the works tab
- **WHEN** a visitor opens `#/works` and at least one work with a GitHub URL exists
- **THEN** the `作品` tab is selected
- **THEN** the work title and introduction are visible
- **THEN** the item is labeled `GitHub`
- **THEN** activating the title opens the URL in a new browsing context with `rel="noopener noreferrer"`

#### Scenario: Visitor opens a website work
- **WHEN** a work has a valid non-GitHub http(s) URL
- **THEN** the item is labeled `網站`

#### Scenario: Work without a URL
- **WHEN** a work has a title and introduction but no URL
- **THEN** the item still appears
- **THEN** activating it does not navigate away

### Requirement: Empty works tab SHALL remain usable
If there are no published works, the `作品` tab SHALL show a Traditional Chinese empty state and remain reachable from the tab bar.

#### Scenario: No works published
- **WHEN** a visitor opens `作品` and the published list is empty
- **THEN** an empty-state message is shown in Traditional Chinese
- **THEN** the visitor can still switch to other tabs
