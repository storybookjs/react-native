# Storybook

[![Greenkeeper badge](https://badges.greenkeeper.io/storybooks/storybook.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/storybooks/storybook.svg?branch=master)](https://travis-ci.org/storybooks/storybook)
[![CodeFactor](https://www.codefactor.io/repository/github/storybooks/storybook/badge)](https://www.codefactor.io/repository/github/storybooks/storybook)
[![Known Vulnerabilities](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847/badge.svg)](https://snyk.io/test/github/storybooks/storybook/8f36abfd6697e58cd76df3526b52e4b9dc894847)
[![BCH compliance](https://bettercodehub.com/edge/badge/storybooks/storybook)](https://bettercodehub.com/results/storybooks/storybook) [![codecov](https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg)](https://codecov.io/gh/storybooks/storybook)  
[![Storybook Slack](https://now-examples-slackin-nqnzoygycp.now.sh/badge.svg)](https://now-examples-slackin-nqnzoygycp.now.sh/)
[![Backers on Open Collective](https://opencollective.com/storybook/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/storybook/sponsors/badge.svg)](#sponsors)

* * *

Storybook is a development environment for UI components.
It allows you to browse a component library, view the different states of each component, and interactively develop and test components.

## Intro

![Storybook Screenshot](app/react/docs/demo.gif)

Storybook runs outside of your app. This allows you to develop UI components in isolation, which can improve component reuse, testability, and development speed. You can build quickly without having to worry about application-specific dependencies.

Here are some featured examples that you can reference to see how Storybook works: https://storybook.js.org/examples/

Storybook comes with a lot of [addons](https://storybook.js.org/addons/introduction/) for component design, documentation, testing, interactivity, and so on. Storybook's easy-to-use API makes it easy to configure and extend in various ways. It has even been extended to support React Native development for mobile.

## Table of contents

-   [Getting Started](#getting-started)
-   [Projects](#projects)
    -   [Main Projects](#main-projects)
    -   [Sub Projects](#sub-projects)
    -   [Addons](#addons)
-   [Contributing](#contributing)
    -   [Development scripts](#development-scripts)
    -   [Backers](#backers)
    -   [Sponsors](#sponsors)

## Getting Started

First install storybook:

```sh
npm i -g @storybook/cli
cd my-react-app
getstorybook
```

Once it's installed, you can `npm run storybook` and it will run the development server on your local machine, and give you a URL to browse some sample stories.

**Storybook v2.x migration note**: If you're using Storybook v2.x and want to shift to 3.x version the easiest way is:
```sh
npm i -g @storybook/cli
cd my-storybook-v2-app
getstorybook
```
It runs a codemod to update all package names. Read all migration details in our [Migration Guide](MIGRATION.md)

For full documentation on using Storybook visit: [storybook.js.org](https://storybook.js.org)

## Projects

### Main Projects

-   [Storybook for react](app/react) - Storybook for React components
-   [Storybook for react-native](app/react-native) - Storybook for React components

### Sub Projects

-   [CLI](lib/cli) - Streamlined installation for a variety of app types
-   [examples](examples) - Code examples to illustrate different Storybook use cases

### Addons

-   [storyshots](addons/storyshots) - Easy snapshot testing for storybook
-   [actions](addons/actions/) - Log actions as users interact with components in storybook
-   [links](addons/links/) - Create links between stories
-   [comments](addons/comments/) - Comment on storybook stories
-   [graphql](addons/graphql/) - Query a GraphQL server within Storybook stories
-   [info](addons/info/) - Annotate stories with extra component usage information
-   [knobs](addons/knobs/) - Interactively edit component prop data in the Storybook UI
-   [notes](addons/notes/) - Annotate storybook stories with notes
-   [options](addons/options/) - Customize the storybook UI in code

## Contributing

We welcome contributions to Storybook!

-   ⇄ Pull requests and ★ Stars are always welcome.
-   Read our [contributing guide](CONTRIBUTING.md) to get started.

### Development scripts

#### `npm run bootstrap`

> Installs package dependencies and links packages together - using lerna

#### `npm run publish`

> Push a release to git and npm
> will ask for version in interactive mode - using lerna.

#### `npm run lint`

> boolean check if code conforms to linting rules - uses remark & eslint

-   `npm run lint:js` - will check js
-   `npm run lint:md` - will check markdown + code samples

-   `npm run lint:js -- --fix` - will automatically fix js
-   `npm run lint:md -- -o` - will automatically fix markdown

#### `npm run test`

> boolean check if unit tests all pass - uses jest

-   `npm run test:watch` - will run tests in watch-mode

### Backers

Support us with a monthly donation and help us continue our activities. \[[Become a backer](https://opencollective.com/storybook#backer)]

<a href="https://opencollective.com/storybook/backer/0/website" target="_blank"><img src="https://opencollective.com/storybook/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/1/website" target="_blank"><img src="https://opencollective.com/storybook/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/2/website" target="_blank"><img src="https://opencollective.com/storybook/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/3/website" target="_blank"><img src="https://opencollective.com/storybook/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/4/website" target="_blank"><img src="https://opencollective.com/storybook/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/5/website" target="_blank"><img src="https://opencollective.com/storybook/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/6/website" target="_blank"><img src="https://opencollective.com/storybook/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/7/website" target="_blank"><img src="https://opencollective.com/storybook/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/8/website" target="_blank"><img src="https://opencollective.com/storybook/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/9/website" target="_blank"><img src="https://opencollective.com/storybook/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/10/website" target="_blank"><img src="https://opencollective.com/storybook/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/11/website" target="_blank"><img src="https://opencollective.com/storybook/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/12/website" target="_blank"><img src="https://opencollective.com/storybook/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/13/website" target="_blank"><img src="https://opencollective.com/storybook/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/14/website" target="_blank"><img src="https://opencollective.com/storybook/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/15/website" target="_blank"><img src="https://opencollective.com/storybook/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/16/website" target="_blank"><img src="https://opencollective.com/storybook/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/17/website" target="_blank"><img src="https://opencollective.com/storybook/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/18/website" target="_blank"><img src="https://opencollective.com/storybook/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/19/website" target="_blank"><img src="https://opencollective.com/storybook/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/20/website" target="_blank"><img src="https://opencollective.com/storybook/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/21/website" target="_blank"><img src="https://opencollective.com/storybook/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/22/website" target="_blank"><img src="https://opencollective.com/storybook/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/23/website" target="_blank"><img src="https://opencollective.com/storybook/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/24/website" target="_blank"><img src="https://opencollective.com/storybook/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/25/website" target="_blank"><img src="https://opencollective.com/storybook/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/26/website" target="_blank"><img src="https://opencollective.com/storybook/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/27/website" target="_blank"><img src="https://opencollective.com/storybook/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/28/website" target="_blank"><img src="https://opencollective.com/storybook/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/storybook/backer/29/website" target="_blank"><img src="https://opencollective.com/storybook/backer/29/avatar.svg"></a>

### Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. \[[Become a sponsor](https://opencollective.com/storybook#sponsor)]

<a href="https://opencollective.com/storybook/sponsor/0/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/1/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/2/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/3/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/4/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/5/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/6/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/7/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/8/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/9/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/10/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/11/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/12/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/13/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/14/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/15/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/16/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/17/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/18/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/19/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/20/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/21/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/22/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/23/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/24/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/25/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/26/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/27/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/28/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/29/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/29/avatar.svg"></a>
