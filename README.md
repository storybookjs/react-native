# Storybook

<p align="center">
  <a href="https://teamcity.jetbrains.com/viewType.html?buildTypeId=OpenSourceProjects_Storybook_Build_2&amp;branch_OpenSourceProjects_Storybook=%3Cdefault%3E&amp;tab=buildTypeStatusDiv"><img src="https://teamcity.jetbrains.com/app/rest/builds/buildType:OpenSourceProjects_Storybook_Build_2/statusIcon.svg" alt="Build Status on TeamCity" /></a>
  <a href="https://circleci.com/gh/storybooks/storybook"><img src="https://circleci.com/gh/storybooks/storybook.svg?style=shield" alt="Build Status on CircleCI" /></a>
  <a href="https://www.codefactor.io/repository/github/storybooks/storybook"><img src="https://www.codefactor.io/repository/github/storybooks/storybook/badge" alt="CodeFactor" /></a>
  <a href="https://snyk.io/test/github/storybooks/storybook"><img src="https://snyk.io/test/github/storybooks/storybook/badge.svg" alt="Known Vulnerabilities" /></a>
  <a href="https://bettercodehub.com/results/storybooks/storybook"><img src="https://bettercodehub.com/edge/badge/storybooks/storybook" alt="BCH compliance" /></a>
  <a href="https://codecov.io/gh/storybooks/storybook"><img src="https://codecov.io/gh/storybooks/storybook/branch/master/graph/badge.svg" alt="codecov" /></a>
  <a href="https://github.com/storybooks/storybook/blob/master/LICENSE"><img src="https://img.shields.io/github/license/storybooks/storybook.svg" alt="License" /></a></p>
</p>
<p align="center">
  <a href="https://discord.gg/sMFvFsG"><img src="https://img.shields.io/badge/discord-join-7289DA.svg?logo=discord&longCache=true&style=flat" /></a>
  <a href="https://now-examples-slackin-rrirkqohko.now.sh/"><img src="https://now-examples-slackin-rrirkqohko.now.sh/badge.svg?logo=slack" alt="Storybook Slack" /></a>
  <a href="#backers"><img src="https://opencollective.com/storybook/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="#sponsors"><img src="https://opencollective.com/storybook/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
</p>

---

Storybook is a development environment for UI components.
It allows you to browse a component library, view the different states of each component, and interactively develop and test components.

## Intro

<center>
  <img src="media/storybook-intro.gif" width="100%" />
</center>

<p align="center">
README for:<br/>
<a href="https://img.shields.io/npm/v/@storybook/core/latest.svg" title="latest"><img alt="latest" src="https://img.shields.io/npm/v/@storybook/core/latest.svg" /></a>
<a href="https://img.shields.io/npm/v/@storybook/core/next.svg" title="next"><img alt="next" src="https://img.shields.io/npm/v/@storybook/core/next.svg" /></a>
</p>

Storybook runs outside of your app. This allows you to develop UI components in isolation, which can improve component reuse, testability, and development speed. You can build quickly without having to worry about application-specific dependencies.

Here are some featured examples that you can reference to see how Storybook works: <https://storybook.js.org/examples/>

