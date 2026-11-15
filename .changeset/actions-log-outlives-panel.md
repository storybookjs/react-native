---
'@storybook/addon-ondevice-actions': patch
---

Keep the Actions log when the addon panel unmounts. Actions are now recorded from when the addon registers, so actions fired while the panel is closed, collapsed or rendered in a sheet that unmounts its content show up when it opens again. Repeated identical actions no longer mutate the previous log entry when bumping its count.
