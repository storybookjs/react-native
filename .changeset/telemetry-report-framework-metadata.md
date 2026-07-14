---
'@storybook/react-native': patch
---

Telemetry: actually send the `dev` event and report framework metadata

React Native runs through Metro/Re.Pack rather than the Storybook core-server, so two things were missing from the `dev` telemetry event:

- The telemetry module's enabled state was never resolved (that normally happens in the core-server), so the event was queued and never sent. `withStorybook` now calls `setTelemetryEnabled(true)` when telemetry is enabled, flushing the event.
- The event was sent without a `configDir`, so `getStorybookMetadata` defaulted to `.storybook` and could not read React Native's `.rnstorybook` config, leaving `metadata.framework` empty. The resolved config path is now passed through.

Applied to the Metro, Re.Pack, and shared `withStorybook` entry points.
