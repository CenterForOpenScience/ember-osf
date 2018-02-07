# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.14.0] - 2018-02-07
### Added
- `osf-model.queryHasMany`, for reliable querying of hasMany relations
- Modal to `file-browser` for moving quick files to projects
- Actions for moving quick files to project/node in `file-browser`
- `get-ancestor-descriptor` helper to create project/node list
- `project-selector` component which helps user choose where to move file
- Translations for `project-selector` component
- Move function for `file` model
- `ember-collapsable-panel` and `ember-power-select` packages
- Styling on `project-selector` buttons that are selected

### Changed
- Node `addChild` model function to create public child elements
- Import compiled css for ember-power-select even when consumin app uses SASS
    - This can be overriden by setting ember-power-select.useSass to true in the app's options
- Node `addChild` model method will only use defaults for undefined parameters (instead of falsey parameters)

### Removed
- ember-data-has-many-query
    - Code that uses `model.query()` should update to `model.queryHasMany()`

## [0.13.1] - 2018-01-11
### Changed
- Updated CHANGELOG to reflect 0.13.0 release

## [0.13.0] - 2018-01-10
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
- Original Publication Date is added to preprint.
  - New `originalPublicationDate` property for `preprint` model.
  - Add unit tests for `preprint` model.
  - `validated-input` component is moved from ember-osf-preprints to ember-osf repo and modified.
    - Change `yarn.lock` to add `ember-bootstrap-datepicker` and `ember-cp-validations` as dependencies.
- Support button to the HOME navbar
- Class for small-display on `file-browser`
- Conditional to check between `files` and `items` in array for file upload between chrome and safari
- alias in provider model to check if has highlighted subjects
- `preprintDoiCreated` attribute to the `preprint` model
- `ember-cli-clipboard` to allow copying to clipboard on more browsers

### Changed
- getContents() function for files to use `redirect = true` and `mode = 'render'`
- Styling for the file-browser, file-browser-item, and file-version widgets used by Quick Files
- Removed `Browse` from the navbar when user is logged out
- Moved `Support` to be between `Search` and `Donate` on the navbar when user is logged out
- Remove print margin on ember-ace editor on file-detail page
- Moved share button in `file-browser-item` to the `file-browser` toolbar
- Rename button to have class `primary` instead of `success` on the `file-browser` component
- What screen sizes columns are displayed in `file-browser` table
- Rename `action` model to `review-action`
  - Also rename related adapter, serializer and tests
  - Added model tests for `review-action`
  - Customize model adapter
- `meta.total` to `meta.total_pages` in osf-serializer
- `hasHighlightedSubjects` path in preprint-providers model

### Fixed
- Margins for scrollbar on `file-browser`
- Clickability on dropzone widget
- Handle Dropzone enable/disable properly
- Prevent users from selecting multiple files by clicking 'Upload' button in Quickfiles

## [0.12.4] - 2017-12-04
### Added
- Final banner images and dates

## [0.12.3] - 2017-11-29
### Added
- Week 3 banner images and text

## [0.12.2] - 2017-11-29
### Fixed
- Giving Tuesday donate banner end date and mobile image class
- Styling and order of buttons on the file-browser to match OSF
- Growl message to show actual error message on file uploads

### Removed
- `?kind=file` from end of file path if there is a conflicting file when uploading

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
