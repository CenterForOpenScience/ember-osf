# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Util function that handles popover dismissal when clicking off of popover
- file-browser properties to:
  - disable multiple select
  - disable unselect
  - enable open on select
- ability to specify a pre-selected file in file-browser
- Stylesheet for the footer to match OSF styles
- Analytics to `file-browser` and `file-browser-item` for Quick Files:
  - Share
  - Download
  - Download as zip
  - Upload

### Changed
- getContents() function for files to use `redirect = true` and `mode = 'render'`
- Styling for the file-browser, file-browser-item, and file-version widgets used by Quick Files
- Removed `Browse` from the navbar when user is logged out
- Moved `Support` to be between `Search` and `Donate` on the navbar when user is logged out
- Remove print margin on ember-ace editor on file-detail page

## [0.12.3] - 2017-11-29
### Added
- Week 3 banner images and text

## [0.12.2] - 2017-11-29
### Fixed
- Giving Tuesday donate banner end date and mobile image class

## [0.12.1] - 2017-11-21
### Added
- Giving Tuesday donate banner

## [0.12.0] - 2017-10-27
### Added
- Ability to pass query parameters with adapterOptions.query
- methods to the file model:
  - rename()
  - getGuid()
  - getContents()
  - updateContents()
- file-widget, a file browser widget for quick files
- humanFileSize, converting size number to a readable version like 5kB
- toastr as an npm dependency
- `action` model/adapter/serializer
  - New model in OSF API corresponding to a user-triggered state transition of an object
- fields on `preprint-provider` model:
  - `permissions`
  - `reviewsWorkflow`
  - `reviewsCommentsPrivate`
  - `reviewsCommentsAnonymous`
- properties on `preprint-provider` model:
  - `reviewableStatusCounts`
- fields on `preprint` model
  - `reviewsState`
  - `dateLastTransitioned`
  - `actions`
  - `contributors`
- properties on `preprint` model
  - `uniqueSubjects`
  - `articleDoiUrl`
  - `preprintDoiUrl`
  - `licenseText`
- fields on `user` model:
  - `canViewReviews`
  - `actions`
- `user` property on `currentUser` service
  - Returns a promise proxy object that resolves to the logged-in user or to `null` if no user is logged in
- `loadRelation` function in `utils/load-relationship`
  - Like `loadAll`, but returns a promise proxy that resolves to the full array once the relationship is completely fetched
- old-file-browser component that replicates the legacy file-browser component
- mime-types, checking to see if a file is editable
- file-editor widget to directly edit certain files

### Changed
- Use delete link for delete url, if present
- file-browser-item now formatted to fit in with file-widget
- file-browser-item now supports icons for different file extensions
- dropzone-widget now has custom dropzone class that extends dropzone functionality to conditionally disallow folders and multiple files from being dropped
- 'Search' button in navbar to link to search page
- Moved ember-metrics and ember-toastr to dependencies
- Upgraded ember-toastr to 1.7.0
- Consolidate logic for serializing dirty relationships into `osf-serializer`
  - Override `relationshipTypes` in a serializer to include `fieldName: 'apiType'` pairs of all relationships which may be included when saving updates

### Removed
- toastr from bower dependencies

## [0.11.4] - 2017-10-26
### Fixed
- Make sure results always match latest (and initial) filters selected in discover-page component

## [0.11.3] - 2017-10-25
### Changed
- Attempt authentication before redirecting to CAS in cas-authenticated-route mixin

## [0.11.2] - 2017-10-19
### Changed
- Skip locked sources filter if themeProvider is not set on discover page component

## [0.11.1] - 2017-10-16
### Changed
- Allow non-term level locked filter by using bool in dicover page component

## [0.11.0] - 2017-10-11
### Changed
- In the discover page component, filter by `shareSource` instead of `name` if `shareSource` is set for a provider
- Change navbar links from buttons to anchors
- Point Bower to new Bower registry (https://registry.bower.io)
