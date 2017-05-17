# Storybook for React Native
[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

With Storybook for React Native you can design and develop individual React Native components without running your app.

![Storybook Screenshot](docs/assets/readme/screenshot.png)

For more information visit: [storybooks.js.org](https://storybooks.js.org)

## Getting Started

The `getstorybook` tool can be used to add Storybook to your React Native app. Install the `getstorybook` tool if necessary and run it from your project directory with these commands:

```shell
npm -g i @storybook/cli
getstorybook
```

## Start the Storybook

After initial setup start the storybook server with the storybook npm script.

```shell
npm run storybook
```

also start your mobile app with the `react-native` command.

```
react-native run-ios
react-native run-android
```

Now, you can open <http://localhost:7007> to view your storybook.

## Learn More

Check the `docs` directory in this repo for more advanced setup guides and other info.