Storybook comes with a lot of [addons](https://storybook.js.org/addons/introduction/) for component design, documentation, testing, interactivity, and so on. Storybook's easy-to-use API makes it easy to configure and extend in various ways. It has even been extended to support React Native development for mobile.

## Table of contents

- 🚀[Getting Started](#getting-started)
- 📒[Projects](#projects)
  - 🛠[Supported Frameworks & Examples](#supported-frameworks)
  - 🚇[Sub Projects](#sub-projects)
  - 🔗[Addons](#addons)
- 🏅[Badges & Presentation materials](#badges--presentation-materials)
- 👥[Community](#community)
- 👏[Contributing](#contributing)
  - 👨‍💻[Development scripts](#development-scripts)
  - 💵[Backers](#backers)
  - 💸[Sponsors](#sponsors)

## Getting Started

First install storybook:

```sh
cd my-react-app
npx -p @storybook/cli sb init
```

If you'd rather set up your project manually, take a look at our [Slow Start Guide](https://storybook.js.org/basics/slow-start-guide/).

Once it's installed, you can `npm run storybook` and it will run the development server on your local machine, and give you a URL to browse some sample stories.

**Storybook v2.x migration note**: If you're using Storybook v2.x and want to shift to 4.x version the easiest way is:

```sh
cd my-storybook-v2-app
npx -p @storybook/cli sb init
```

It runs a codemod to update all package names. Read all migration details in our [Migration Guide](MIGRATION.md)

For full documentation on using Storybook visit: [storybook.js.org](https://storybook.js.org)

For additional help, join us [in our Discord](https://discord.gg/sMFvFsG) or [Slack](https://now-examples-slackin-rrirkqohko.now.sh/)

## Projects

### Supported Frameworks

| Framework                        | Demo                                              |                                                                                                |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| [React](app/react)               | [v5.0.0](https://storybooks-official.netlify.com) | [![React](https://img.shields.io/npm/dm/@storybook/react.svg)](app/react)                      |
| [React Native](app/react-native) | -                                                 | [![React Native](https://img.shields.io/npm/dm/@storybook/react-native.svg)](app/react-native) |
| [Vue](app/vue)                   | [v5.0.0](https://storybooks-vue.netlify.com/)     | [![Vue](https://img.shields.io/npm/dm/@storybook/vue.svg)](app/vue)                            |
| [Angular](app/angular)           | [v5.0.0](https://storybooks-angular.netlify.com/) | [![Angular](https://img.shields.io/npm/dm/@storybook/angular.svg)](app/angular)                |
| [Polymer](app/polymer)           | [v5.0.0](https://storybooks-polymer.netlify.com/) | [![Polymer](https://img.shields.io/npm/dm/@storybook/polymer.svg)](app/polymer)                |
| [Mithril](app/mithril)           | [v5.0.0](https://storybooks-mithril.netlify.com/) | [![Mithril](https://img.shields.io/npm/dm/@storybook/mithril.svg)](app/mithril)                |
| [Marko](app/marko)               | [v5.0.0](https://storybooks-marko.netlify.com/)   | [![Marko](https://img.shields.io/npm/dm/@storybook/marko.svg)](app/marko)                      |
| [HTML](app/html)                 | [v5.0.0](https://storybooks-html.netlify.com/)    | [![HTML](https://img.shields.io/npm/dm/@storybook/html.svg)](app/html)                         |
| [Svelte](app/svelte)             | [v5.0.0](https://storybooks-svelte.netlify.com/)  | [![Svelte](https://img.shields.io/npm/dm/@storybook/svelte.svg)](app/svelte)                   |
| [Riot](app/riot)                 | [v5.0.0](https://storybooks-riot.netlify.com/)    | [![Riot](https://img.shields.io/npm/dm/@storybook/riot.svg)](app/riot)                         |
| [Ember](app/ember)               | [v5.0.0](https://storybooks-ember.netlify.com/)   | [![Ember](https://img.shields.io/npm/dm/@storybook/ember.svg)](app/ember)                      |
| [Preact](app/preact)             | [v5.0.0](https://storybooks-preact.netlify.com/)  | [![Preact](https://img.shields.io/npm/dm/@storybook/preact.svg)](app/preact)                   |

### Sub Projects

- [CLI](lib/cli) - Streamlined installation for a variety of app types
- [examples](examples) - Code examples to illustrate different Storybook use cases

### Addons

| Addons                                      |                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------- |
| [a11y](addons/a11y/)                        | Test components for user accessibility in Storybook                        |
| [actions](addons/actions/)                  | Log actions as users interact with components in the Storybook UI          |
| [backgrounds](addons/backgrounds/)          | Let users choose backgrounds in the Storybook UI                           |
| [centered](addons/centered/)                | Center the alignment of your components within the Storybook UI            |
| [cssresources](addons/cssresources/)        | Dynamically add/remove css resources to the component iframe               |
| [events](addons/events/)                    | Interactively fire events to components that respond to EventEmitter       |
| [graphql](addons/graphql/)                  | Query a GraphQL server within Storybook stories                            |
| [google-analytics](addons/google-analytics) | Reports google analytics on stories                                        |
| [info](addons/info/)                        | Annotate stories with extra component usage information                    |
| [jest](addons/jest/)                        | View the results of components' unit tests in Storybook                    |
| [knobs](addons/knobs/)                      | Interactively edit component prop data in the Storybook UI                 |
| [links](addons/links/)                      | Create links between stories                                               |
| [notes](addons/notes/)                      | Annotate Storybook stories with notes                                      |
| [options](addons/options/)                  | Customize the Storybook UI in code                                         |
| [storyshots](addons/storyshots/)            | Easy snapshot testing for components in Storybook                          |
| [storysource](addons/storysource/)          | View the code of your stories within the Storybook UI                      |
| [viewport](addons/viewport/)                | Change display sizes and layouts for responsive components using Storybook |

See [Addon / Framework Support Table](ADDONS_SUPPORT.md)

## Badges & Presentation materials

We have a badge! Link it to your live Storybook example.

![Storybook](https://cdn.jsdelivr.net/gh/storybooks/brand@master/badge/badge-storybook.svg)

```md
[![Storybook](https://cdn.jsdelivr.net/gh/storybooks/brand@master/badge/badge-storybook.svg)](link to site)
```

If you're looking for material to use in your presentation about storybook, like logo's video material and the colors we use etc, you can find all of that at our [press repo](https://github.com/storybooks/press).

## Community

- Tweeting via [@storybookjs](https://twitter.com/storybookjs)
- Blogging at [Medium](https://medium.com/storybookjs)
- Chatting on [Slack](https://now-examples-slackin-rrirkqohko.now.sh/)
- Discussions on [Discord](https://discord.gg/sMFvFsG)
- Streaming saved at [Youtube](https://www.youtube.com/channel/UCr7Quur3eIyA_oe8FNYexfg)

## Contributing

We welcome contributions to Storybook!

- 📥 Pull requests and 🌟 Stars are always welcome.
- Read our [contributing guide](CONTRIBUTING.md) to get started.
  or find us on [Discord](https://discord.gg/sMFvFsG), we're will take the time to guide you

Looking for a first issue to tackle?

- We tag issues with [![Good First Issue](https://img.shields.io/github/issues/storybooks/storybook/good%20first%20issue.svg)](https://github.com/storybooks/storybook/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) when we think they are well suited for people who are new to the codebase or OSS in general.
- [Talk to us](https://discord.gg/sMFvFsG), we'll find something to suits your skills and learning interest.

### Development scripts
Storybook is organized as a monorepo using [Lerna](https://lernajs.io). Useful scripts include:
#### `yarn bootstrap`

> Installs package dependencies and links packages together - using lerna

#### `yarn run publish`

> Push a release to git and npm
> will ask for version in interactive mode - using lerna.

#### `yarn lint`

> boolean check if code conforms to linting rules - uses remark & eslint

- `yarn lint:js` - will check js
- `yarn lint:md` - will check markdown + code samples

- `yarn lint:js --fix` - will automatically fix js

#### `yarn test`

> boolean check if unit tests all pass - uses jest

- `yarn run test --core --watch` - will run core tests in watch-mode

### Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. \[[Become a sponsor](https://opencollective.com/storybook#sponsor)]

<a href="https://opencollective.com/storybook/sponsor/0/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/1/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/2/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/3/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/storybook/sponsor/4/website" target="_blank"><img src="https://opencollective.com/storybook/sponsor/4/avatar.svg"></a>
<a href="https://applitools.com/" target="_blank"><img src="https://file-xvimrfykua.now.sh/"></a>
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

## License

[MIT](https://github.com/storybooks/storybook/blob/master/LICENSE)

-the end-
