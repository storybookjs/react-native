---
"@storybook/addon-ondevice-controls": patch
---

Fix mapped `select` controls and conditional `if` visibility on device. `useArgs` read `story.args`, which holds the mapped values, while controls expect the raw option keys (`unmappedArgs`) the same way web Storybook does. It now prefers `unmappedArgs`, so mapped selects match their options and `if` conditions that reference a mapped arg evaluate correctly. Native side of storybookjs/storybook#19130.
