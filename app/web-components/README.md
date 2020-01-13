# Storybook for web-components

---

Storybook for web-components is a UI development environment for your plain web-component snippets.
With it, you can visualize different states of your UI components and develop them interactively.

![Storybook Screenshot](https://github.com/storybookjs/storybook/blob/master/media/storybook-intro.gif)

Storybook runs outside of your app.
So you can develop UI components in isolation without worrying about app specific dependencies and requirements.

## Getting Started

```sh
cd my-app
npx -p @storybook/cli sb init -t web_components
```

For more information visit: [storybook.js.org](https://storybook.js.org)

---

Storybook also comes with a lot of [addons](https://storybook.js.org/addons/introduction) and a great API to customize as you wish.
You can also build a [static version](https://storybook.js.org/basics/exporting-storybook) of your storybook and deploy it anywhere you want.

# Setup page reload via HMR

As web components register on a global registry which only accepts a certain name/class once it can lead to errors when using classical HMR.
There are ideas on how to archive HMR with a static registry but there is no proven solution yet.

Therefore the best approach for now is to do full page reloads.
If you keep your stories to specific states of components (which we would recommend anyways) this usually means it is fast.
To activate full page reload

```js
// ==> REPLACE
configure(require.context('../stories', true, /\.stories\.(js|mdx)$/), module);

// ==> WITH
// force full reload to not reregister web components
const req = require.context('../stories', true, /\.stories\.(js|mdx)$/);
configure(req, module);
if (module.hot) {
  module.hot.accept(req.id, () => {
    const currentLocationHref = window.location.href;
    window.history.pushState(null, null, currentLocationHref);
    window.location.reload();
  });
}
```

# Setup es6/7 dependencies

By default storybook only works with precompiled es5 code but as most web components themselves and their libs are distributed as es7 you will need to manually mark those packages as "needs transpilation".

For example if you have a library called `my-library` which is in es7 then you can add it like so

```js
// .storybook/main.js

module.exports = { 
  webpackFinal: async config => {
    // find web-components rule for extra transpilation
    const webComponentsRule = config.module.rules.find(
      rule => rule.use && rule.use.options && rule.use.options.babelrc === false
    );
    // add your own `my-library`
    webComponentsRule.test.push(new RegExp(`node_modules(\\/|\\\\)my-library(.*)\\.js$`));

    return config;
  },
};
```

By default the following folders are included

- `src/*.js`
- `packages/*/src/*.js`
- `node_modules/lit-html/*.js`
- `node_modules/lit-element/*.js`
- `node_modules/@open-wc/*.js`
- `node_modules/@polymer/*.js`
- `node_modules/@vaadin/*.js`

As you can see the `src` folder is also included.
The reason for that is as it has some extra configuration to allow for example `import.meta`.
If you use a different folder you will need to make sure webpack/babel can handle it.

# FAQ

- While working on my component I get the error `Failed to execute 'define' on 'CustomElementRegistry': the name "..." has already been used with this registry`
  => please see <a href="#user-content-setup-page-reload-via-hmr">Setup page reload via HMR</a>
