# 3.3.0-alpha.4

2017-November-22

#### Bug Fixes

-   Fix HMR by saving the preview frame URL as the story changes [#2349](https://github.com/storybooks/storybook/pull/2349)
-   Fix CLI babel transpilation [#2350](https://github.com/storybooks/storybook/pull/2350)

# 3.3.0-alpha.3

2017-November-07

#### Features

-   Add angular support: Storybook for Angular [#1474](https://github.com/storybooks/storybook/pull/1474)
-   Fix addon Knobs: add array in Object PropTypes [#2227](https://github.com/storybooks/storybook/pull/2227)
-   Adds error when storyshots finds no stories [#2079](https://github.com/storybooks/storybook/pull/2079)
-   Add addon background to monorepo [#2220](https://github.com/storybooks/storybook/pull/2220)
-   Add ability to parse line breaks into <br/> for Docgen descriptions [#2053](https://github.com/storybooks/storybook/pull/2053)

#### Bug Fixes

-   Move LinkTo component to a separate `addon-links/react` endpoint [#2239](https://github.com/storybooks/storybook/pull/2239)
-   Fix Array Knob deserialization [#2217](https://github.com/storybooks/storybook/pull/2217)
-   Return the test in storyshots to respect promises. [#2218](https://github.com/storybooks/storybook/pull/2218)
-   Knobs refactor accidentally removed select [#2210](https://github.com/storybooks/storybook/pull/2210)
-   Add HMR to other RN app templates [#2213](https://github.com/storybooks/storybook/pull/2213)
-   Autoload all `*.stories.js` files in cli templates [#2195](https://github.com/storybooks/storybook/pull/2195)
-   Fix info upgrade codemod failing when optional description string is not supplied [#2138](https://github.com/storybooks/storybook/pull/2138)
-   Fix `flex-basis` of `DownPanel` content div [#2126](https://github.com/storybooks/storybook/pull/2126)

#### Documentation

-   Updated local test documentation [#2224](https://github.com/storybooks/storybook/pull/2224)
-   Add state addon to the addons page [#2012](https://github.com/storybooks/storybook/pull/2012)
-   Add community addon to add the ability to customize styles in the story preview area [#2007](https://github.com/storybooks/storybook/pull/2007)
-   Add Figma addon to community supported section [#2009](https://github.com/storybooks/storybook/pull/2009)
-   Update storybook-router description in the addon gallery. [#1991](https://github.com/storybooks/storybook/pull/1991)

#### Maintenance

-   FIX `yarn test` & selecting only core [#2219](https://github.com/storybooks/storybook/pull/2219)
-   CLI test: always remove `run` directory before exiting [#2201](https://github.com/storybooks/storybook/pull/2201)
-   Bot for closing old issues [#2186](https://github.com/storybooks/storybook/pull/2186)

#### Dependency Upgrades

-   Update react-native from 0.43.4 to 0.49.3 in app/react-native [#1971](https://github.com/storybooks/storybook/pull/1971)
-   React-Native - Docs - Add Issues section for Android Emulator [#2078](https://github.com/storybooks/storybook/pull/2078)
-   Upgrade eslint-config-airbnb and make it pass [#2212](https://github.com/storybooks/storybook/pull/2212)

# 3.3.0-alpha.2

2017-October-03

#### Features

-   Ability for custom storyshots testFunctions to utilise "snapshot per story file" [#1841](https://github.com/storybooks/storybook/pull/1841)
-   Viewport Addon [#1753](https://github.com/storybooks/storybook/pull/1753)
-   More detailed props table [#1485](https://github.com/storybooks/storybook/pull/1485)
-   RN: Add accessibility labels to OnDeviceUI [#1780](https://github.com/storybooks/storybook/pull/1780)
-   Have Stories on each level of hierarchy [#1763](https://github.com/storybooks/storybook/pull/1763)
-   Viewport Addon [#1740](https://github.com/storybooks/storybook/pull/1740)
-   Generate snapshot per story file [#1584](https://github.com/storybooks/storybook/pull/1584)
-   addon-links: add `LinkTo` component, and `hrefTo` function [#1829](https://github.com/storybooks/storybook/pull/1829)

#### Bug Fixes

-   CLI: Use actions in sample stories for vue + fix them in SFC_VUE template [#1867](https://github.com/storybooks/storybook/pull/1867)
-   Improve rendering of 'types' in addon-actions [#1887](https://github.com/storybooks/storybook/pull/1887)
-   Circular json can possibly hang [#1881](https://github.com/storybooks/storybook/pull/1881)
-   Use HtmlWebpackPlugin to import all assets (importing chunks in order) [#1775](https://github.com/storybooks/storybook/pull/1775)
-   Fix preview scrolling [#1782](https://github.com/storybooks/storybook/pull/1782)
-   Search box: make found options selectable with click [#1697](https://github.com/storybooks/storybook/pull/1697)
-   Fix Docgen in static builds for Info [#1725](https://github.com/storybooks/storybook/pull/1725)
-   Return empty array when Array knob is empty [#1811](https://github.com/storybooks/storybook/pull/1811)

#### Documentation

-   Make dependencies more deterministic [#1703](https://github.com/storybooks/storybook/pull/1703)
-   Synced changes from new-docs to CONTRIBUTING.md [#1911](https://github.com/storybooks/storybook/pull/1911)
-   Fix incorrect yarn command in docs [#1758](https://github.com/storybooks/storybook/pull/1758)

#### Maintenance

-   Drop "Install latest yarn version" step on CI [#1910](https://github.com/storybooks/storybook/pull/1910)
-   CLI: A more human-friendly message for undetected project types [#1825](https://github.com/storybooks/storybook/pull/1825)
-   CLI: handle promise rejections [#1826](https://github.com/storybooks/storybook/pull/1826)
-   Add tests for CLI [#1767](https://github.com/storybooks/storybook/pull/1767)
-   Yarn workspaces [#1810](https://github.com/storybooks/storybook/pull/1810)
-   Knobs: allow arrays in object knob proptypes [#1701](https://github.com/storybooks/storybook/pull/1701)
-   Deprecate confusing option names [#1692](https://github.com/storybooks/storybook/pull/1692)
-   A CLI for running specific tests suites, like bootstrap CLI [#1752](https://github.com/storybooks/storybook/pull/1752)
-   Remove check for sender on channel. [#1407](https://github.com/storybooks/storybook/pull/1407)
-   Exit with code 1 if `start-storybook --smoke-test` fails [#1851](https://github.com/storybooks/storybook/pull/1851)
-   Refactor CLI [#1840](https://github.com/storybooks/storybook/pull/1840)
-   Refactor knobs - no longer include all runtimes [#1832](https://github.com/storybooks/storybook/pull/1832)
-   Added addon-knobs to crna and vanilla react native. [#1636](https://github.com/storybooks/storybook/pull/1636)

#### Dependency Upgrades

-   Add config for dependencies.io [#1770](https://github.com/storybooks/storybook/pull/1770)

# 3.3.0-alpha.0

2017-September-06

#### Features

-   Viewport addon: simulate device sizes in preview window [#1753](https://github.com/storybooks/storybook/pull/1753)
-   CLI: Add codemod for deprecated addon-links and addon-actions from app [#1368](https://github.com/storybooks/storybook/pull/1368)
-   Info addon: More detailed props table [#1485](https://github.com/storybooks/storybook/pull/1485)
-   React native: Add accessibility labels to OnDeviceUI [#1780](https://github.com/storybooks/storybook/pull/1780)
-   Stories panel: Stories on each hierarchy level [#1763](https://github.com/storybooks/storybook/pull/1763)
-   Storyshots: Generate snapshot per story file [#1584](https://github.com/storybooks/storybook/pull/1584)
-   CLI: Add support for Vue projects using Nuxt [#1794](https://github.com/storybooks/storybook/pull/1794)

#### Bug Fixes

-   Import chunks/assets in correct order using HtmlWebpackPlugin [#1775](https://github.com/storybooks/storybook/pull/1775)
-   Fix preview scrolling [#1782](https://github.com/storybooks/storybook/pull/1782)
-   Height aligned 2 buttons in manager's header [#1769](https://github.com/storybooks/storybook/pull/1769)
-   Search box: make found options selectable with click [#1697](https://github.com/storybooks/storybook/pull/1697)
-   Info addon: Fix Docgen in static builds [#1725](https://github.com/storybooks/storybook/pull/1725)
-   Knobs: allow arrays in object knob proptypes [#1701](https://github.com/storybooks/storybook/pull/1701)

#### Documentation

-   Improve linkTo documentation [#1793](https://github.com/storybooks/storybook/pull/1793)
-   Add carbon to examples page [#1764](https://github.com/storybooks/storybook/pull/1764)
-   Minor grammar fixes and clarification to Vue documentation [#1756](https://github.com/storybooks/storybook/pull/1756)
-   Fix incorrect yarn command in docs [#1758](https://github.com/storybooks/storybook/pull/1758)
-   Add storybook-chrome-screenshot to addon gallery [#1761](https://github.com/storybooks/storybook/pull/1761)
-   Fixing typo on VueJS withNotes Example [#1787](https://github.com/storybooks/storybook/pull/1787)

#### Maintenance

-   Deprecate confusing option names [#1692](https://github.com/storybooks/storybook/pull/1692)
-   A CLI for running specific tests suites, like bootstrap CLI [#1752](https://github.com/storybooks/storybook/pull/1752)
-   Remove check for sender on channel. [#1407](https://github.com/storybooks/storybook/pull/1407)
-   Use yarn instead of NPM [#1703](https://github.com/storybooks/storybook/pull/1703)
-   Add config for dependencies.io [#1770](https://github.com/storybooks/storybook/pull/1770)
-   Added addon-knobs to crna and vanilla react native. [#1636](https://github.com/storybooks/storybook/pull/1636)
-   Fixed Jest warnings [#1744](https://github.com/storybooks/storybook/pull/1744)
-   Smoke test master [#1801](https://github.com/storybooks/storybook/pull/1801)

#### Dependency Upgrades

-   Upgrade root dependencies and sync with packages [#1802](https://github.com/storybooks/storybook/pull/1802)
-   Update jest to the latest version 🚀 [#1799](https://github.com/storybooks/storybook/pull/1799)
-   Update eslint-plugin-jest to the latest version 🚀 [#1795](https://github.com/storybooks/storybook/pull/1795)
-   Update lerna to the latest version 🚀 [#1768](https://github.com/storybooks/storybook/pull/1768)

# 3.2.16

2017-November-15

#### Features

-   Add addon-a11y to monorepo [#2292](https://github.com/storybooks/storybook/pull/2292)

#### Bug Fixes

-   Addon actions: replace eval with function name assignment [#2321](https://github.com/storybooks/storybook/pull/2321)
-   FIX propwarning on basebutton && ADD style prop on basebutton [#2305](https://github.com/storybooks/storybook/pull/2305)
-   React-native: fix drawer width [#2300](https://github.com/storybooks/storybook/pull/2300)

#### Maintenance

-   Add Previews of deployed examples via Netlify [#2304](https://github.com/storybooks/storybook/pull/2304)

#### Dependency Upgrades

<details>
<summary>
30 upgrades
</summary>

-   Update 5 dependencies from npm [#2312](https://github.com/storybooks/storybook/pull/2312)
-   Upgraded gatsby-link in `docs` from `1.6.27` to `1.6.28` [#2311](https://github.com/storybooks/storybook/pull/2311)
-   Upgraded gatsby-plugin-sharp in `docs` from `1.6.20` to `1.6.21` [#2311](https://github.com/storybooks/storybook/pull/2311)
-   Upgraded gatsby-remark-images in `docs` from `1.5.31` to `1.5.32` [#2311](https://github.com/storybooks/storybook/pull/2311)
-   Upgraded gatsby in `docs` from `1.9.108` to `1.9.112` [#2308](https://github.com/storybooks/storybook/pull/2308)
-   Upgraded gatsby-link in `docs` from `1.6.26` to `1.6.27` [#2308](https://github.com/storybooks/storybook/pull/2308)
-   Upgraded gatsby-remark-copy-linked-files in `docs` from `1.5.20` to `1.5.21` [#2308](https://github.com/storybooks/storybook/pull/2308)
-   Upgraded gatsby-transformer-remark in `docs` from `1.7.20` to `1.7.21` [#2308](https://github.com/storybooks/storybook/pull/2308)
-   Upgraded react-textarea-autosize in `addons/events` from `5.2.0` to `5.2.1` [#2309](https://github.com/storybooks/storybook/pull/2309)
-   Upgraded react-datetime in `addons/knobs` from `2.10.3` to `2.11.0` [#2309](https://github.com/storybooks/storybook/pull/2309)
-   Upgraded react-textarea-autosize in `addons/knobs` from `5.2.0` to `5.2.1` [#2309](https://github.com/storybooks/storybook/pull/2309)
-   Upgraded react-textarea-autosize in `addons/comments` from `5.2.0` to `5.2.1` [#2309](https://github.com/storybooks/storybook/pull/2309)
-   Upgraded moment in `addons/knobs` from `2.19.1` to `2.19.2` [#2293](https://github.com/storybooks/storybook/pull/2293)
-   Upgraded moment in `addons/comments` from `2.19.1` to `2.19.2` [#2293](https://github.com/storybooks/storybook/pull/2293)
-   Upgraded gatsby in `docs` from `1.9.100` to `1.9.108` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-link in `docs` from `1.6.24` to `1.6.26` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-plugin-sharp in `docs` from `1.6.19` to `1.6.20` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-remark-autolink-headers in `docs` from `1.4.7` to `1.4.8` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-remark-copy-linked-files in `docs` from `1.5.16` to `1.5.20` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-remark-images in `docs` from `1.5.30` to `1.5.31` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-source-filesystem in `docs` from `1.5.7` to `1.5.8` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Upgraded gatsby-transformer-remark in `docs` from `1.7.19` to `1.7.20` [#2294](https://github.com/storybooks/storybook/pull/2294)
-   Update lint-staged to 5.0.0 [#2291](https://github.com/storybooks/storybook/pull/2291)
-   Upgraded eslint in `/` from `4.10.0` to `4.11.0` [#2290](https://github.com/storybooks/storybook/pull/2290)
-   Upgraded puppeteer in `/` from `0.12.0` to `0.13.0` [#2290](https://github.com/storybooks/storybook/pull/2290)
-   Update 6 dependencies from npm [#2286](https://github.com/storybooks/storybook/pull/2286)
-   Update React to 16.1.0 [#2285](https://github.com/storybooks/storybook/pull/2285)
-   Update 4 dependencies from npm [#2284](https://github.com/storybooks/storybook/pull/2284)
-   use @storybook published deprecated dependencies [#2314](https://github.com/storybooks/storybook/pull/2314)
-   Update inquirer to 4.0.0 [#2298](https://github.com/storybooks/storybook/pull/2298)

</details>

# 3.2.15

2017-November-10

#### Features

-   Optimizing for iphone x [#2260](https://github.com/storybooks/storybook/pull/2260)
-   Fix accessibility warnings [#2270](https://github.com/storybooks/storybook/pull/2270)

#### Bug Fixes

-   Fix propTypes in addon-background [#2279](https://github.com/storybooks/storybook/pull/2279)
-   Addon-info: allow duplicate displayNames [#2269](https://github.com/storybooks/storybook/pull/2269)
-   Fix browser navigation [#2261](https://github.com/storybooks/storybook/pull/2261)

#### Maintenance

-   Fixes to build scripts for Windows. [#2051](https://github.com/storybooks/storybook/pull/2051)
-   Update dependencies.yml to include batch updates for docs dependencies [#2252](https://github.com/storybooks/storybook/pull/2252)

#### Dependency Upgrades

<details>
<summary>
11 PRs
</summary>

-   Update 4 dependencies from npm [#2267](https://github.com/storybooks/storybook/pull/2267)
-   Update 8 dependencies from npm [#2262](https://github.com/storybooks/storybook/pull/2262)
-   Update 3 dependencies from npm [#2257](https://github.com/storybooks/storybook/pull/2257)
-   Update babel-eslint in / from 8.0.1 to 8.0.2 [#2253](https://github.com/storybooks/storybook/pull/2253)
-   3 packages updated by dependencies.io [#2251](https://github.com/storybooks/storybook/pull/2251)
-   Update devDependencies [#2232](https://github.com/storybooks/storybook/pull/2232)
-   Update react-textarea-autosize to 5.1.0 [#2233](https://github.com/storybooks/storybook/pull/2233)
-   Update insert-css to 2.0.0 [#2234](https://github.com/storybooks/storybook/pull/2234)
-   Update file-loader to 1.1.5 [#2236](https://github.com/storybooks/storybook/pull/2236)
-   Update read-pkg-up to 3.0.0 [#2237](https://github.com/storybooks/storybook/pull/2237)
-   Update react-modal to 3.1.0 [#2238](https://github.com/storybooks/storybook/pull/2238)

</details>

# 3.2.14

2017-November-01

#### Features

-   React-native: Add platform option for haul bundler [#2129](https://github.com/storybooks/storybook/pull/2129)

#### Bug Fixes

-   Fixed addon-info not importing docgen descriptions [#2133](https://github.com/storybooks/storybook/pull/2133)
-   Handle full screen scrolling on iOS [#2040](https://github.com/storybooks/storybook/pull/2040)
-   Fixed infinite render loop [#2100](https://github.com/storybooks/storybook/pull/2100)
-   Fix hmr in react-native template [#2194](https://github.com/storybooks/storybook/pull/2194)
-   Fix prop type in react-native [#2185](https://github.com/storybooks/storybook/pull/2185)
-   Avoid logging an object on compilation errors [#2199](https://github.com/storybooks/storybook/pull/2199)

#### Documentation

-   CRA Example Cleanup - Info [#2143](https://github.com/storybooks/storybook/pull/2143)

#### Maintenance

-   IMPROVE integration tests so they all output a diff image when multiple fail [#2197](https://github.com/storybooks/storybook/pull/2197)
-   ADD integration artefacts store step to circle.yml [#2182](https://github.com/storybooks/storybook/pull/2182)
-   ADD integration test [#2119](https://github.com/storybooks/storybook/pull/2119)
-   Updating to new favicon [#2113](https://github.com/storybooks/storybook/pull/2113)
-   Bot for closing old issues [#2186](https://github.com/storybooks/storybook/pull/2186)

#### Dependency Upgrades

<details>
<summary>
12 PRs
</summary>

-   7 packages updated by dependencies.io [#2200](https://github.com/storybooks/storybook/pull/2200)
-   Update jest-image-snapshot to 2.1.0 [#2184](https://github.com/storybooks/storybook/pull/2184)
-   2 packages updated by dependencies.io [#2175](https://github.com/storybooks/storybook/pull/2175)
-   3 packages updated by dependencies.io [#2137](https://github.com/storybooks/storybook/pull/2137)
-   2 packages updated by dependencies.io [#2131](https://github.com/storybooks/storybook/pull/2131)
-   4 packages updated by dependencies.io [#2124](https://github.com/storybooks/storybook/pull/2124)
-   2 packages updated by dependencies.io [#2116](https://github.com/storybooks/storybook/pull/2116)
-   5 packages updated by dependencies.io [#2111](https://github.com/storybooks/storybook/pull/2111)
-   4 packages updated by dependencies.io [#2109](https://github.com/storybooks/storybook/pull/2109)
-   Add index.js file for RN 0.49 [#2176](https://github.com/storybooks/storybook/pull/2176)
-   Enable issue creation for dependencies.io [#2141](https://github.com/storybooks/storybook/pull/2141)
-   Major updates in devDependencies [#2178](https://github.com/storybooks/storybook/pull/2178)

</details>

# 3.2.13

2017-October-20

#### Features

-   Knobs addon: new knob type `button` [#2004](https://github.com/storybooks/storybook/pull/2004)
-   Vue: Support JSX for Vue Components [#1993](https://github.com/storybooks/storybook/pull/1993)
-   Vue CLI: support Nuxt.js projects [#2056](https://github.com/storybooks/storybook/pull/2056)

#### Bug Fixes

-   UI: ix sidebar header wrapping [#1962](https://github.com/storybooks/storybook/pull/1962)
-   Vue: Make Vue a peer dependency [#2041](https://github.com/storybooks/storybook/pull/2041)

#### Documentation

-   Update empty addons channel bug description [#1977](https://github.com/storybooks/storybook/pull/1977)
-   Fix README.md example for addons/info [#1960](https://github.com/storybooks/storybook/pull/1960)

#### Maintenance

-   Dirty-check repo state on CI to ensure lockfiles being up-to-date [#1980](https://github.com/storybooks/storybook/pull/1980)
-   Enable batch mode for dependencies.io [#2093](https://github.com/storybooks/storybook/pull/2093)
-   Fixed lifecycle twice executing (closes #1742) [#1983](https://github.com/storybooks/storybook/pull/1983)
-   Disable npm publish on all non-master branches [#1963](https://github.com/storybooks/storybook/pull/1963)
-   Fix lerna.json to ignore vue-kitchen-sink correctly [#1944](https://github.com/storybooks/storybook/pull/1944)

#### Dependency Upgrades

<details>
<summary>
66 PRs
</summary>

-   2 packages updated by dependencies.io [#2097](https://github.com/storybooks/storybook/pull/2097)
-   2 packages updated by dependencies.io [#2094](https://github.com/storybooks/storybook/pull/2094)
-   Update deps [#2090](https://github.com/storybooks/storybook/pull/2090)
-   Update enzyme-adapter-react-16 from 1.0.1 to 1.0.2 in / [#2068](https://github.com/storybooks/storybook/pull/2068)
-   Update deps [#2077](https://github.com/storybooks/storybook/pull/2077)
-   Update webpack-hot-middleware from 2.19.1 to 2.20.0 in app/react [#2060](https://github.com/storybooks/storybook/pull/2060)
-   Update webpack-hot-middleware from 2.19.1 to 2.20.0 in app/react-native [#2059](https://github.com/storybooks/storybook/pull/2059)
-   Update @types/react from 16.0.10 to 16.0.11 in addons/knobs [#2058](https://github.com/storybooks/storybook/pull/2058)
-   Update vue versions [#2032](https://github.com/storybooks/storybook/pull/2032)
-   Update eslint from 4.8.0 to 4.9.0 in / [#2054](https://github.com/storybooks/storybook/pull/2054)
-   Update webpack-dev-server from 2.9.1 to 2.9.2 in examples/vue-kitchen-sink [#2055](https://github.com/storybooks/storybook/pull/2055)
-   Update postcss-loader from 2.0.7 to 2.0.8 in app/react [#2045](https://github.com/storybooks/storybook/pull/2045)
-   Update codecov from 2.3.0 to 2.3.1 in / [#2042](https://github.com/storybooks/storybook/pull/2042)
-   Update webpack from 3.6.0 to 3.7.1 in app/react-native [#2027](https://github.com/storybooks/storybook/pull/2027)
-   Update moment from 2.19.0 to 2.19.1 in addons/knobs [#2026](https://github.com/storybooks/storybook/pull/2026)
-   Update express from 4.16.1 to 4.16.2 in app/vue [#2018](https://github.com/storybooks/storybook/pull/2018)
-   Update postcss-loader from 2.0.6 to 2.0.7 in app/react [#2017](https://github.com/storybooks/storybook/pull/2017)
-   Update express from 4.16.1 to 4.16.2 in app/react [#2016](https://github.com/storybooks/storybook/pull/2016)
-   Update postcss-loader from 2.0.6 to 2.0.7 in app/react-native [#2015](https://github.com/storybooks/storybook/pull/2015)
-   Update express from 4.16.1 to 4.16.2 in app/react-native [#2014](https://github.com/storybooks/storybook/pull/2014)
-   Update moment from 2.18.1 to 2.19.0 in addons/knobs [#2013](https://github.com/storybooks/storybook/pull/2013)
-   Update autoprefixer from 7.1.4 to 7.1.5 in app/vue [#2003](https://github.com/storybooks/storybook/pull/2003)
-   Update update-notifier from 2.2.0 to 2.3.0 in lib/cli [#1999](https://github.com/storybooks/storybook/pull/1999)
-   Update autoprefixer from 7.1.4 to 7.1.5 in app/react [#2002](https://github.com/storybooks/storybook/pull/2002)
-   Update autoprefixer from 7.1.4 to 7.1.5 in app/react-native [#2000](https://github.com/storybooks/storybook/pull/2000)
-   Update @types/react from 16.0.9 to 16.0.10 in addons/knobs [#1998](https://github.com/storybooks/storybook/pull/1998)
-   Update jest-enzyme from 4.0.0 to 4.0.1 in / [#1997](https://github.com/storybooks/storybook/pull/1997)
-   Update storybook-router description in the addon gallery. [#1991](https://github.com/storybooks/storybook/pull/1991)
-   Update lerna from 2.3.1 to 2.4.0 in / [#1985](https://github.com/storybooks/storybook/pull/1985)
-   Update react-modal from 2.3.3 to 2.4.1 in app/vue [#1989](https://github.com/storybooks/storybook/pull/1989)
-   Update react-modal from 2.3.3 to 2.4.1 in app/react [#1988](https://github.com/storybooks/storybook/pull/1988)
-   Update react-modal from 2.3.3 to 2.4.1 in lib/ui [#1987](https://github.com/storybooks/storybook/pull/1987)
-   Update react-icons from 2.2.5 to 2.2.7 in lib/ui [#1986](https://github.com/storybooks/storybook/pull/1986)
-   Remove markdown autofixing on precommit hook [#1964](https://github.com/storybooks/storybook/pull/1964)
-   Update vue-hot-reload-api from 2.1.0 to 2.1.1 in app/vue [#1976](https://github.com/storybooks/storybook/pull/1976)
-   Update url-loader from 0.5.9 to 0.6.2 in app/vue [#1975](https://github.com/storybooks/storybook/pull/1975)
-   Update react-modal from 2.3.2 to 2.3.3 in app/vue [#1974](https://github.com/storybooks/storybook/pull/1974)
-   Update url-loader from 0.5.9 to 0.6.2 in app/react [#1973](https://github.com/storybooks/storybook/pull/1973)
-   Update react-modal from 2.3.2 to 2.3.3 in app/react [#1972](https://github.com/storybooks/storybook/pull/1972)
-   Update url-loader from 0.5.9 to 0.6.2 in app/react-native [#1970](https://github.com/storybooks/storybook/pull/1970)
-   Update react-modal from 2.3.2 to 2.3.3 in lib/ui [#1969](https://github.com/storybooks/storybook/pull/1969)
-   Update @types/react from 16.0.8 to 16.0.9 in addons/knobs [#1968](https://github.com/storybooks/storybook/pull/1968)
-   Update graphql from 0.11.6 to 0.11.7 in addons/graphql [#1967](https://github.com/storybooks/storybook/pull/1967)
-   Update @storybook/addon-links from 3.2.10 to 3.2.12 [#1949](https://github.com/storybooks/storybook/pull/1949)
-   Update style-loader from 0.18.2 to 0.19.0 in addons/knobs [#1958](https://github.com/storybooks/storybook/pull/1958)
-   Update @types/react from 16.0.7 to 16.0.8 in addons/knobs [#1957](https://github.com/storybooks/storybook/pull/1957)
-   Update prettier from 1.7.3 to 1.7.4 in / [#1955](https://github.com/storybooks/storybook/pull/1955)
-   Update react-motion from 0.5.1 to 0.5.2 [#1953](https://github.com/storybooks/storybook/pull/1953)
-   Update lerna from 2.2.0 to 2.3.1 in / [#1954](https://github.com/storybooks/storybook/pull/1954)
-   Update @storybook/addons from 3.2.10 to 3.2.12 [#1950](https://github.com/storybooks/storybook/pull/1950)
-   Update enzyme from 3.0.0 to 3.1.0 in / [#1948](https://github.com/storybooks/storybook/pull/1948)
-   Update enzyme-adapter-react-16 from 1.0.0 to 1.0.1 in / [#1951](https://github.com/storybooks/storybook/pull/1951)
-   Update @storybook/addon-actions from 3.2.11 to 3.2.12 [#1947](https://github.com/storybooks/storybook/pull/1947)

</details>

# 3.2.12

2017-October-02

#### Bug Fixes

-   addon-info: wrap prop values in braces [#1915](https://github.com/storybooks/storybook/pull/1915)
-   Add polyfills to fix addon-actions in IE11 [#1917](https://github.com/storybooks/storybook/pull/1917)
-   Gracefully handle fatal webpack errors. [#1918](https://github.com/storybooks/storybook/pull/1918)
-   Fix polyfills loading order [#1905](https://github.com/storybooks/storybook/pull/1905)

#### Documentation

-   Improve documentation for react-native : clarify where left pane is [#1901](https://github.com/storybooks/storybook/pull/1901)

#### Maintenance

-   Use yarn workspaces on master [#1916](https://github.com/storybooks/storybook/pull/1916)
-   Run `eslint --fix` on master [#1909](https://github.com/storybooks/storybook/pull/1909)
-   Remove open collective notice from storybook install [#1940](https://github.com/storybooks/storybook/pull/1940)
-   Run bootstrap before linting on CI [#1934](https://github.com/storybooks/storybook/pull/1934)

#### Dependency Upgrades

<details>
<summary>
14 PRs
</summary>

-   Update raf from 3.3.2 to 3.4.0 in / [#1939](https://github.com/storybooks/storybook/pull/1939)
-   Update graphql from 0.7.2 to 0.11.6 in addons/graphql [#1930](https://github.com/storybooks/storybook/pull/1930)
-   Update react-typography from 0.15.10 to 0.16.5 [#1927](https://github.com/storybooks/storybook/pull/1927)
-   Update react-render-html from 0.1.6 to 0.5.2 in addons/comments [#1933](https://github.com/storybooks/storybook/pull/1933)
-   Update react-datetime from 2.10.2 to 2.10.3 in addons/knobs [#1931](https://github.com/storybooks/storybook/pull/1931)
-   Update typography from 0.15.12 to 0.16.6 [#1929](https://github.com/storybooks/storybook/pull/1929)
-   Update graphiql from 0.7.8 to 0.11.5 in addons/graphql [#1928](https://github.com/storybooks/storybook/pull/1928)
-   Update prettier from 1.7.2 to 1.7.3 in / [#1926](https://github.com/storybooks/storybook/pull/1926)
-   Update react-stack-grid from 0.2.2 to 0.5.0 [#1925](https://github.com/storybooks/storybook/pull/1925)
-   Update react-motion from 0.1.0 to 0.5.1 [#1924](https://github.com/storybooks/storybook/pull/1924)
-   Update eslint from 4.7.2 to 4.8.0 in / [#1923](https://github.com/storybooks/storybook/pull/1923)
-   Update chroma-js from 0.7.2 to 0.7.8 [#1922](https://github.com/storybooks/storybook/pull/1922)
-   Use dependencies.io for dependencies management [#1920](https://github.com/storybooks/storybook/pull/1920)
-   UPGRADE react & friends && UPGRADE other dependencies [#1908](https://github.com/storybooks/storybook/pull/1908)

</details>

# 3.2.11

2017-September-27

#### Features

-   Add two new RN packager configuration options [#1865](https://github.com/storybooks/storybook/pull/1865)

#### Bug Fixes

-   Addon-info - Fix immutable props issues with React 16 [#1894](https://github.com/storybooks/storybook/pull/1894)
-   Update react-inspector to fix #1831 [#1888](https://github.com/storybooks/storybook/pull/1888)

#### Documentation

-   Updated release process documentation [#1882](https://github.com/storybooks/storybook/pull/1882)

# 3.2.10

2017-September-22

#### Features

-   Added codemod for deprecated addon-links and addon-actions from app [#1368](https://github.com/storybooks/storybook/pull/1368)
-   React native: Added option for custom packager port [#1837](https://github.com/storybooks/storybook/pull/1837)
-   CLI: add support for Vue projects using Nuxt [#1794](https://github.com/storybooks/storybook/pull/1794)

#### Bug Fixes

-   Avoid error "storyshots is intended only to be used with storybook" [#1441](https://github.com/storybooks/storybook/pull/1441)
-   Log correct url when using --https [#1871](https://github.com/storybooks/storybook/pull/1871)
-   Fix broken links in the deprecation warning for RN and Vue apps [#1827](https://github.com/storybooks/storybook/pull/1827)
-   Height aligned 2 buttons in manager's header [#1769](https://github.com/storybooks/storybook/pull/1769)
-   Add missing regenerator and runtime babel transform pkgs to package.json [#1848](https://github.com/storybooks/storybook/pull/1848)

#### Documentation

-   Update README: mention that addon-links needs to be registered manually [#1835](https://github.com/storybooks/storybook/pull/1835)
-   Improve linkTo documentation [#1793](https://github.com/storybooks/storybook/pull/1793)
-   Minor grammar fixes and clarification to Vue documentation [#1756](https://github.com/storybooks/storybook/pull/1756)
-   Add missing NPM script section to Vue guide [#1824](https://github.com/storybooks/storybook/pull/1824)
-   Add storybook-chrome-screenshot to addon gallery [#1761](https://github.com/storybooks/storybook/pull/1761)

#### Dependency Upgrades

-   Update babel-eslint to the latest version 🚀 [#1836](https://github.com/storybooks/storybook/pull/1836)
-   UPGRADE root dependencies and SYNC with packages [#1802](https://github.com/storybooks/storybook/pull/1802)
-   Update jest to the latest version 🚀 [#1799](https://github.com/storybooks/storybook/pull/1799)
-   Update eslint-plugin-jest to the latest version 🚀 [#1795](https://github.com/storybooks/storybook/pull/1795)
-   Update lerna to the latest version 🚀 [#1768](https://github.com/storybooks/storybook/pull/1768)

#### Maintenance

-   Smoke test master [#1801](https://github.com/storybooks/storybook/pull/1801)
-   Fixed Jest warnings [#1744](https://github.com/storybooks/storybook/pull/1744)

# 3.2.9

2017-August-26

#### Bug Fixes

-   Fix getstorybook CLI for React Native projects [#1741](https://github.com/storybooks/storybook/pull/1741)

#### Documentation

-   Improve `addon-info` README options documentation [#1732](https://github.com/storybooks/storybook/pull/1732)

#### Maintenance

-   ADD a CLI for bootstrapping [#1216](https://github.com/storybooks/storybook/pull/1216)

#### Dependency Upgrades

-   Update lerna to the latest version 🚀 [#1727](https://github.com/storybooks/storybook/pull/1727)

# 3.2.8

2017-August-23

#### Bug Fixes

-   Fix storyshots with new babel config [#1721](https://github.com/storybooks/storybook/pull/1721)
-   Fix CLI generators export [#1722](https://github.com/storybooks/storybook/pull/1722)

#### Documentation

-   Add caveat about knobs date defaultValue [#1719](https://github.com/storybooks/storybook/pull/1719)

# 3.2.7

2017-August-23

#### Bug Fixes

-   Fix storyshots by moving cacheDirectory to webpack config [#1713](https://github.com/storybooks/storybook/pull/1713)
-   Revert "Improved error checking in global addDecorator" [#1716](https://github.com/storybooks/storybook/pull/1716)
-   Stricter linting rules for imports [#1676](https://github.com/storybooks/storybook/pull/1676)
-   Addon Info: Remove broken prop type sort (keep defined order) [#1711](https://github.com/storybooks/storybook/pull/1711)

#### Maintenance

-   Enable eslint for vue-related stuff [#1715](https://github.com/storybooks/storybook/pull/1715)
-   CLI: ensure explicit dependency on `prop-types` for RN [#1714](https://github.com/storybooks/storybook/pull/1714)

# 3.2.6

2017-August-22

#### Features

-   Improve search and highlighting [#1693](https://github.com/storybooks/storybook/pull/1693)
-   Add centered decorator for vue [#1595](https://github.com/storybooks/storybook/pull/1595)
-   Add react-docgen propTypes to info addon [#1562](https://github.com/storybooks/storybook/pull/1562)

#### Bug Fixes

-   Fix stories panel resizing bug [#1689](https://github.com/storybooks/storybook/pull/1689)
-   Check for React presence when detecting `WEBPACK_REACT` type [#1646](https://github.com/storybooks/storybook/pull/1646)
-   Fix Create React App detection [#1645](https://github.com/storybooks/storybook/pull/1645)
-   Add dependencies on plugins used by getstorybook CLI [#1652](https://github.com/storybooks/storybook/pull/1652)
-   Fix preview window loading non js,css files [#1554](https://github.com/storybooks/storybook/pull/1554)

#### Documentation

-   Improve the warning given when using channel before it's defined [#1515](https://github.com/storybooks/storybook/pull/1515)
-   Remove imports from README that are not necessary with latest API [#1700](https://github.com/storybooks/storybook/pull/1700)
-   Add reminders to PR template [#1683](https://github.com/storybooks/storybook/pull/1683)
-   Docgen Flow Type Example [#1684](https://github.com/storybooks/storybook/pull/1684)

#### Maintenance

-   Make lint-staged work properly [#1675](https://github.com/storybooks/storybook/pull/1675)
-   Move baseFonts and RoutedLink to `@storybook/components` [#1659](https://github.com/storybooks/storybook/pull/1659)

#### Dependency Upgrades

-   Switch to babel preset env + async/await/generator support [#1668](https://github.com/storybooks/storybook/pull/1668)
-   Upgrade react-native-compat to avoid PropTypes warnings [#1673](https://github.com/storybooks/storybook/pull/1673)
-   Change React.PropTypes to prop-types [#1674](https://github.com/storybooks/storybook/pull/1674) [#1710](https://github.com/storybooks/storybook/pull/1710)

# 3.2.5

2017-August-16

#### Features

-   Add codemod for deprecated addon-info API [#1582](https://github.com/storybooks/storybook/pull/1582)

#### Bug Fixes

-   Fixed addon-knobs for RN [#1635](https://github.com/storybooks/storybook/pull/1635)
-   Make links navigate in the parent window [#1650](https://github.com/storybooks/storybook/pull/1650)
-   Don’t render leftpanel stories tree if stories are empty [#1664](https://github.com/storybooks/storybook/pull/1664)
-   Remove double styling for inline stories [#1651](https://github.com/storybooks/storybook/pull/1651)

#### Dependency Upgrades

-   Upgrade react-modal to v2.2.4 [#1666](https://github.com/storybooks/storybook/pull/1666)

# 3.2.4

2017-August-12

#### Features

-   Hierarchy expansion on search [#1598](https://github.com/storybooks/storybook/pull/1598)
-   Add sidebarAnimations config prop [#1601](https://github.com/storybooks/storybook/pull/1601)
-   Add hrefs to left menu links [#1523](https://github.com/storybooks/storybook/pull/1523)
-   Enable many components of same type in addon-info prop tables [#1607](https://github.com/storybooks/storybook/pull/1607)
-   Always collapse an expanded kind in tree view without changing selected story [#1590](https://github.com/storybooks/storybook/pull/1590)
-   Option to select an addon panel [#1641](https://github.com/storybooks/storybook/pull/1641)

#### Documentation

-   Document how to use info addon as decorator [#1592](https://github.com/storybooks/storybook/pull/1592)
-   Add Android simulator instructions for React Native [#1591](https://github.com/storybooks/storybook/pull/1591)

#### Maintenance

-   Tree view visual adjustments [#1599](https://github.com/storybooks/storybook/pull/1599)
-   Add z-index to shortcuts popup overlay [#1617](https://github.com/storybooks/storybook/pull/1617)
-   Use ReactModal for search box [#1548](https://github.com/storybooks/storybook/pull/1548)
-   Limit react versions to >=15 [#1613](https://github.com/storybooks/storybook/pull/1613)

# 3.2.3

2017-August-01

#### Features

-   Use the React Native packager's host by default [#1568](https://github.com/storybooks/storybook/pull/1568)
-   Make onDeviceUI default for RN getstorybook [#1571](https://github.com/storybooks/storybook/pull/1571)

#### Documentation

-   Add short description to addon-options readme [#1566](https://github.com/storybooks/storybook/pull/1566)

# 3.2.2

2017-July-31

#### Bug Fixes

-   Fixed build-storybook for vue [#1564](https://github.com/storybooks/storybook/pull/1564)

# 3.2.1

2017-July-31

#### Bug Fixes

-   Check if hierarchySeparator presents in the options object [#1561](https://github.com/storybooks/storybook/pull/1561)
-   React Native &lt;0.43 support [#1555](https://github.com/storybooks/storybook/pull/1555)

#### Documentation

-   Fix typo with Vue README referring to react [#1556](https://github.com/storybooks/storybook/pull/1556)
-   Add state-setting FAQ [#1559](https://github.com/storybooks/storybook/pull/1559)

# 3.2.0

2017-July-31

Storybook 3.2 is filled with new features to help make your components shine! Headline features:

-   Vue support [#1267](https://github.com/storybooks/storybook/pull/1267)
-   Story Hierarchy [#1329](https://github.com/storybooks/storybook/pull/1329)
-   React Native On Device UI [#1413](https://github.com/storybooks/storybook/pull/1413)

Plus many more features, documentation improvements, and bugfixes below!

#### Features

-   Vue support [#1267](https://github.com/storybooks/storybook/pull/1267)
-   Add support for vue in addon-notes [#1278](https://github.com/storybooks/storybook/pull/1278)
-   CLI support for Vue [#1287](https://github.com/storybooks/storybook/pull/1287)
-   Story Hierarchy [#1329](https://github.com/storybooks/storybook/pull/1329)
-   Story Hierarchy UI improvements [#1387](https://github.com/storybooks/storybook/pull/1387) [#1356](https://github.com/storybooks/storybook/pull/1356)
-   Story Hierarchy - keyboard accessibility [#1427](https://github.com/storybooks/storybook/pull/1427)
-   React Native - On Device UI [#1413](https://github.com/storybooks/storybook/pull/1413)
-   Show first story on RN OnDeviceUI startup [#1510](https://github.com/storybooks/storybook/pull/1510)
-   Added collapsible RN OnDeviceUI navigation [#1544](https://github.com/storybooks/storybook/pull/1544)
-   Add warning when module is missing in storiesOf [#1525](https://github.com/storybooks/storybook/pull/1525)
-   Provide styling hook for Addon Info story body [#1308](https://github.com/storybooks/storybook/pull/1308)
-   Implement filtering on story-level [#1432](https://github.com/storybooks/storybook/pull/1432)
-   Refactoring of `addon-info` [#1452](https://github.com/storybooks/storybook/pull/1452)
-   ADD storybook logo for inside terminal for future CLI or easteregg [#1499](https://github.com/storybooks/storybook/pull/1499)
-   Improved error checking in global addDecorator [#1481](https://github.com/storybooks/storybook/pull/1481)

#### Bug Fixes

-   Fix react native example and bootstrapping [#1514](https://github.com/storybooks/storybook/pull/1514)
-   Fix a 'funny' hmr issue in cra-kitchen-sink [#1508](https://github.com/storybooks/storybook/pull/1508)
-   When timestamps are enabled, it actually checks them before applying changes [#1405](https://github.com/storybooks/storybook/pull/1405)
-   Fix issue when extending webpack config [#1468](https://github.com/storybooks/storybook/pull/1468)
-   Fix addon notes [#1448](https://github.com/storybooks/storybook/pull/1448)
-   Story Hierarchy - initial state bug fix [#1401](https://github.com/storybooks/storybook/pull/1401)
-   Remove blue outline when node is focused [#1497](https://github.com/storybooks/storybook/pull/1497)

#### Documentation

-   Add hierarchySeparator to README [#1445](https://github.com/storybooks/storybook/pull/1445)
-   Document null addons channel in FAQ [#1507](https://github.com/storybooks/storybook/pull/1507)

#### Maintenance

-   Revert knobs API to previous API. [#1527](https://github.com/storybooks/storybook/pull/1527)
-   FIX hoist-internals: remove existing folder/link before linking [#1516](https://github.com/storybooks/storybook/pull/1516)
-   Update global hook for Vue Devtools [#1376](https://github.com/storybooks/storybook/pull/1376)
-   SWITCH to circleci over travisCI && CHANGE lerna bootstrap procedure: [#1486](https://github.com/storybooks/storybook/pull/1486)
-   Update cra-kitchen-sink package versions for 3.2-alpha [#1434](https://github.com/storybooks/storybook/pull/1434)
-   Updating 3.2 alpha release with patches [#1419](https://github.com/storybooks/storybook/pull/1419)
-   Remove typescript typings for @storybook/addon-notes [#1344](https://github.com/storybooks/storybook/pull/1344)
-   Remove typescript typings for @storybook/addon-options [#1343](https://github.com/storybooks/storybook/pull/1343)
-   Remove typescript typings for @storybook/addon-knobs [#1339](https://github.com/storybooks/storybook/pull/1339)
-   Remove typescript typings for @storybook/addon-links [#1342](https://github.com/storybooks/storybook/pull/1342)

#### Dependency Upgrades

-   Updated babel-plugin-react-docgen version [#1526](https://github.com/storybooks/storybook/pull/1526)
-   UPDATE everything (including eslint 4) [#1517](https://github.com/storybooks/storybook/pull/1517)
-   Update remark-preset-lint-recommended to the latest version 🚀 [#1512](https://github.com/storybooks/storybook/pull/1512)
-   Update remark-cli to the latest version 🚀 [#1498](https://github.com/storybooks/storybook/pull/1498)
-   Remove upper bound on react-native peerDependency [#1424](https://github.com/storybooks/storybook/pull/1424)
-   Bump `react-split-pane` version [#1495](https://github.com/storybooks/storybook/pull/1495)

# 3.1.9

2017-July-16

#### Features

-   React fiber support [#1443](https://github.com/storybooks/storybook/pull/1443)

#### Documentation

-   Refine docs about loading stories dynamically for react-native [#1420](https://github.com/storybooks/storybook/pull/1420)

#### Bug Fixes

-   Verify that name is a string in addons/actions [#1415](https://github.com/storybooks/storybook/pull/1415)
-   Knobs: fix label alignment [#1471](https://github.com/storybooks/storybook/pull/1471)
-   Fix display of large components [#1237](https://github.com/storybooks/storybook/pull/1237)

#### Dependency Upgrades

-   Dependency updates [#1439](https://github.com/storybooks/storybook/pull/1439)
-   chore(package): update husky to version 0.14.3 [#1437](https://github.com/storybooks/storybook/pull/1437)
-   Update danger to the latest version 🚀 [#1393](https://github.com/storybooks/storybook/pull/1393)
-   Update lerna to the latest version 🚀 [#1423](https://github.com/storybooks/storybook/pull/1423)
-   Pin gatsby version and upgrade gh-pages [#1462](https://github.com/storybooks/storybook/pull/1462)

# 3.1.8

2017-July-06

#### Documentation

-   Updated addon knob readme. [#1406](https://github.com/storybooks/storybook/pull/1406)
-   Add a FAQ entry for shared config with next [#1390](https://github.com/storybooks/storybook/pull/1390)
-   Documented webpack customization example for typescript [#1386](https://github.com/storybooks/storybook/pull/1386)

#### Maintenance

-   Removed empty array, since webpack 2 doesn't support them anymore. [#1381](https://github.com/storybooks/storybook/pull/1381)

#### Dependency Upgrades

-   Support webpack 3.0.0 [#1410](https://github.com/storybooks/storybook/pull/1410)
-   Update react inspector to fix #1385 [#1408](https://github.com/storybooks/storybook/pull/1408)

# 3.1.7

2017-June-28

#### Bug Fixes

-   Exit storybook build non-zero on stats errors (e.g. errors in the transpilation pipeline) [#1372](https://github.com/storybooks/storybook/pull/1372)
-   Fixed regression: CSS entries were not picked up for storybook pages (e.g. when using exract-text-webpack-plugin) [#1363](https://github.com/storybooks/storybook/pull/1363)

#### Documentation

-   Document Storybook release process [#1348](https://github.com/storybooks/storybook/pull/1348)

# 3.1.6

2017-June-26

#### Bug Fixes

-   Remove the `cacheDirectory` option from babel config [#1350](https://github.com/storybooks/storybook/pull/1350)
-   websockets (ws) removed `socket.upgradeReq`, so use `req` instead [#1337](https://github.com/storybooks/storybook/pull/1337)
-   Ensure we add the correct version of `react-dom` [#1349](https://github.com/storybooks/storybook/pull/1349)
-   Addon Info: Fix invalid prop `node.type` supplied to 'Props' [#1351](https://github.com/storybooks/storybook/pull/1351)
-   Addon Info: Omit empty inline info header [#1306](https://github.com/storybooks/storybook/pull/1306)
-   Addon Actions: Use uuid for action IDs instead of Math.random (fixes #1109) [#1347](https://github.com/storybooks/storybook/pull/1347)

#### Documentation

-   Fix welcome instructions to reflect current `getstorybook` [#1358](https://github.com/storybooks/storybook/pull/1358)
-   Addon Info: Update README with configuration instructions [#1326](https://github.com/storybooks/storybook/pull/1326)

#### Dependency Upgrades

-   Update lint-staged to the latest version 🚀 [#1315](https://github.com/storybooks/storybook/pull/1315)

# 3.1.5

2017-June-22

#### Features

-   Added flow support to getstorybook upgrade [#1289](https://github.com/storybooks/storybook/pull/1289)
-   Added support for the `haul` react-native packager [#1294](https://github.com/storybooks/storybook/pull/1294)

#### Bug Fixes

-   Fixed addon knobs proptypes deserialization [#1290](https://github.com/storybooks/storybook/pull/1290)

#### Documentation

-   Added search to docs [#1256](https://github.com/storybooks/storybook/pull/1256)
-   snapshot testing inverse regex example documentation [#1317](https://github.com/storybooks/storybook/pull/1317)

#### Maintenance

-   Refactored storybook component library [#1266](https://github.com/storybooks/storybook/pull/1266)
-   Created CRA kitchen sink addons example [#1288](https://github.com/storybooks/storybook/pull/1288)
-   Use a pack -> install technique to recreate local packages [#1332](https://github.com/storybooks/storybook/pull/1332)
-   Import demo components from @storybook/react [#1303](https://github.com/storybooks/storybook/pull/1303)

# 3.1.4

2017-June-15

#### Features

-   IMPROVE design of addon-events [#1249](https://github.com/storybooks/storybook/pull/1249)
-   Add a `shallowSnapshot` option for storyshots `test` functions [#1232](https://github.com/storybooks/storybook/pull/1232)

#### Bug Fixes

-   Fix app entry bug in RN gestorybook [#1280](https://github.com/storybooks/storybook/pull/1280)
-   fix(addons/info): Cannot read property 'props' of undefined [#1258](https://github.com/storybooks/storybook/pull/1258)

#### Documentation

-   Add versions plugin to docs [#1269](https://github.com/storybooks/storybook/pull/1269)

# 3.1.3

2017-June-10

#### Bug Fixes

-   Fix `storybook-build` manager-head.html bug [#1248](https://github.com/storybooks/storybook/pull/1248)

# 3.1.2

Minor features including a new "events" addon, as well as the usual bugfixes, cleanup, etc.

2017-June-09

#### Features

-   Add small design update to addon info package [#1213](https://github.com/storybooks/storybook/pull/1213)
-   Add display configuration options to info addon [#1157](https://github.com/storybooks/storybook/pull/1157)
-   Add support for multiple webpack chunks in iframe [#1083](https://github.com/storybooks/storybook/pull/1083)
-   Add events addon [#1130](https://github.com/storybooks/storybook/pull/1130)
-   Allow including files just before manager.bundle.js [#1134](https://github.com/storybooks/storybook/pull/1134)

#### Bug Fixes

-   Fixed knobs addon editing bug [#1233](https://github.com/storybooks/storybook/pull/1233)
-   Fix bug in addons/graphql in reIndentQuery [#1207](https://github.com/storybooks/storybook/pull/1207)
-   Marksy initialized with mtrcConf intead of marksyConf [#1205](https://github.com/storybooks/storybook/pull/1205)

#### Documentation

-   Document stories not showing up on storybook UI until device connects [#1221](https://github.com/storybooks/storybook/pull/1221)
-   Fixed references to storybook.js.org. [#1211](https://github.com/storybooks/storybook/pull/1211)
-   Updated repository URL to address broken npm images [#1197](https://github.com/storybooks/storybook/pull/1197)

#### Maintenance

-   Added a vanilla React Native example app. [#1202](https://github.com/storybooks/storybook/pull/1202)
-   Move typings for @storybook/react to @types package [#1199](https://github.com/storybooks/storybook/pull/1199)
-   Set ESlint rules more strict 🚑 [#911](https://github.com/storybooks/storybook/pull/911)

#### Dependency Upgrades

-   Update babel docgen plugin to generate docs for React.createClass and createReactClass [#1206](https://github.com/storybooks/storybook/pull/1206)
-   Update `marksy` dependecy due broken 1.1.0 version [#1204](https://github.com/storybooks/storybook/pull/1204)

# 3.0.1

Minor bug fixes and documentation updates post 3.0.0 release.

2017-June-06

#### Bug Fixes

-   Added error message for `addon-options` [#1194](https://github.com/storybooks/storybook/pull/1194)
-   Fix(react-native) add missing `ws` dependency [#1174](https://github.com/storybooks/storybook/pull/1174)
-   Fix terminal colors by reset console colors explicitly [#1184](https://github.com/storybooks/storybook/pull/1184)
-   Fix addon panel layout styling [#1170](https://github.com/storybooks/storybook/pull/1170)
-   ADD https import & remove tracking code remains [#1176](https://github.com/storybooks/storybook/pull/1176)
-   Fix incorrect babel config file reading [#1156](https://github.com/storybooks/storybook/pull/1156)
-   Fixed withKnobs definition. [#1164](https://github.com/storybooks/storybook/pull/1164)

#### Documentation

-   Fixed typo in react-native browser instructions [#1189](https://github.com/storybooks/storybook/pull/1189)
-   Add instruction for npm install with -D for development dependency [#1168](https://github.com/storybooks/storybook/pull/1168)
-   Fix broken link for [addons] in README [#1167](https://github.com/storybooks/storybook/pull/1167)
-   Refreshed logo in docs [#1149](https://github.com/storybooks/storybook/pull/1149)
-   fix addon broken links in documentation [#1165](https://github.com/storybooks/storybook/pull/1165)
-   start-storybook cli - expand commands descriptions [#1161](https://github.com/storybooks/storybook/pull/1161)
-   Fix typo in codemod readme [#1158](https://github.com/storybooks/storybook/pull/1158)

#### Dependency Upgrades

-   Replaced deprecated `markdown-to-react-components` with `marksy` [#1188](https://github.com/storybooks/storybook/pull/1188)

# 3.0.0

Storybook 3.0 is our first fully community-driven release! Notable changes:

-   Moved from `@kadira` to `@storybooks` org across [github](https://github.com/storybooks/storybook/), [npm](https://www.npmjs.com/package/@storybook/react), [docs](https://storybook.js.org/)
-   Upgraded to Webpack2! [#637](https://github.com/storybooks/storybook/pull/637)
-   Switched to monorepo and overhauled package structure. [#749](https://github.com/storybooks/storybook/pull/749) [#1031](https://github.com/storybooks/storybook/pull/1031)
-   Added configuration options to storybooks snapshot testing. [#1090](https://github.com/storybooks/storybook/pull/1090)
-   Added `create-react-native-app` support. [#1117](https://github.com/storybooks/storybook/pull/1117)
-   Added HTTPS support. [#735](https://github.com/storybooks/storybook/pull/735)

2017-May-31

#### Features

-   Added help text to the react-native preview panel [#1142](https://github.com/storybooks/storybook/pull/1142)
-   Added create-react-native-app support [#1117](https://github.com/storybooks/storybook/pull/1117)
-   Fixed knobs-addon performance issues [#1039](https://github.com/storybooks/storybook/pull/1039)
-   Added `snapshotWithOptions` to configure storyshots rendering options [#1090](https://github.com/storybooks/storybook/pull/1090)
-   Added custom `test` function for storyshots [#1035](https://github.com/storybooks/storybook/pull/1035)
-   Added typescript definition to addon notes [#989](https://github.com/storybooks/storybook/pull/989)
-   Added HTTPS option for dev server [#735](https://github.com/storybooks/storybook/pull/735)

#### Bug Fixes

-   Use strict equality in action logger [#1144](https://github.com/storybooks/storybook/pull/1144)
-   FIX addon info and addon storyshots incompatibility [#1129](https://github.com/storybooks/storybook/pull/1129)
-   FIX postcss options missing in default webpack config && UPDATE dependencies [#1087](https://github.com/storybooks/storybook/pull/1087)
-   Fix CLI had a package version from storybook hardcoded - now queries npm registry [#1079](https://github.com/storybooks/storybook/pull/1079)
-   Fix semi broken \_\_docgenInfo integration in addon info [#1030](https://github.com/storybooks/storybook/pull/1030)
-   Fix: build-storybook no longer supports relative paths [#1058](https://github.com/storybooks/storybook/pull/1058)
-   Fix for types `number` for addon knobs [#1001](https://github.com/storybooks/storybook/pull/1001)
-   Fix webpack overriding && Add an example with local file dependencies [#965](https://github.com/storybooks/storybook/pull/965)

#### Documentation

-   Add storybook-addon-intl to addon gallery [#1143](https://github.com/storybooks/storybook/pull/1143)
-   3.0.0 release notes && release notes automation [#1047](https://github.com/storybooks/storybook/pull/1047)
-   3.0.0 migration assistance : codemod, update installation and usage instructions [#1093](https://github.com/storybooks/storybook/pull/1093)
-   Add ReactSVGPanZoom to examples list [#1139](https://github.com/storybooks/storybook/pull/1139)
-   Show webpack 2 config example in docs: rules not loaders [#1137](https://github.com/storybooks/storybook/pull/1137)
-   Merge docs repo into this repo: add /docs [#1131](https://github.com/storybooks/storybook/pull/1131)
-   Change brand name from “React Storybook” to “Storybook” [#1044](https://github.com/storybooks/storybook/pull/1044)
-   Updated issue triage guidelines [#1024](https://github.com/storybooks/storybook/pull/1024)

#### Maintenance

-   Add typings for links add-on [#1154](https://github.com/storybooks/storybook/pull/1154)
-   Add react-dom to the devDependency list for React Native projects [#1102](https://github.com/storybooks/storybook/pull/1102)
-   Upgrade React Native to webpack 2 config [#1097](https://github.com/storybooks/storybook/pull/1097)
-   Add unit tests for addon storyshots [#971](https://github.com/storybooks/storybook/pull/971)
-   Deprecate builtin addons (links and actions) - no longer included by default [#1038](https://github.com/storybooks/storybook/pull/1038)
-   change NPM organisation from kadira to storybook in code [#996](https://github.com/storybooks/storybook/pull/996)
-   CHANGE folder structure && CHANGE package-names [#1031](https://github.com/storybooks/storybook/pull/1031)
-   Add deprecation warnings when addons are required via main package [#1025](https://github.com/storybooks/storybook/pull/1025)
-   Remove text transform uppercase for knob labels [#991](https://github.com/storybooks/storybook/pull/991)

#### Dependency Upgrades

<details>
<summary>
11 PRs
</summary>

-   Update lerna to the latest version 🚀 [#1101](https://github.com/storybooks/storybook/pull/1101)
-   CHANGE to prop-types package for notes & test-cra [#1082](https://github.com/storybooks/storybook/pull/1082)
-   update dependencies in cra-storybook [#1080](https://github.com/storybooks/storybook/pull/1080)
-   Switch back to non-fork of react-inspector [#1026](https://github.com/storybooks/storybook/pull/1026)
-   Dependency updates: webpack, babel, react [#1008](https://github.com/storybooks/storybook/pull/1008)
-   Update jest to the latest version 🚀 [#998](https://github.com/storybooks/storybook/pull/998)
-   Update lerna to the latest version 🚀 [#969](https://github.com/storybooks/storybook/pull/969)
-   CHANGE to use react-split-view 0.1.63 over the fork [#956](https://github.com/storybooks/storybook/pull/956)
-   Update lerna to the latest version 🚀 [#915](https://github.com/storybooks/storybook/pull/915)
-   Use jest for unittesting - standardize unit testing epic [#904](https://github.com/storybooks/storybook/pull/904)
-   Update dependencies to enable Greenkeeper 🌴 [#768](https://github.com/storybooks/storybook/pull/768)

</details>

#### Other

<details>
<summary>
33 PRs
</summary>

-   Added an upgrade mode to getstorybook [#1146](https://github.com/storybooks/storybook/pull/1146)
-   Update link to Storyshots addon [#1074](https://github.com/storybooks/storybook/pull/1074)
-   Added error message for missing or invalid storyName [#747](https://github.com/storybooks/storybook/pull/747)
-   Opened an Open Collective Account <https://opencollective.com/storybook> [#1065](https://github.com/storybooks/storybook/pull/1065)
-   Add propTablesExclude option [#924](https://github.com/storybooks/storybook/pull/924)
-   addon-info: make the info overlay be fixed  [#914](https://github.com/storybooks/storybook/pull/914)
-   Handle null elements in getData [#926](https://github.com/storybooks/storybook/pull/926)
-   add description field from \_\_docgenInfo for prop table for info plugin [#929](https://github.com/storybooks/storybook/pull/929)
-   \#959 add a max-height and center element with alignItems: center [#961](https://github.com/storybooks/storybook/pull/961)
-   Switch to the only prepublish script [#903](https://github.com/storybooks/storybook/pull/903)
-   PR review policy [#923](https://github.com/storybooks/storybook/pull/923)
-   Add typescript definitions for getStorybook() [#753](https://github.com/storybooks/storybook/pull/753)
-   Restore deep link for addon docs [#919](https://github.com/storybooks/storybook/pull/919)
-   Fix default storybook webpack config [#922](https://github.com/storybooks/storybook/pull/922)
-   Render the first story for a kind if no story selected. [#918](https://github.com/storybooks/storybook/pull/918)
-   Update docs for monorepo [#913](https://github.com/storybooks/storybook/pull/913)
-   Monorepo readme and contributing [#907](https://github.com/storybooks/storybook/pull/907)
-   Add story kind regex [#906](https://github.com/storybooks/storybook/pull/906)
-   Add examples [#897](https://github.com/storybooks/storybook/pull/897)
-   Add missing repos [#882](https://github.com/storybooks/storybook/pull/882)
-   Switch to monorepo [#749](https://github.com/storybooks/storybook/pull/749)
-   extend devMiddlewareOptions with config.devServer [#723](https://github.com/storybooks/storybook/pull/723)
-   Added meta IE=edge [#715](https://github.com/storybooks/storybook/pull/715)
-   Replace String.includes with String.indexOf: cross-browsing support [#712](https://github.com/storybooks/storybook/pull/712)
-   Issue Triage instructions [#748](https://github.com/storybooks/storybook/pull/748)
-   Simple pull request template [#741](https://github.com/storybooks/storybook/pull/741)
-   Make return type of StoryDecorator nullable [#680](https://github.com/storybooks/storybook/pull/680)
-   Warn if story with a given name already exists [#670](https://github.com/storybooks/storybook/pull/670)
-   Fix spelling mistake - "element form the story" to  "element from the story" [#702](https://github.com/storybooks/storybook/pull/702)
-   Remove broken react-button example [#699](https://github.com/storybooks/storybook/pull/699)
-   Fixed spelling error. [#720](https://github.com/storybooks/storybook/pull/720)
-   Cleaner error handling for storiesOf [#672](https://github.com/storybooks/storybook/pull/672)
-   Update links to point to new organization [#721](https://github.com/storybooks/storybook/pull/721)

</details>

# v2.35.3

Allow customConfig to override devtool. [PR668](https://github.com/storybooks/react-storybook/pull/668)

# v2.35.2

03-January-2017

Fixes issue [#601](https://github.com/storybooks/react-storybook/issues/601) where it throws error when introduce a propType with a hypen. Add a [fix](https://github.com/kadirahq/babel-plugin-react-docgen/pull/23) to [`babel-plugin-react-docgen`](https://github.com/kadirahq/babel-plugin-react-docgen) to fix this issue.

This release comes with the updated `babel-plugin-react-docgen`.

# v2.35.1

-   Revert [PR653](https://github.com/storybooks/react-storybook/pull/653) where it's causing HMR to not working properly.

# v2.35.0

18-December-2016

-   Using file-loader to load all the extensions [PR653](https://github.com/storybooks/react-storybook/pull/653)
-   Update css-loader dependency [PR648](https://github.com/storybooks/react-storybook/pull/648)
-   Check if stories are loaded from Jest [PR644](https://github.com/storybooks/react-storybook/pull/644)

# v2.34.0

05-December-2016

Open the express router for developers (middleware.js file). [PR435](https://github.com/storybooks/react-storybook/pull/435)

# v2.33.1

01-December-2016

Update Typescript definition file for global addDecorator. [PR634](https://github.com/storybooks/react-storybook/pull/634)

# v2.33.0

28-November-2016

Completely avoid re-rendering the preview iframe. [PR631](https://github.com/storybooks/react-storybook/pull/631)

# v2.32.2

28-November-2016

Update postmsg channel module version [PR627](https://github.com/storybooks/react-storybook/pull/627)

# v2.32.1

22-November-2016

Add support for react_perf comes with React 15.4.0. [PR623](https://github.com/storybooks/react-storybook/pull/623)

# v2.32.0

Incorrect publish (error when running `npm publish`)

# v2.31.0

20-November-2016

Add the react-storybook version to the build output. [PR621](https://github.com/storybooks/react-storybook/pull/621)

# v2.30.1

17-November-2016

Update the postmsg channel module to fix issue [#555](https://github.com/storybooks/react-storybook/issues/555) with [PR611](https://github.com/storybooks/react-storybook/pull/611)

# v2.30.0

16-November-2016

Update to the new Storybook UI which doesn't use Redux.

# v2.29.7

11-November-2016

Update @kadira/storybook-ui to the latest.

# v2.29.6

10-November-2016

Fix a typo in the story syntax error messages. [PR610](https://github.com/storybooks/react-storybook/pull/610)

# v2.29.5

09-November-2016

Check if regex and regex.test is available before calling it. [PR608](https://github.com/storybooks/react-storybook/pull/608)

# v2.29.3

08-November-2016

Update webpack-hot-middleware to version 2.13.2 to fix the issue [#543](https://github.com/storybooks/react-storybook/issues/543).

# v2.29.3

03-November-2016

Fix a regression caused by v2.29.2.
There was a text called undefined listed always on the top of the preview.

# v2.29.2

03-November-2016

Add various fixes.

-   Use webpack chunkhash to enable long-term caching. [PR597](https://github.com/storybooks/react-storybook/pull/597)
-   Fixed json loader testing for when test is multiple. [PR598](https://github.com/storybooks/react-storybook/pull/598)
-   Fix usage of custom favicon [PR592](https://github.com/storybooks/react-storybook/pull/592)
-   Update postcss-loader to v1.1.0 [PR599](https://github.com/storybooks/react-storybook/pull/599)
-   fix for `module.hot` is not available in a static build [PR600](https://github.com/storybooks/react-storybook/pull/600)

# v2.29.1

03-November-2016

Update babel-plugin-react-docgen to v1.4.1 to fix HOC [issue](https://github.com/kadirahq/babel-plugin-react-docgen/issues/19)

# v2.29.0

01-November-2016

Update babel-plugin-react-docgen to 1.4.0.
This will fix some of the compilation issues such as #580.

# v2.28.1

28-October-2016

Remove preview decorator support. [PR583](https://github.com/storybooks/react-storybook/pull/583).

# v2.28.0

28-October-2016

Add preview decorator support. [PR582](https://github.com/storybooks/react-storybook/pull/582).
This will help us bring storybook designer with some great power.

# v2.27.0

27-October-2016

Add a few usability improvements to Storybook.

-   Display storybook version. [PR559](https://github.com/storybooks/react-storybook/pull/559)
-   Make the storybooks cacheable. [PR578](https://github.com/storybooks/react-storybook/pull/578)
-   Change the devtool to eval and remove the use of source maps. [PR577](https://github.com/storybooks/react-storybook/pull/577)
-   Update `babel-preset-react-app` to the latest. [PR576](https://github.com/storybooks/react-storybook/pull/576)
-   Ship `json-loader` by default. [PR575](https://github.com/storybooks/react-storybook/pull/575)

# v2.26.0

24-October-2016

Get some new features from CRA.

-   Add jsx as a resolve extension [PR563](https://github.com/storybooks/react-storybook/pull/563)
-   Allow to use postcss for CSS @imports [PR564](https://github.com/storybooks/react-storybook/pull/564)
-   Use process.env as a proper object [PR565](https://github.com/storybooks/react-storybook/pull/565)

# v2.25.1

23-October-2016

Add a potential fix to [558](https://github.com/storybooks/react-storybook/issues/558) by updating babel-plugin-react-docgen to the latest(v1.3.2).

# v2.25.0

21-October-2016

Add react docgen info into React classes with the react-docgen babel plugin. [PR557](https://github.com/storybooks/react-storybook/pull/557).
With this:

-   We could get docgen info with any React component class using `ClassName.__docgenInfo`.
-   From the global collection: `STORYBOOK_REACT_CLASSES`

Additionally, added `yarn.lock`.

# v2.24.1

19-October-2016

Do not show git command output. [PR554](https://github.com/storybooks/react-storybook/pull/554)

# v2.24.0

07-October-2016

-   Export git repository info to support custom tool integrations [PR536](https://github.com/storybooks/react-storybook/pull/536)

# v2.23.0

06-October-2016

-   Remove the experimental database addon from react-storybook [PR535](https://github.com/storybooks/react-storybook/pull/535)

# v2.22.0

05-October-2016

Add some nice development experiment based on suggestion from Dan Abramov.

-   Set a color to the Storybook URL in the console. [PR533](https://github.com/storybooks/react-storybook/pull/533)
-   Add better error message when there's no React element in the story. [PR534](https://github.com/storybooks/react-storybook/pull/534)

# v2.21.0

05-October-2016

-   Get the latest features from CRA including NODE_PATH support, public folder support and some other minor changes. [#468](https://github.com/storybooks/react-storybook/issues/468)
-   Also bumped `@kadira/storybook-channel-postmsg` to `^1.0.3`

# v2.20.1

28-September-2016

-   Fix story kind order bug [PR499](https://github.com/storybooks/react-storybook/pull/499)
-   Prefix config environment variables [PR503](https://github.com/storybooks/react-storybook/pull/503)

# v2.20.0

26-September-2016

-   Use postMessage channel [PR498](https://github.com/storybooks/react-storybook/pull/498)
-   Support dynamic panel titles [PR497](https://github.com/storybooks/react-storybook/pull/497)

# v2.19.0

26-September-2016

-   Support layout options [PR494](https://github.com/storybooks/react-storybook/pull/494)
-   Update Typescript definitions [PR491](https://github.com/storybooks/react-storybook/pull/491) and [PR493](https://github.com/storybooks/react-storybook/pull/493)

# v2.18.1

23-September-2016

-   Stop uglifyjs from mangling names [PR483](https://github.com/storybooks/react-storybook/pull/483)

# v2.18.0

23-September-2016

-   Remove `STORYBOOK_` prefix from config env [PR481](https://github.com/storybooks/react-storybook/pull/481)

# v2.17.0

22-September-2016

-   Add support for StoryShots. [PR479](https://github.com/storybooks/react-storybook/pull/479)
-   Fix some typos: [PR477](https://github.com/storybooks/react-storybook/pull/477) & [PR478](https://github.com/storybooks/react-storybook/pull/478)

# v2.16.1

21-September-2016

-   Fix the 404 error for `addon-db.json` file [PR472](https://github.com/storybooks/react-storybook/pull/472)
-   Serve/Bundle the storybook favicon [PR473](https://github.com/storybooks/react-storybook/pull/473)

# v2.16.0

21-September-2016

-   Move the babel config loading logic into a seperate file. [PR469](https://github.com/storybooks/react-storybook/pull/469)
-   Update airbnd eslint rules to the latest.

# v2.15.1

19-September-2016

Add a fix to webpack custom resolve.alias not working. [PR465](https://github.com/storybooks/react-storybook/pull/465)

# v2.15.0

19-September-2016

-   Use @kadira/storybook-addons as a resolve.alias. So, we can support addons for NPM2 too. [PR462](https://github.com/storybooks/react-storybook/pull/462)

# v2.14.0

14-September-2016

-   Watch missing NPM modules and force webpack rebuild. [PR446](https://github.com/storybooks/react-storybook/pull/446)
-   Fix issue on error message hanging after even it solved. [PR447](https://github.com/storybooks/react-storybook/pull/447)
-   Allow to reload if HMR goes crazy. [PR448](https://github.com/storybooks/react-storybook/pull/448)
-   Add support to get custom env variables. [PR450](https://github.com/storybooks/react-storybook/pull/450)

# v2.13.1

14-September-2016

-   Fix 404 error when db file does not exist [PR449](https://github.com/storybooks/react-storybook/pull/449)

# v2.13.0

9-September-2016

-   Fix [#443](https://github.com/storybooks/react-storybook/issues/443) where the static version of Storybook doesn't like Safari.
-   Update postcss-loader to 0.13.0.

# v2.12.1

8-September-2016

-   Parse static directory provided by env as a list. [PR436](https://github.com/storybooks/react-storybook/pull/436)

# v2.12.0

8-September-2016

-   Do not include addon register file on preview. [PR426](https://github.com/storybooks/react-storybook/pull/426)
-   Update css-loader to version 0.25.0. [PR427](https://github.com/storybooks/react-storybook/pull/427)
-   Get the head.html values for every page request. [PR432](https://github.com/storybooks/react-storybook/pull/432)

# v2.11.0

4-September-2016

-   Remove babel-polyfill since we don't use it.
-   Update versions with the help from greenkeeper. [PR421](https://github.com/storybooks/react-storybook/pull/421)

# v2.10.0

3-September-2016

-   Adding airbnb-js-shims again. [PR419](https://github.com/storybooks/react-storybook/pull/419)

# v2.9.1

2-September-2016.

-   Use the config directory to store the addon database file [PR418](https://github.com/storybooks/react-storybook/pull/418).

# v2.9.0

2-September-2016.

-   Copy the addon-db.json file when building static storybooks [PR417](https://github.com/storybooks/react-storybook/pull/417).

# v2.8.0

2-September-2016.

-   Update @kadira/storybook to get the clean query params feature. See [storybook-ui-PR37](https://github.com/kadirahq/storybook-ui/pull/37)

# v2.7.0

1-September-2016

-   Add addon database feature [PR415](https://github.com/storybooks/react-storybook/pull/415).

# v2.6.1

31-August-2016

-   Bring back HMR dev logs. [PR412](https://github.com/storybooks/react-storybook/pull/412).

# v2.6.0

30-August-2016

-   Allow start/build params from env variables. [PR413](https://github.com/storybooks/react-storybook/pull/413)

# v2.5.2

29-August-2016

-   Remove the use of babel-runtime/core-js modules. [PR410](https://github.com/storybooks/react-storybook/pull/410)

# v2.5.1

24-August-2016

-   Update @kadira/storybook-ui to v3.3.2

# v2.5.0

24-August-2016

-   We are no longer shipping extra polyfills anymore. [PR402](https://github.com/storybooks/react-storybook/pull/402)

# v2.4.2

24-August-2016

-   Allow file-loader URLs to work on subpaths. [PR401](https://github.com/storybooks/react-storybook/pull/401)

# v2.4.1

24-August-2016

-   Bump @kadira/storybook ui to v3.3.1 to fix some UI related issues.

# v2.4.0

23-August-2016

-   Simplify the option to stop tracking. [PR399](https://github.com/storybooks/react-storybook/pull/399)
-   Use JSON5 instead of CJSON to parse .babelrc. [PR398](https://github.com/storybooks/react-storybook/pull/398)
-   Add webpack2 support by changing the use of OccurenceOrderPlugin. [PR397](https://github.com/storybooks/react-storybook/pull/397)
-   Use @kadira/storybook-ui 2.3.0, which has new APIs to set URL for addons.

# v2.3.0

16-August-2016

-   Implement anonymous usage tracking. [PR384](https://github.com/storybooks/react-storybook/pull/384)

# v2.2.3

15-August-2016

-   Add a hash to media file's filename. Otherwise, it'll cause issues when there are multiple images with the same filename but in different directories. [PR380](https://github.com/storybooks/react-storybook/pull/380)

# v2.2.2

10-August-2016

-   Remove unused extract-text-webpack-plugin. This will add webpack2 support. [PR369](https://github.com/storybooks/react-storybook/pull/369).

# v2.2.1

09-August-2016

-   Use @kadira/storybook-channel modules. [#PR359](https://github.com/storybooks/react-storybook/pull/359).
-   Update @kadira/storybook-ui to the latest.

# v2.2.0

05-August-2016

This release bring some webpack config related optimizations and the NPM2 support. Here are the notable changes:

-   Use es6-shim directly into webpack config. [PR355](https://github.com/storybooks/react-storybook/pull/355)
-   Use the default babel-config based on CRA's config. [PR354](https://github.com/storybooks/react-storybook/pull/354)
-   Add NPM2 support. [PR356](https://github.com/storybooks/react-storybook/pull/356)
-   Add autofixer defaults. [PR357](https://github.com/storybooks/react-storybook/pull/357)

# v2.1.1

03-August-2016

Remove default webpack config for all config types. [PR348](https://github.com/storybooks/react-storybook/pull/348)

Now we only use the Create React App based config if there's no custom webpack config.
This will fix issues like [#347](https://github.com/storybooks/react-storybook/issues/347).

# v2.1.0

02-August-2016

Add support for the addon API. See [PR346](https://github.com/storybooks/react-storybook/pull/346).

Here after we are using most of the features including actions,links as plugins.
So, this introduced a huge area to add customizations to Storybook.

Unfortunately, as of this version, there are no docs for this feature. But, you can have a look at these addons:

-   actions addon (powers the action logger): [addon-actions](https://github.com/kadirahq/storybook-addon-actions)
-   links addon (powers the linkTo feature): [addon-links](https://github.com/kadirahq/storybook-addon-links)

Have a look at [here](https://github.com/storybooks/react-storybook/blob/master/src/server/config.js#L88) to how to configure addons.

# v2.0.0

01-August-2016

This is the starting of the next major version of Storybook. This version is almost compatible with `v1.x.x` but defaults have been changes as discussed below. That's why we are starting out a new version.

-   Update defaults to match create-react-app. [PR342](https://github.com/storybooks/react-storybook/pull/342). Here are the notable changes:
    -   Add postcss based CSS loader.
    -   Add file-loader for images and common types.
    -   Add url-loader for shorter media files.
    -   Do not pre-build manager(storybook UI) bundle.
    -   Continue support for babel's stage-0 preset and add es2016 preset.
-   Update @kadira/storybook-ui to v2.6.1 to remove some React warnings.

# v1.41.0

-   Fix nodejs require errors [#337](https://github.com/storybooks/react-storybook/pull/337).
-   Add getStorybook method to client API [#332](https://github.com/storybooks/react-storybook/pull/332).

# v1.40.0

-   Fix duplicate decorator bug [#335](https://github.com/storybooks/react-storybook/pull/335).

# v1.39.1

-   Update babel packages [#325](https://github.com/storybooks/react-storybook/pull/325).
-   Hide HMR info logs [#331](https://github.com/storybooks/react-storybook/pull/331).

# v1.39.0

-   Update @kadira/storybook-ui to get features from [v2.5.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v250) and [v2.6.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v260).

# v1.38.3

-   Add names for action and linkTo functions [#321](https://github.com/storybooks/react-storybook/pull/321).

# v1.38.2

-   Fix error in prepublish script [#319](https://github.com/storybooks/react-storybook/pull/319).

# v1.38.1

-   Improve Windows support by writing prepublish script using shelljs [#308](https://github.com/storybooks/react-storybook/pull/308).

# v1.38.0

-   v1.37.0 was a nightmare since it contains the npm-shrinkwrap.json. Fixed by removing it. See: [#306](https://github.com/storybooks/react-storybook/issues/306) and [#305](https://github.com/storybooks/react-storybook/pull/305).

# v1.37.0

-   Update @kadira/storybook-ui to 2.4.0

# v1.36.0

-   Support watchOptions configuration. See: [PR287](https://github.com/storybooks/react-storybook/pull/287)

# v1.35.2

-   Add missing font-face to the ErrorDisplay's heading.

# v1.35.1

-   Fix issue related to bad error handling. See issue [#275](https://github.com/storybooks/react-storybook/issues/275):

# v1.35.0

-   Add fuzzy search powered search box and Redux DevTools support via [@kadira/storybook-ui@2.3.0](https://github.com/kadirahq/storybook-ui/blob/master/CHANGELOG.md#v230).

# v1.34.1

-   Don't always override NODE_ENV in build-storybook. [PR272](https://github.com/storybooks/react-storybook/pull/272)

# v1.34.0

-   Use storybook-ui v2.2.0 which puts shortcut state into the URL.

# v1.33.0

-   Introduce an [extension API](https://github.com/storybooks/react-storybook/blob/master/docs/extensions.md) for Storybook. See: [PR258](https://github.com/storybooks/react-storybook/pull/258)

# v1.32.1

-   Extend @kadira/storybook-ui provider from it's base Provider.

# v1.32.0

-   Use @kadira/storybook-ui as the manager UI with the implemented provider for React. See `client/manager` for more info.

# v1.31.0

-   Pass a `context` argument to stories [PR250](https://github.com/storybooks/react-storybook/pull/250)

# v1.30.0

-   Fuzzy search kinds [PR247](https://github.com/storybooks/react-storybook/pull/247)

# v1.29.5

-   Update dependency version to fix filter crash [PR246](https://github.com/storybooks/react-storybook/pull/246)

# v1.29.4

-   Protect index.html/iframe.html from being overwritten [PR243](https://github.com/storybooks/react-storybook/pull/243)

# v1.29.3

-   Update @kadira/storybook-core version [PR241](https://github.com/storybooks/react-storybook/pull/241)
-   Add es6-shim by default [PR238](https://github.com/storybooks/react-storybook/pull/238)

# v1.29.2

-   Use url.resolve instead of path.join [PR240](https://github.com/storybooks/react-storybook/pull/240)

# v1.29.1

-   Copy missed manager.js.map file on static build [PR236](https://github.com/storybooks/react-storybook/pull/236)

# v1.29.0

-   Multiple static dirs (comma separated) [PR229](https://github.com/storybooks/react-storybook/pull/229)

# v1.28.5

-   Support ECMAScript stage-0 [PR228](https://github.com/storybooks/react-storybook/pull/228) to fix [Issue #227](https://github.com/storybooks/react-storybook/issues/227)

# v1.28.4

-   Support custom webpack public path for dev-server and static build started by [PR226](https://github.com/storybooks/react-storybook/pull/226)

# v1.28.3

-   Revert [PR226](https://github.com/storybooks/react-storybook/pull/226)

# v1.28.2

-   Support custom webpack publicPath [PR226](https://github.com/storybooks/react-storybook/pull/226)

# v1.28.1

-   Add charset meta tags to HTML heads [PR216](https://github.com/storybooks/react-storybook/pull/216)

# v1.28.0

-   Moved storybook serving code into a middleware to support more advanced use cases.
-   Refactored dev server to use storybook middleware [PR211](https://github.com/storybooks/react-storybook/pull/211)

# v1.27.0

-   Move modules to storybook-core repo. [PR196](https://github.com/storybooks/react-storybook/pull/196)
-   Add stack-source-map again only for Chrome to get better error stacks.
-   Add ability to control the hostname. See [PR195](https://github.com/storybooks/react-storybook/pull/195) and [PR198](https://github.com/storybooks/react-storybook/pull/198)

# v1.26.0

12-May-2016

-   Ensure asset directory exists in the static-builder.

# v1.25.0

11-May-2016

-   Fix several publishing related issues. See: [#188](https://github.com/storybooks/react-storybook/pull/188).
-   Fix babel extends issue. See: [PR185](https://github.com/storybooks/react-storybook/pull/185).
-   Fix issue with removing a preset from users babelrc.
    -   Fixes: [#183](https://github.com/storybooks/react-storybook/issues/183).
    -   [PR184](https://github.com/storybooks/react-storybook/pull/184)
-   Make left panel scrollable with keeping the filterbox always. See: [PR182](https://github.com/storybooks/react-storybook/pull/182).
-   Add `qs` as a direct dependency as it's used in preview.

# v1.24.0

10-May-2016

-   Add a potential fix for the double scrollbar issue. See: [179](https://github.com/storybooks/react-storybook/issues/179).
-   Add scrolling support to the left panel. Fixes [#177](https://github.com/storybooks/react-storybook/issues/177).
-   Remove NODE_ENV=production flag. Fixes [#158](https://github.com/storybooks/react-storybook/issues/158)

# v1.23.0

09-May-2016

-   Add shortcuts to jump to previous and next stories. See [PR176](https://github.com/storybooks/react-storybook/pull/176)
-   Fix loader concatenation bug specially when custom config doesn't have a loaders section. [PR173](https://github.com/storybooks/react-storybook/pull/173)

# v1.22.1

06-May-2016

-   Add a potential fix for [#167](https://github.com/storybooks/react-storybook/issues/167)
    -   basically, this moved back babel-packages required by webpack.

# v1.22.0

06-May-2016

-   Improve the static builder time.

# v1.21.0

06-May-2016

-   Add configType argument to custom config function. See: [PR169](https://github.com/storybooks/react-storybook/pull/169)
-   Add the unicode version of the Keyboard Shortcut Icon. See: [PR170](https://github.com/storybooks/react-storybook/pull/170)

# v1.20.0

05-May-2016

-   Allow to configure webpack as the user wants. See [PR160](https://github.com/storybooks/react-storybook/pull/160)
-   Add typescript typings support for the core API. See [PR157](https://github.com/storybooks/react-storybook/pull/157)
-   Implement Mantra architecture and some new features including permalinks, full screen support. See: [PR165](https://github.com/storybooks/react-storybook/pull/165)
-   Remove some typo in docs. See: [PR154](https://github.com/storybooks/react-storybook/pull/154)
-   Move UI testing libraries to devDependencies. See: [PR153](https://github.com/storybooks/react-storybook/pull/153)

# v1.19.0

27-April-2016

-   Add airbnb-js-shims to client-side JS. See: [PR147](https://github.com/storybooks/react-storybook/pull/147)
-   Remove self-closing div tag, which is invalid HTML. See: [PR148](https://github.com/storybooks/react-storybook/pull/148)
-   Search for a .babelrc in the storybook config directory first, then the project root. See: [PR149](https://github.com/storybooks/react-storybook/pull/149)

# v1.18.0

26-April-2016

-   Link Storybook menu to the repo. See: [PR137](https://github.com/storybooks/react-storybook/pull/137)
-   Implement keyboard shortcuts and fuzzy search. See: [PR141](https://github.com/storybooks/react-storybook/pull/141)

# v1.17.2

25-April-2016

-   Fix an error which only occurs on Firefox. See: [PR144](https://github.com/storybooks/react-storybook/pull/144)

# v1.17.1

21-April-2016

-   Fix a regression introduce by `v1.17.0`. See: [PR133](https://github.com/storybooks/react-storybook/pull/133)

# v1.17.0

21-April-2016

-   Check all the arguments passed to action for events. See: [PR132](https://github.com/storybooks/react-storybook/pull/132)

# v1.16.1

21-April-2016

-   Fix action logs highlighting issue, which comes as a regression of [PR126](https://github.com/storybooks/react-storybook/pull/126).

# v1.16.0

20-April-2016

-   Prevent re-rendering the preview iframe when there is an action.
    -   Related issue: [#116](https://github.com/storybooks/react-storybook/issues/116)
    -   Related PR: [PR126](https://github.com/storybooks/react-storybook/pull/126)

# v1.15.0

20-April-2016

-   Improve action logger UI and increase max log count to 10. See [PR123](https://github.com/storybooks/react-storybook/pull/123)

# v1.14.0

19-April-2016

-   Add syntax highlights to the logger. See: [PR118](https://github.com/storybooks/react-storybook/pull/118)

# v1.13.0

-   Add some UI test cases. See [PR103](https://github.com/storybooks/react-storybook/pull/103)
-   Implement `.addDecorator()` API. See [PR115](https://github.com/storybooks/react-storybook/pull/115)
-   Add code folding support. See [PR111](https://github.com/storybooks/react-storybook/pull/111)

# v1.12.0

14-April-2016

-   Add support for webpack module preLoaders. See: [PR107](https://github.com/storybooks/react-storybook/pull/107)

# v1.11.0

13-April-2016

-   Add support for React DevTools. See: [PR104](https://github.com/storybooks/react-storybook/pull/104)

# v1.10.2

12-April-2016

Fix various issues related to static bundling.

-   Add custom head generation to static build as well.
-   Use relative urls so, static sites can be host with paths (GH Pages)
-   Identify SyntheticEvent using feature detection. UglifyJS mangal class names, so we can't use classnames to detect a SyntheticEvent in the static build.

# v1.10.1

-   Don't serve index.html in static directory as a site index. See [PR100](https://github.com/storybooks/react-storybook/pull/100)
-   Use cjson for parsing .babelrc files (support comments). See [PR98](https://github.com/storybooks/react-storybook/pull/98)
-   Remove the dist directory before running babel to avoid older code. See [PR101](https://github.com/storybooks/react-storybook/pull/101)

# v1.10.0

-   Add custom head support inside the iframe. See [PR77](https://github.com/storybooks/react-storybook/pull/77)
-   Unmount components before rendering into DOM node. Fix: [#81](https://github.com/storybooks/react-storybook/issues/81)
-   Add a static file builder. See [PR88](https://github.com/storybooks/react-storybook/pull/88)
-   Fix search box's lineHeight to work with all the browsers. See: [PR94](https://github.com/storybooks/react-storybook/pull/94)
-   Add the search box. See: [PR91](https://github.com/storybooks/react-storybook/pull/91).

# v1.9.0

Add some minor improvements.

-   Avoid deprecated warning in Chrome Canary. See: [PR85](https://github.com/storybooks/react-storybook/pull/85)
-   Fix the React Warning about CSS property. See: [PR84](https://github.com/storybooks/react-storybook/pull/84)
-   Transition on latest logged action. See: [PR80](https://github.com/storybooks/react-storybook/pull/80)

# v1.8.0

-   Add story linking functionality.
    -   [Documentation](https://github.com/storybooks/react-storybook/blob/master/docs/api.md#linking-stories).
    -   Original feature request: [#50](https://github.com/storybooks/react-storybook/issues/50)
    -   Implementation: [PR86](https://github.com/storybooks/react-storybook/pull/86)

# v1.7.0

-   Add support to React v15.0.0.

# v1.6.0

-   Make scrollable layout. See: [PR](https://github.com/storybooks/react-storybook/pull/70)
-   Add npm3 requirement to the `package.json`.
-   Add `react` and `react-dom` to devDependencies.

# v1.5.0

-   Add support for most of the custom webpack configuration. See [PR64](https://github.com/storybooks/react-storybook/pull/64)

# v1.4.0

-   Add CLI option to specify the config dir. See [PR52](https://github.com/storybooks/react-storybook/pull/52).

# v1.3.0

-   Load the `.babelrc` manually. Fixed: [#41](https://github.com/storybooks/react-storybook/issues/41)
-   Add a better contributing guide. See [CONTRIBUTING.md](https://github.com/storybooks/react-storybook/blob/master/CONTRIBUTING.md)
-   Add a development utility `npm run dev` which watches "src" directory and run `npm run prepublish`.

# v1.2.0

-   Add a button to clear logs in the ActionLogger. This is requested in [PR21](https://github.com/storybooks/react-storybook/issues/21).
-   Remove navigation list order hijacking. See [commit](https://github.com/storybooks/react-storybook/commit/166365fd38f51f79e69e028a1c11e2620eddcb99).
-   Fix a typo in .gitignore. See [PR31](https://github.com/storybooks/react-storybook/pull/31).
-   Add support for JSX. See [PR18](https://github.com/storybooks/react-storybook/pull/18).

# v1.1.0

-   v1.0.0 was a mistake and it contains very old code. That's why we had to do a 1.1.0 release.

# v1.0.0

-   Yeah!
