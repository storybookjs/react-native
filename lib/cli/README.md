# Storybook CLI
[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)
[![Storybook Slack](https://storybooks-slackin.herokuapp.com/badge.svg)](https://storybooks-slackin.herokuapp.com/)

Storybook CLI is the easiest way to add [Storybook](https://github.com/storybooks/storybook) to your project.

In the future it will also add other useful generators and migration tooling.

![Screenshot](docs/getstorybook.png)

First install the storybook cli globally.

```sh
npm i -g @storybook/cli
```

Then go to your project run:

```sh
getstorybook
```

That's all you've to do.

---

## [Yarn](https://github.com/yarnpkg/yarn) support

It also supports yarn.
If you have installed yarn in your system, it'll detect it and use `yarn` instead of `npm`.

If you don't want to use `yarn` always you can use the `--use-npm` option like this:

```sh
getstorybook --use-npm
```

For more information visit: [storybooks.js.org](https://storybooks.js.org)
