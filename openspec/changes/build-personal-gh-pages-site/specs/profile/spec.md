## ADDED Requirements

### Requirement: Profile tab SHALL display the author's public identity
The `個人資料` tab SHALL display name, tagline, avatar, biography, and a list of public links. Biography MAY contain Markdown and SHALL be rendered as HTML in the public view. Missing optional fields SHALL be omitted rather than showing placeholder keys.

#### Scenario: Visitor views a complete profile
- **WHEN** a visitor opens the `個人資料` tab and profile content is present
- **THEN** the page shows the name as the primary heading
- **THEN** the tagline, avatar, rendered biography, and public links are visible
- **THEN** each public link is an external or site URL with a visible label

#### Scenario: Visitor views a profile with only required fields
- **WHEN** a visitor opens the `個人資料` tab and only name is set
- **THEN** the name is shown
- **THEN** empty tagline, biography, avatar, and link list are not rendered as broken images or empty-key labels

### Requirement: Profile content SHALL follow a stable field contract
Profile data SHALL include `name` (required non-empty string). Optional fields SHALL be `tagline` (string), `avatar` (site-relative media path or URL), `bio` (Markdown string), and `links` (array of `{ label, url }`). Invalid URLs in `links` SHALL be dropped from the public view rather than rendered as broken anchors. Public links MAY use `http(s)`, `mailto`, or `tel`.

#### Scenario: Link with a valid URL is shown
- **WHEN** profile links include `{ "label": "GitHub", "url": "https://github.com/Kan090808" }`
- **THEN** the profile shows a link labeled `GitHub` pointing at that URL

#### Scenario: Link with an invalid URL is omitted
- **WHEN** a link entry has an empty or non-http(s) `url`
- **THEN** that link is not rendered
- **THEN** remaining valid links still render

### Requirement: Empty profile SHALL show a public empty state
If `name` is missing or the profile file is absent, the public `個人資料` tab SHALL show a Traditional Chinese empty state that explains the page is a personal site, without exposing file paths or editor instructions.

#### Scenario: No profile content is published
- **WHEN** a visitor opens `個人資料` and no valid profile name exists
- **THEN** the tab shows an empty-state message in Traditional Chinese
- **THEN** the message does not mention local editing, Vite, or file paths
