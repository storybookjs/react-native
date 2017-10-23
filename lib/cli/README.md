# Storybook CLI

[![Build Status on CircleCI](https://circleci.com/gh/storybooks/storybook.svg?style=shield)](https://circleci.com/gh/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-nqnzoygycp.now.sh/badge.svg)](https://now-examples-slackin-nqnzoygycp.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook CLI (*Command Line Interface*) is the easiest way to add [Storybook](https://github.com/storybooks/storybook) to your project.

In the future it will also add other useful generators and migration tooling.

![Screenshot](docs/getstorybook.png)

First install the storybook CLI globally.

```sh
npm i -g @storybook/cli
```

Then go to your project run:

```sh
getstorybook
```

That's all you've to do.

* * *

## [Yarn](https://github.com/yarnpkg/yarn) support

It also supports yarn.
If you have installed yarn in your system, it'll detect it and use `yarn` instead of `npm`.

If you don't want to use `yarn` always you can use the `--use-npm` option like this:

```sh
getstorybook --use-npm
```

* * *

## [Flow](https://flow.org/) support

It also supports flow files. By default, [jscodeshift](https://github.com/facebook/jscodeshift), the tool used to transform the source files, uses babel to read the files. To be able to transform any flow annotated file, you need to use the flow parser.

```sh
getstorybook --parser flow
```

For more information visit: [storybook.js.org](https://storybook.js.org)
