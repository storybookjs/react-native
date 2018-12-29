# Storybook for Vue

Storybook for Vue is a UI development environment for your Vue components.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybooks/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-vue-app
npx -p @storybook/cli sb init
```

For more information visit: [storybook.js.org](https://storybook.js.org)

## Starter Storybook-for-Vue Boilerplate project with [Vuetify](https://github.com/vuetifyjs/vuetify) Material Component Framework

<https://github.com/white-rabbit-japan/vuetify-storyboard-boilerplate>

---

Storybook also comes with a lot of [addons](https://storybook.js.org/addons/introduction) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/basics/exporting-storybook) of your storybook and deploy it anywhere you want.

## Vue Notes

- When using global custom components or extension (e.g `Vue.use`). You will need to declare those in the `./storybook/config.js`.

## Known Limitations

In Storybook story and decorator components you can not access the Vue instance
in factory functions for default prop values:

```js
{
  props: {
    foo: {
      default() {
        return this.bar; // does not work!
      }
    }
  }
}
```
