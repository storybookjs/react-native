# Contributing to Storybook Knobs

We welcome your help to make this component better. This document will help to streamline the contributing process and save everyone's precious time.

## Development Setup

This component has been setup with [React CDK](https://github.com/kadirahq/react-cdk). Refer [React CDK documentation](https://github.com/kadirahq/react-cdk)) to get started with the development.

## Setting Up

You can start the built-in storybook and play with this addon. Do this for that:

```sh
npm i
npm run storybook
```

Storybook lives inside the `example` directory and source code lives in `src` directory.

## Adding a new knob

Adding a new knob is pretty easy. First you need to add the story side API to the `src/index.js`.

Then you need to write the UI component to show/edit this knob inside `src/types` directory. Have a look at existing types for more information.
