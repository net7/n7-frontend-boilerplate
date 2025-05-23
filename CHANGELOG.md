# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For each commit add a description under the Unreleased section under the correspondig section and library (Muruca, Arianna, Dataviz)

## [Unreleased]

Muruca

- Fix hide tab logic

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

-   Update components to  4.3.0

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

-   text viewer, fixed issue on chromium  "'Event.path' is deprecated"
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

[Unreleased]: https://github.com/net7/n7-frontend-boilerplate/compare/v5.2.17...HEAD

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
