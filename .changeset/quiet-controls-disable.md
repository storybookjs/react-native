---
'@storybook/addon-ondevice-controls': patch
---

Honor `control: false`, `control: { disable: true }` and `table: { disable: true }` argType annotations in the on-device Controls panel, matching Storybook web. Previously only `parameters.controls.exclude` and `include` could hide a control on device, and a disabled control would still render as editable.
