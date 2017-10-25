# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

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
