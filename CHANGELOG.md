# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.31.2] - 2021-07-30
- Added a span with an aria label around the search text input box.

## [0.31.1] - 2020-10-08
### Fixed
- broken hypothes.is integration; explicitly set MFR iframe referrer policy to `no-referrer-when-downgrade`

## [0.31.0] - 2020-08-12
### Fixed
- broken user gravatar on the auth dropdown

## [0.30.2] - 2020-07-22
### Removed
- Keen analytics logging

## [0.30.1] - 2020-04-20
### Fixed
- donate link

## [0.30.0] - 2020-04-20
### Changed
- `hasCoi` to allow `null` as value

### Fixed
- `new-navbar-auth-dropdown` fixed for unauthenticated users

## [0.29.0] - 2020-03-25
### Changed
- `hasDataLinks` and `hasPreregLinks` preprint fields to `string`
- preprint-provider model field:
    - `inSloanStudy`

## [0.28.0] - 2020-03-25
### Added
- preprint model fields:
    - `hasCoi`; `conflictOfInterestStatement`
    - `hasDataLinks`; `dataLinks`; `whyNoData`
    - `hasPreregLinks`; `preregLinks`; `whyNoPrereg`; `preregLinkInfo`
- pin node@8.17.0 and yarn@1.21.1 with volta

## [0.27.0] - 2019-12-27
### Changed
- add name field to file-version model

## [0.26.0] - 2019-07-30
### Fixed
- use fixstring transform for preprint-request-action comment

## [0.25.0] - 2019-07-25
### Changed
- `chronos-submission` adapter
    - override urlForUpdateRecord() to construct the correct url
    - override updateRecord() to send PUT/PATCH to endpoint when there's no dirty attrs
- pass html attributes to Textarea component

## [0.24.3] - 2019-07-02
### Fixed
- Update support links

## [0.24.2] - 2019-05-08
### Fixed
- use arrow function for hypothesis post message callback

## [0.24.1] - 2019-05-02
### Fixed
- set hypothesis post message target domain based on render link

## [0.24.0] - 2019-04-09
### Added
- `chronos-journal` model/adapter/serializer
- `chronos-submission` model/adapter/serializer
- `preprint-request` model/adapter/serializer
- `preprint-request-action` model/adapter/serializer
- `lazy-options-load-more` component

# Changed
- `preprint` model - added `requests` relationship
- `lazy-options` component - moved load more button to its own component

# Removed
- `jquery-extensions` instance intializer
- `jquery-checkinview` util

## [0.23.0] - 2019-03-04
### Added
- `X-CSRFToken` header to AJAX requests
- `ember-cookies` to allow getting `api-csrf` token from cookies.

### Removed
- `Ember.merge` usage in favor of `Ember.assign`

## [0.22.1] - 2018-12-13

no change, re-publishing to NPM

## [0.22.0] - 2018-12-13

### Added
- Contributor mixin to share contributor-related methods between nodes and preprints
- New fields added to `preprint` model for node-preprint divorce
- Default message in `old-file-browser` if no files found

### Changed
- Node-preprint divorce changes
- `contributor` model now shared between nodes and preprints. `preprint` relationship added to `contributor` model
- Modify `contributor` adapter to talk to both node/preprint contributor endpoints
- `Preprint` adapter has an option to unset a supplemental project from a preprint
- Fix for building mfrURLs

## [0.21.0] - 2018-09-20
### Added
- Added `dateWithdrawn` and `withdrawalJustification` to `preprint` model
- 'My Preprints' link to the Preprint navbar

### Changed
- `users` model to use urlForQuery to allow searching via `/search/users/`
- Normalize "Add a Preprint" language across screen sizes

## [0.20.1] - 2018-08-16
### Remove unwanted lineage code

## [0.20.0] - 2018-08-16
### Added
- `cookie-banner` component
- Sharing popover button to the discover search page
- Whitelist functionality for preprint discover page
- itemsPerSlide to discover page carousel

### Changed
- Discover page components to include parent lineage if available
- FAQ link in `license-picker` component to point to update help guide article.

### Removed
- institution navbar waffle flag

## [0.19.1] - 2018-08-03
### Fixed
- discover page load delay

## [0.19.0] - 2018-07-25
### Added
- IP anonymization to Keen

### Changed
- spinners to match style guide

### Fixed
- scrolling issue

### Removed
- obsolete `initialWidth` parameter from mfrUrl

## [0.18.0] - 2018-06-21
### Added
- Waffled Institution menu item

### Changed
- `metaschema` model into `registration-metaschema`
- `scheduled-banner` component to display the banner image centered and adapt to different image heights.

## [0.17.1] - 2018-06-20
### Added
- `anonymizeIp: true` in GA config to anonymize sender IP.

## [0.17.0] - 2018-05-29
### Added
- `scheduled-banner` component that pulls banners (created in the OSF Admin app) from the API

### Changed
- Format last edited date in search result like "MMM DDD, YYYY UTC" instead of "YYYY-MM-DD (UTC)"
- `navbar-auth-dropdown` to match current changes to the navbar

### Fixed
- Missing banner translation error

## [0.16.2] - 2018-05-01
### Added
- temporary inline style to sign-up button

## [0.16.1] - 2018-04-26
### Added
- `activeFilters.types` reset when registration provider changes

## [0.16.0] - 2018-04-24
### Added
- `documentType` property to `preprint-service` model.
- `secondary-nav-dropdown` class to `new-navbar-auth-dropdown` component
- `ember-component-css` to bundle all component styles in one `pod-styles.scss` and prevent styling conflicts across components.
- `works` to preprint word translations

### Changed
- static strings to be in translation files
- `bare-strings` option in eslint to `true`
- OSF API version from 2.4 to 2.6
- ember-cli-moment-shim version to `^3.5.3` due to security issues found in `moment` versions before `2.19.3`
- classes and element tags to match styles needed for long name truncation on navbar

### Added
- Add moderator model, serializer, and adapter

## [0.15.0] - 2018-03-06
### Added
- Added "choose your custom citation" section to citation-widget
- `facebookAppId` field to `preprint-provider` model
- Add ElasticSearch preference (ES) key to preprints ES search requests for reproducible results ordering.
- Computed field `name` to `user` model
- Add `description` and `tags` to the preprint model.
- `lazy-options` component to enable lazy loading for `ember-power-select`

### Removed
- Ability to create new components when moving files.

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
