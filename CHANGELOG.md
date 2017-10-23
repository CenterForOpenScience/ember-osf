# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
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
