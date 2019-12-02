---
id: 'exporting-storybook'
title: 'Exporting Storybook as a Static App'
---

Storybook gives a great developer experience with its dev time features, like instant change updates via Webpack's HMR.

But Storybook is also a tool you can use to showcase your components to others.
Demos of [React Native Web](https://necolas.github.io/react-native-web/docs/) and [React Dates](http://airbnb.io/react-dates/) are a good example for that.

For that, Storybook comes with a tool to export your storybook into a static web app. Then you can deploy it to GitHub pages or any static hosting service.

Add the following NPM script:

```json
{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook -o .out"
  }
}
```

Then run `yarn build-storybook`.

This will build the storybook configured in the Storybook directory into a static web app and place it inside the `.out` directory.
Now you can deploy the content in the `.out` directory wherever you want.

To test it locally:

```sh
npx http-server .out
```

## Deploying to GitHub Pages

Additionally, you can deploy Storybook directly into GitHub pages with our [storybook-deployer](https://github.com/storybookjs/storybook-deployer) tool.

Or, you can export your storybook into the docs directory and use it as the root for GitHub pages. Have a look at [this guide](https://github.com/blog/2233-publish-your-project-documentation-with-github-pages) for more information.

## Deploying to ZEIT Now

[ZEIT Now](https://zeit.co/home) is a cloud platform for websites and serverless APIs, that you can use to deploy your Storybook projects to your personal domain (or a free `.now.sh` suffixed URL).

- Install the [Now CLI](https://github.com/zeit/now):

```sh
npm i -g now
```

- Configure your `build` script:

```
`"build": "build-storybook -c .storybook -o public"`
```

- Execute `now` on your terminal.

[Example project](https://github.com/zeit/now-examples/tree/master/storybook) for reference.
