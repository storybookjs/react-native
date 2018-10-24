# Storybook for Svelte

Storybook for Svelte is a UI development environment for your Svelte components.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybooks/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-svelte-app
npx -p @storybook/cli@rc sb init
```

For more information visit: [storybook.js.org](https://storybook.js.org)

---

Storybook also comes with a lot of [addons](https://storybook.js.org/addons/introduction) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/basics/exporting-storybook) of your storybook and deploy it anywhere you want.

## TODOs

- [ ] Support `addon-info`
- [ ] Support Svelte markup directly in stories
- [ ] Add Svelte storybook generator
- [ ] Provide stories that show advanced Svelte use cases
- [ ] Hydratable
- [ ] Advanced mount options
