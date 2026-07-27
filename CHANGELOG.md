# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For each commit add a description under the Unreleased section under the correspondig section and library (Muruca, Arianna, Dataviz)

## [Unreleased]

Muruca

- Add fragment scroll in static page

## [5.6.7] - 2026-07-23

Muruca

-   Parallel text viewer: Google Docs-style multi-stack for opening divs in lateral columns
-   Parallel text viewer: anti-overlap layout algorithm with active-centric positioning
-   Parallel text viewer: "Click to open" placeholder in empty columns
-   Parallel text viewer: collapsible accordion for full-text authorities
-   Parallel text viewer: dimmed div collapse for authorities and terms with chevron toggle
-   Parallel text viewer: "Contains N syntagms" badge for multi-syntagma terms
-   Parallel text viewer: legend moved to components with i18n support (\_t)
-   Parallel text viewer: labels translation from config via \_t()

## [5.6.6] - 2026-07-15

Muruca

-   Fix label traslation for checkbox facet

## [5.6.5] - 2026-06-29

Muruca

-   Release non RC version

## [5.6.5-rc.1] - 2026-06-22

Muruca

-   Fix scrollElementsIntoView for parallel text viewer

## [5.6.4] - 2026-06-16

Common

-   Apollo provider: escape string values when building the GraphQL query (via `JSON.stringify`), so search terms containing `"`, `\`, or newlines no longer produce an invalid GraphQL document / parse error

## [5.6.3] - 2026-06-16

-   Search facets: validation now accepts a `validator(value) => boolean` function in addition to a `pattern` (RegExp or string)
-   Search layout: consumer apps can override per-facet validation from their layout config via a `facetsValidation` map keyed by `facetId` (set/replace/disable), without forking the default facets config
-   Search facets: fix `TypeError: ... addEventListener, target is null` in entity-links pagination — the scroll container is now resolved by the last links container instead of a `:last-child` group selector, which broke when another facet group (e.g. the date range) is rendered last; also guard against a missing element
-   Search layout: fix the entity-links loading spinner showing its label text — the `.loader-link` style targeted a non-existent nested element; the label is now hidden and the spinner drawn on the link itself
-   Search layout: guard the facets and results requests against a null/failed backend response (e.g. an Elasticsearch query error) so the search degrades gracefully instead of throwing a destructuring `TypeError`

## [5.6.2] - 2026-06-16

Build

-   Bump `@net7/components` to `^4.5.17`, picking up the bubble chart shuffle fix (`shuffle` now runs on first draw instead of being a no-op)

## [5.6.1] - 2026-06-09

Arianna

-   Search facets: config-driven validation for text inputs (`validation: { pattern, message }`) — invalid values surface an accessible error on blur/enter and are no longer applied to the search (the last valid filter is kept); `date-from`/`date-to` validate the supported date formats out of the box
-   Search facets: add `isValid()` (pure check) and `validate()` (reflects error state on the output) to facet inputs, plus a `blurPayload` on the text input model
-   Search facets: replace the consumer-side `AwFacetsWrapperDS.onFacetChange` monkey-patch with this built-in validation seam

## [5.6.0] - 2026-06-05

Build

-   Fix `sync-version.js` to also sync shared dependency versions from root `package.json` into sub-packages, preventing version drift between the published arianna package and the monorepo root

Arianna

-   Bump `ngx-extended-pdf-viewer` to `19.2.0` (Angular 17 compatible), resolving peer dependency conflict on install

## [5.5.28] - 2026-05-25

Muruca

-   Change Parallel TW DS with updated logic for specific highlight

## [5.5.27] - 2026-05-22

Muruca

-   Fix hardcoded name in PDF button

## [5.5.26-rc1] - 2026-05-19

CI

-   Migrate npm publishing to OIDC trusted publishing (remove NPM_TOKEN dependency)
-   Upgrade Node to 24 (required for npm ≥ 11.5.1 OIDC support)
-   Harden develop→master merge with `-X theirs` strategy to prevent conflict failures
-   Auto-detect prerelease versions and publish with `--tag next` instead of `latest`
-   Consolidate release workflow into a single linear job
-   Fix stale `actions/checkout@master` reference in pull request workflow

## [5.5.25] - 2026-05-19

Muruca

-   Copy-protection service add style to message

## [5.5.24] - 2026-05-19

Muruca

-   Add logic to handle start section in parallel text viewer and to change view by click on anchors

## [5.5.23] - 2026-05-15

Muruca

-   Add possibility to add a text to the copy/paste on the website

## [5.5.22] - 2026-05-13

Muruca

-   Use title when download PDF

## [5.5.21] - 2026-04-28

Muruca

-   Add logic to handle baseurl for facsimile in parallel text viewer

## [5.5.20] - 2026-04-22

Muruca

-   Add logic to handle paired anchor apparatus in parallel text viewer

## [5.5.19] - 2026-04-17

Muruca

-   Fix unavailable pin logic in facet map

## [5.5.18] - 2026-04-17

## [5.5.17-rc4] - 2026-04-17

## [5.5.17-rc3] - 2026-04-16

## [5.5.17-rc2] - 2026-04-16

## [5.5.17-rc1] - 2026-04-16

## [5.5.16] - 2026-04-15

## [5.5.14] - 2026-04-15

-   Muruca

-   Add parallel text viewer logic to handle new highlight functionality in TEI Publisher

## [5.5.13] - 2026-04-01

Muruca

-   Fix resource-layout embedded-content
-   Add logic to hide unavailable pin in facet map

## [5.5.12] - 2026-03-30

Muruca

-   Add info popup in section of Advanced Search

## [5.5.11] - 2026-03-04

Muruca

-   Add embedded-content section in resource-layout
-   Fix parallel-text-viewer AS

## [5.5.10] - 2026-03-02

Muruca

-   Add search api to parallel-text-viewer

## [5.5.9] - 2026-02-23

## [5.5.9] - 2026-02-23

Muruca

-   Add `mr-input-typeahead` as a native form input type with debounced API autocomplete, static options (local filtering), Tab-to-complete, match highlighting, and base styles

## [5.5.8] - 2026-02-04

Muruca

-   Add facet identifier

## [5.5.7] - 2026-01-30

Muruca

-   Editable tag label in search

## [5.5.6] - 2026-01-26

Arianna

-   Add date range filter in search layout

## [5.5.5] - 2026-01-21

Muruca

-   Add search bar in hero component

## [5.5.4] - 2026-01-19

Muruca

-   Open readmore before scrolling to an anchor

## [5.5.3] - 2026-01-12

Muruca

-   Minor parallel text viewer fix, fix parallel text viewer config types

## [5.5.2] - 2026-01-07

Muruca

-   Mirador viewer: open a specific annotation

## [5.5.1] - 2025-12-17

## [5.5.0] - 2025-12-17

## [5.4.4] - 2025-12-17

Muruca

-   Add logic in parallel text viewer data source for scrolling elements in index
-   Refactor hq config for search api

## [5.4.3] - 2025-11-11

Muruca

-   Add network-resource ds and eh

## [5.4.2] - 2025-10-30

Muruca

-   Fix facet histogram

## [5.4.1] - 2025-10-20

Muruca

-   Minor fix parallel text viewer, close app button

## [5.4.0] - 2025-10-13

Muruca

-   Add new component: parallel text viewer
-   Add parallel text viewer component ds, eh, layout and style

## [5.3.5] - 2025-09-11

Muruca

-   Add mapCenter option in resource map

## [5.3.4] - 2025-09-02

Muruca

-   Add fragment to search results

## [5.3.3] - 2025-08-06

Muruca

-   Change import for network event handler

## [5.3.2] - 2025-08-06

Muruca

-   Added network layoud id configuration, update components, update mock data for network layout, update interfaces import (now import from components)

## [5.3.1] - 2025-07-24

Muruca

-   Minor fix network layout

## [5.3.0] - 2025-07-08

Muruca

-   Add network layout
-   Minor fix config resource

## [5.2.23-rc2] - 2025-07-07

## [5.2.23-rc1] - 2025-07-07

## [5.2.22] - 2025-06-24

Muruca

-   Fix search-helper

## [5.2.21] - 2025-06-24

Muruca

-   Add configurable libOptions from FE (text-viewer )

## [5.2.20] - 2025-06-20

Muruca

-   Add anchor logic in accordion

## [5.2.19] - 2025-05-28

Muruca

-   Add timeline groups feature

## [5.2.18] - 2025-05-23

Muruca

-   Fix hide tab logic

## [5.2.17] - 2025-05-23

Muruca

-   Add possibility to hide a specific tab
-   Add facsimile options

## [5.2.16] - 2025-05-16

Muruca

-   Add link to advanced seach in normal seach

Arianna

-   Add labels customization and qualification relation

## [5.2.15] - 2025-05-13

Muruca

-   Add metadata in timeline collection

## [5.2.14] - 2025-04-30

Muruca

-   Update components to 4.3.0

## [5.2.13] - 2025-04-18

Muruca

-   Added text-viewer functions to close apparatus items with buttons and fixed css

## [5.2.12] - 2025-04-02

Muruca

-   Added text-viewer functions to handle column-view of the apparatus

## [5.2.11] - 2025-03-24

Muruca

-   Fix css img footer
-   Update Package

## [5.2.10] - 2025-01-31

Muruca

-   Fix bug iiif viewer
-   Add iiif positioning by url

## [5.2.9] - 2024-12-27

Arianna

-   Fix Mirador

## [5.2.8] - 2024-11-25

Arianna

-   Add context-menu config in Mirador

## [5.2.7] - 2024-11-22

Arianna

-   Fix Mirador config

## [5.2.6] - 2024-11-20

Arianna

-   Add Mirador

## [5.2.5] - 2024-10-25

Muruca

-   Add arrow navigation to gallery

## [5.2.4] - 2024-10-24

Muruca

-   Add gallery component in timeline

## [5.2.3] - 2024-09-10

Muruca

-   Fix metadata visualization in itinerary
-   Fix download-pdf when open modal

## [5.2.2] - 2024-08-09

Muruca

-   fix translation of metadata label in collection widget
-   fix css style for wordPress compatibility

## [5.2.1] - 2024-08-07

Muruca

-   Fix map
-   Fix image-viewer

## [5.2.0] - 2024-07-24

Muruca

-   Add download-pdf button

## [5.1.1] - 2024-07-02

Muruca

-   Fix peerDependencies in the projects
-   Fix Mirador component

## [5.1.0] - 2024-06-21

Muruca

-   Mirador component implemented
-   Fix css timeline gallery

## [5.0.0] - 2024-06-20

-   Upgrade angular to version 17
-   Upgrade RxJS to version 7
-   Upgrade ngx-pdf-viewer to version 19
-   Fix TypeErrors

## [4.9.7] - 2024-05-20

Muruca

-   Fix facets separated by comma

## [4.9.6] - 2024-05-13

Muruca

-   Added config-type for Metadata Dynamic

## [4.9.5] - 2024-05-09

Muruca

-   Added Metadata Dynamic component
-   Update timeline layout

## [4.9.4] - 2024-04-19

Muruca

-   Update the math to trigger infinite scroll loading (`search.service.ts`)

## [4.9.3] - 2023-10-30

Muruca

-   Added image viewer overlay details

## [4.9.2] - 2023-10-23

Muruca

-   Added configuration for stati layout
-   Changed static layout routing for multilingual

## [4.9.1] - 2023-10-19

## [4.9.0] - 2023-10-17

Muruca

-   Style: readmore overlay
-   Image viewer - added overlays

## [4.8.5] - 2023-09-22

Muruca

-   Resource Modal - fix multilingual links

## [4.8.3] - 2023-06-21

Muruca

-   Text Viewer - increment timeout interval in load pb-view

## [4.8.2] - 2023-05-29

Muruca

-   Text Viewer - remove document-id from index pb-load

## [4.8.1] - 2023-05-26

Arianna

-   Bubble chart - fix bubble chart height

## [4.8.0] - 2023-05-24

Muruca

-   Text Viewer - refresh pb-view when loaded with page id in url
-   Update visJS dependencies

## [4.7.2] - 2023-04-18

-   Update exports of guards and services

## [4.7.1] - 2023-04-07

Arianna

-   Fix search layout facet custom labels

## [4.7.0] - 2023-03-13

Muruca

-   Resource layout: add additional query params to request from document search parameters

## [4.6.1] - 2023-03-08

Common

-   Add "tranz" Angular pipe, ported from coeso-fe

Muruca

-   Add optional "groupReadmore" config for metadata-readmore
-   Add $content-block-max-height variable
-   Advanced results: show highlight if Toggle title is not provided

Common

-   fix json config service merge method

## [4.5.0] - 2023-02-16

Common

-   added communication service types and spec file

Arianna

-   added head title configuration
-   added gallery layout breadcrumbs tooltip

## [4.4.1] - 2023-02-09

Muruca

-   seach results highlight: refactor link with TEST

## [4.4.0] - 2023-02-07

Muruca

-   facet map: removed hardcoded maxBounds and added libConfig from layout configuration
-   facet map: added autoCenter configuration

## [4.3.0] - 2023-01-23

Muruca

-   added advanced search highlights toggle

## [4.2.4] - 2023-01-20

Muruca

-   text viewer, fixed issue on chromium "'Event.path' is deprecated"
-   communication remove exception
-   added tooltip timeout

## [4.2.3] - 2023-01-13

## [4.2.2] - 2022-12-14

Arianna

-   fix internal search config

Muruca

-   advanced search, bugfix info icon duplicated

## [4.2.1] - 2022-12-14

Muruca

-   advanced search, bugfix info icon duplicated

## [4.2.0] - 2022-12-13

Muruca

-   advanced result layout, enabled reset search button

## [4.1.0] - 2022-12-06

Arianna

-   added configuration in `home-layout.config.ts` to enable "view all" on entitites in bubble chart
-   Added internal search in scheda layout

## [4.0.0] - 2022-12-05

-   upgrade angular to v14x and node to v18x

## [3.9.2] - 2022-10-20

Arianna

-   Fix image viewer navigation refresh

Muruca

-   add style for advanced results
-   advanced results - added logic to add query params to link
-   text viewer - added function to handle highlight API and positioning

Common

-   Edited README.md
-   Added getUrl function to communication service
-   add style for advanced results
-   Edited README.md

## [3.9.1] - 2022-10-12

-   build error. Same as 3.9.0

## [3.9.0] - 2022-10-12

Muruca

-   Added toggle columns option in data source
-   Added text viewer events logic to event handler and data source

## [3.8.1] - 2022-10-04

-   build error. Same as 3.8.0

## [3.8.0] - 2022-09-29

Common

-   fix leaflet version on package

Arianna

-   Added scheda image viewer navigator component (go to page feature)
-   Fix image viewer navigation visibility

## [3.7.3] - 2022-07-29

Arianna

-   Fix extended tree visibility

## [3.7.2] - 2022-07-27

Common

-   Add "n7-" prefix on structural components tags

## [3.7.1] - 2022-07-27

Common

-   Fix error when clearing cardStates

## [3.7.0] - 2022-07-26

### Added

Common

-   Structural components

## [3.6.2] - 2022-07-26

### Fixed

Muruca

-   Fix metadata group resource layout

## [3.6.1] - 2022-07-22

-   Add card-component state management

## [3.6.0] - 2022-07-22

## [3.6.0-rc.2] - 2022-07-22

Workflow

-   Cleanup node setup

## [3.6.0-rc.1] - 2022-07-22

Muruca

-   Add "Readmore" option for resource metadata section groups
-   Add advanced search dynamic options
-   Home "Miseria": better style for homepage with few contents and viewed on large screens.
-   Fix menu external links
-   Add metadata group classes
-   Improved style for static page (contents of wp-block-media-text)

### Fixed

Muruca

-   Fix TextViewer TeiPublisher endpoint

## [v3.5.1] - 2022-06-24

Arianna

-   Fix extended tree pagination submit

## [v3.5.0] - 2022-06-14

### Added

Muruca

-   Added advanced search dynamic options
    Arianna
-   New tree version: extended-tree

## [v3.4.2] - 2022-05-30

### Fixed

Muruca

-   Fix language selector label color in footer
-   Fix itinerary layout locale
-   Fix search links target option

## [v3.4.1]

### Fixed

Muruca

-   Fix map and timeline layout state
-   Fix map and timeline layout locale handler
-   Fix menu service update
-   Fix footer service update
-   Fix locale service path check

## [v3.4.0]

### Added

Muruca

-   Style: added rule for item-preview's border as last element in grid
-   locale and i18n support

## [v3.3.1]

### Changed

All

-   update dependencies
-   removed moment library
-   added dayjs

## [v3.3.0]

### Added

Muruca

-   added input info tooltip

### Changed

Muruca

-   Space \* 0.5
-   Quote style

### Fixed

Muruca

-   Fix muruca search config path
-   Fixed highlight link in advanced search item preview
-   timeline-layout-fix

## [v3.2.2]

### Added

Muruca

-   added input info tooltip
-   added locale and i18n support

### Changed

Muruca

-   Space \* 0.5
-   Quote style

### Fixed

Muruca

-   Fix muruca search config path
-   Fixed highlight link in advanced search item preview
-   timeline-layout-fix

## [v3.2.2]

### Added

-   Add clickOutside directive

## [v3.2.2]

### Changed

-   remove default tilelayer

## [v3.2.2]

### Changed

-   remove default tilelayer

## [v3.2.1]

### Fixed

-   fix-dataviz-dependencies

## [v3.0.0]

### Changed

-   updated imports with new @net7 scope
-   updated github workflow
-   updated eslint and ts-node packages

## [v2.43.0]

### Added

Muruca

-   stile pagina statica
-   stile mappa

A4V

-   url configurabili
-   timeline solo anni

[5.6.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.2

[5.6.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.0...v5.6.1

[5.6.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.28...v5.6.0

[5.5.28]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.27...v5.5.28

[5.5.27]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.26-rc1...v5.5.27

[5.5.26-rc1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.25...v5.5.26-rc1

[5.5.25]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.24...v5.5.25

[5.5.24]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.23...v5.5.24

[5.5.23]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.22...v5.5.23

[5.5.22]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.21...v5.5.22

[5.5.21]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.20...v5.5.21

[5.5.20]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.19...v5.5.20

[5.5.19]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.18...v5.5.19

[5.5.18]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.17-rc4...v5.5.18

[5.5.17-rc4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.17-rc3...v5.5.17-rc4

[5.5.17-rc3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.17-rc2...v5.5.17-rc3

[5.5.17-rc2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.17-rc1...v5.5.17-rc2

[5.5.17-rc1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.16...v5.5.17-rc1

[5.5.16]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.14...v5.5.16

[5.5.14]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.13...v5.5.14

[5.5.13]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.12...v5.5.13

[5.5.12]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.11...v5.5.12

[5.5.11]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.10...v5.5.11

[5.5.10]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.9...v5.5.10

[5.5.9]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.8...v5.5.9

[5.5.8]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.7...v5.5.8

[5.5.7]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.6...v5.5.7

[5.5.6]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.5...v5.5.6

[5.5.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.4...v5.5.5

[5.5.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.3...v5.5.4

[5.5.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.2...v5.5.3

[5.5.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.1...v5.5.2

[5.5.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.5.0...v5.5.1

[5.5.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.4.4...v5.5.0

[5.4.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.4.3...v5.4.4

[5.4.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.4.2...v5.4.3

[5.4.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.4.1...v5.4.2

[5.4.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.4.0...v5.4.1

[5.4.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.5...v5.4.0

[5.3.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.4...v5.3.5

[5.3.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.3...v5.3.4

[5.3.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.2...v5.3.3

[5.3.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.1...v5.3.2

[5.3.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.3.0...v5.3.1

[5.3.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.23-rc2...v5.3.0

[5.2.23-rc2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.23-rc1...v5.2.23-rc2

[5.2.23-rc1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.22...v5.2.23-rc1

[5.2.22]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.21...v5.2.22

[5.2.21]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.20...v5.2.21

[5.2.20]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.19...v5.2.20

[5.2.19]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.18...v5.2.19

[5.2.18]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.17...v5.2.18

[5.2.17]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.16...v5.2.17

[5.2.16]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.15...v5.2.16

[5.2.15]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.14...v5.2.15

[5.2.14]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.13...v5.2.14

[5.2.13]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.12...v5.2.13

[5.2.12]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.11...v5.2.12

[5.2.11]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.10...v5.2.11

[5.2.10]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.9...v5.2.10

[5.2.9]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.8...v5.2.9

[5.2.8]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.7...v5.2.8

[5.2.7]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.6...v5.2.7

[5.2.6]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.5...v5.2.6

[5.2.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.4...v5.2.5

[5.2.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.3...v5.2.4

[5.2.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.2...v5.2.3

[5.2.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.1...v5.2.2

[5.2.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.0...v5.2.1

[5.2.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.1.1...v5.2.0

[5.1.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.1.0...v5.1.1

[5.1.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.0.0...v5.1.0

[5.0.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.7...v5.0.0

[4.9.7]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.6...v4.9.7

[4.9.6]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.5...v4.9.6

[4.9.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.4...v4.9.5

[4.9.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.3...v4.9.4

[4.9.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.2...v4.9.3

[4.9.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.1...v4.9.2

[4.9.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.9.0...v4.9.1

[4.9.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.8.5...v4.9.0

[4.8.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.8.3...v4.8.5

[4.8.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.8.2...v4.8.3

[4.8.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.8.1...v4.8.2

[4.8.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.8.0...v4.8.1

[4.8.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.7.2...v4.8.0

[4.7.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.7.1...v4.7.2

[4.7.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.7.0...v4.7.1

[4.7.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.6.1...v4.7.0

[4.6.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.6.1-rc.1...v4.6.1

[4.6.1-rc.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.6.0...v4.6.1-rc.1

[4.6.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.5.1...v4.6.0

[4.5.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.5.0...v4.5.1

[4.5.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.4.1...v4.5.0

[4.4.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.4.0...v4.4.1

[4.4.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.3.0...v4.4.0

[4.3.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.2.4...v4.3.0

[4.2.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.2.3...v4.2.4

[4.2.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.2.2...v4.2.3

[4.2.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.2.1...v4.2.2

[4.2.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.2.0...v4.2.1

[4.2.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.1.0...v4.2.0

[4.1.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v4.0.0...v4.1.0

[4.0.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.9.2...v4.0.0

[3.9.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.9.1...v3.9.2

[3.9.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.9.0...v3.9.1

[3.9.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.8.1...v3.9.0

[3.8.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.8.0...v3.8.1

[3.8.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.7.3...v3.8.0

[3.7.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.7.2...v3.7.3

[3.7.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.7.1...v3.7.2

[3.7.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.7.0...v3.7.1

[3.7.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.6.2...v3.7.0

[3.6.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.6.1...v3.6.2

[3.6.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.6.0...v3.6.1

[3.6.0]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.6.0-rc.2...v3.6.0

[3.6.0-rc.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.6.0-rc.1...v3.6.0-rc.2

[3.6.0-rc.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.4.2...v3.6.0-rc.1

[v3.4.2]: https://github.com/net7/n7-frontend-boilerplate/compare/v3.4.1...v3.4.2

[Unreleased]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.7...HEAD

[5.6.7]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.7

[5.6.6]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.6

[5.6.5]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.5

[5.6.5-rc.1]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.5-rc.1

[5.6.4]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.4

[5.6.3]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.6.1...v5.6.3
