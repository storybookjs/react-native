---
'@storybook/react-native': patch
---

Storybook 11.0.0-beta.1 guards its `window.addEventListener` call for landmark navigation itself, so the `setupListeners` workaround is removed and the minimum `storybook` version is now 11.0.0-beta.1.

`@storybook/mcp` is updated to 11.0.0-beta.1, and the `select-story` MCP tool now points agents to `docs-list` instead of the old `list-all-documentation` tool name.
