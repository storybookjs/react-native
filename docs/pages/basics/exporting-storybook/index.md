---
id: 'exporting-storybook'
title: 'Exporting Storybook as a Static App'
---

Storybook gives a great developer experience with its dev time features, like instance change updates via Webpack's HMR.

But Storybook is also a tool you can use to showcase your components to others.
Demos of [React Native Web](http://necolas.github.io/react-native-web/storybook/) and [React Dates](http://airbnb.io/react-dates/) are a good example for that.

For that, Storybook comes with a tool to export your storybook into a static web app. Then you can deploy it to GitHub pages or any static hosting service.

Simply add the following NPM script:

```json
{
  "scripts": {
    "storybook": "build-storybook -c .storybook -o .out"
  }
}
```

Then run `npm run storybook`.

This will build the storybook configured in the Storybook directory into a static webpack and place it inside the `.out` directory.
Now you can deploy the content in the `.out` directory wherever you want.

To test it locally, simply run the following commands:

```sh
cd .out
python -m SimpleHTTPServer
```

## Deploying to GitHub Pages

Additionally, you can deploy Storybook directly into GitHub pages with our [storybook-deployer](https://github.com/storybooks/storybook-deployer) tool.

Or, you can simply export your storybook into the docs directory and use it as the root for GitHub pages. Have a look at [this guide](https://github.com/blog/2233-publish-your-project-documentation-with-github-pages) for more information.
