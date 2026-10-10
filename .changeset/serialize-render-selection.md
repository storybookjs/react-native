---
'@storybook/react-native': patch
---

Fix on-device Controls breaking after Fast Refresh with "cannot render when canvasElement is unset". Story renders now run one at a time, so overlapping Fast Refresh updates, story selection or remote control no longer leave a stale render behind.
