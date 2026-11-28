---
'@storybook/react-native': minor
---

Add the `sb-rn` CLI for coding agents and people. `sb-rn docs` looks up component props and usage examples from story files, and `sb-rn stories select`, `args update`, `args reset`, `globals update` and `status` drive Storybook on the device and wait for it to confirm. `sb-rn skills` prints agent instructions.

The channel server gains `GET /state`, `POST /update-args-sync`, `/reset-args-sync` and `/update-globals-sync`, and `/select-story-sync` accepts a `timeout` and fails as soon as the story errors. The MCP server gains `get-device-state`, `update-story-args`, `reset-story-args` and `update-globals`, and `select-story` now waits for the story to render.
