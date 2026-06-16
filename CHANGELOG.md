# Changelog

All notable changes to this project will be documented in this file.

The format is based on "Keep a Changelog" and this project follows
[Semantic Versioning](https://semver.org/).

## [1.0.4] - 2026-06-16
### Fixed
- CI: ensured electron-builder receives the correct version (extraMetadata.version) so built artifacts use the expected version.
- CI: upload-artifact globs and debug listing to reliably collect build outputs.
- CI: Windows publish step now runs under bash to avoid PowerShell parsing errors.
- App: on macOS the app now fully quits when all windows close (optional behaviour — can be reverted to macOS convention).
- App: fixed issue with cert files
- Several build/publish issues causing mismatched artifact versions (e.g. DMG showing older version) resolved.

### Changed
- Packaging: cleaned up packaging flow and ensured packaged app package.json version matches project root.
- CI: made publish workflow more robust across platforms (macOS / Windows / Linux).

### Added
- CI: step to sync release/app/package.json with root package.json before packaging.
- Scripts: helper script to delete GitHub Actions runs in bulk (scripts/delete-gh-runs.sh).

## [1.0.3] - 2026-06-15
- CI: update workflow

## [1.0.2] - 2026-06-15
### Changed
- CI: update workflow

### Features
- App: Added support for custom topics/messages
- App: Improved publish section
- App: Added time to received messages

## [1.0.0] - 2026-04-12
- First release version
---

How to use
- Before tagging a release, update the Unreleased section into a new version section (replace date).
- Optionally automate release notes using the changelog file with:
  - peter-evans/create-or-update-release action (use `body_path: CHANGELOG.md`), or
  - `gh release create <tag> -F CHANGELOG.md`.
