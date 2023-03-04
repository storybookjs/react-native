# v6.5.0-rc.5

## What's Changed
* fix: StoryView was interfering with scroll gestures by @jonathanj in https://github.com/storybookjs/react-native/pull/440


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.5.0-rc.4...v6.5.0-rc.5


# v6.5.0-rc.4

## What's Changed
* feat: Make it possible to open the addons in bottom split by @jonathanj in https://github.com/storybookjs/react-native/pull/438


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.5.0-rc.3...v6.5.0-rc.4

# v6.5.0-rc.3

## What's Changed
* feat: Improve styling in the addons panel by @jonathanj in https://github.com/storybookjs/react-native/pull/437


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.5.0-rc.2...v6.5.0-rc.3

# v6.5.0-rc.2

## What's Changed
* docs: update JSX for react-native usage by @Randall71 in https://github.com/storybookjs/react-native/pull/432
* Fix safe area stories cut off by @jonathanj in https://github.com/storybookjs/react-native/pull/431
* feat: replace example app with an expo one by @dannyhw in https://github.com/storybookjs/react-native/pull/435


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.5.0-rc.1...v6.5.0-rc.2

# v6.5.0-rc.1

## What's Changed
* docs: fix missing dep in documentation by @matinzd in https://github.com/storybookjs/react-native/pull/426
* feat: Rerender optimisations by @jonathanj in https://github.com/storybookjs/react-native/pull/427
* feat: Storylist UI usability improvements by @jonathanj in https://github.com/storybookjs/react-native/pull/429
* docs: remove reference to 6.3 by @dannyhw in https://github.com/storybookjs/react-native/pull/430
* feat: support stories config with configuration objects by @stevoland in https://github.com/storybookjs/react-native/pull/424
* chore: improve metro config by @matinzd in https://github.com/storybookjs/react-native/pull/428

## New Contributors
* @matinzd made their first contribution in https://github.com/storybookjs/react-native/pull/426
* @stevoland made their first contribution in https://github.com/storybookjs/react-native/pull/424

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.5.0-rc.0...v6.5.0-rc.1

# v6.5.0-rc.0

Adds template file for `npx sb@next init --type react_native`

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.12...v6.5.0-rc.0

# v6.0.1-beta.12

- auto title generation now works
- number control doesn't crash when default is undefined
- render function args type now correctly matches with your component props
- Orient the OnDeviceUI correctly for RTL locales by @jonathanj

# v6.0.1-beta.11

## What's Changed

* fix: default the list item active color if theme value is undefined by @jgornick in https://github.com/storybookjs/react-native/pull/404
* feat: react native server v6 (experimental) by @dannyhw in https://github.com/storybookjs/react-native/pull/393
* feat: re-add knobs to provide compatibility for easier migration by @dannyhw in https://github.com/storybookjs/react-native/pull/406


Breaking: 

- storybook dependencies must now be 6.5.14 and above since new fixes were included in this version that are required for this to work
- backgrounds are now using the new config format to match the web (see below)
``` 
 parameters: {
    backgrounds: {
      default: 'warm',
      values: [
        { name: 'warm', value: 'hotpink' },
        { name: 'cool', value: 'deepskyblue' },
      ],
    },
  },
``` 


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.10...v6.0.1-beta.11

# v6.0.1-beta.10

## What's Changed
* feat: allow for main.ts or any other file extension by @dannyhw in https://github.com/storybookjs/react-native/pull/391
* fix: dont error with no addons by @dannyhw in https://github.com/storybookjs/react-native/pull/386
* feat: enables use of docgen for generated arg types (somewhat experimental) by @dannyhw in https://github.com/storybookjs/react-native/pull/392
* chore(deps): bump loader-utils from 1.4.0 to 1.4.2 by @dependabot in https://github.com/storybookjs/react-native/pull/396
* fix: add defensive check before call m.hot.accept by @nutstick in https://github.com/storybookjs/react-native/pull/397
* fix: workaround for infinite global decorators by @dannyhw in https://github.com/storybookjs/react-native/pull/398

## New Contributors
* @nutstick made their first contribution in https://github.com/storybookjs/react-native/pull/397

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.9...v6.0.1-beta.10

# v6.0.1-beta.9

## What's Changed

Big changes in this release.

this includes
- support for the story store changes introduced in 6.4
- compatibility with storybook v6.5
- CSF3
- HMR/Fast refresh now works properly!!!
- More code re-used from storybook core apis
- fix for a bug in the tab bar animation

Largely made possible by help from @shilman and @tmeasday on the 6.5 branch.

note: there was a temporary polyfill added to include the global document object whilst changes are made in storybook to allow for a parameterised preview and store. This shouldn't require any changes from the user and is temporary.

## Breaking: 

- There is now a new peer dependency on react-dom due to some code re-use around the preview.

This should hopefully be removed soon, though it shouldn't impact your development other than adding react dom to your dev dependencies. Hopefully this is an acceptable compromise for finally having 6.4/6.5 support.


## commits

* update example to react native 0.70.2 by @dannyhw in https://github.com/storybookjs/react-native/pull/381
* feat: support for storybook 6.4/6.5, CSF3 and HMR fix by @dannyhw in https://github.com/storybookjs/react-native/pull/384


**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.8...v6.0.1-beta.9

# v5.3.27

- fix: deprecated dimensions remove listener removed

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v5.3.26...v5.3.27

# v6.0.1-beta.8

## What's Changed
* chore(deps): bump moment from 2.29.2 to 2.29.4 by @dependabot in https://github.com/storybookjs/react-native/pull/369
* allow rendering outside safe area by @pvinis in https://github.com/storybookjs/react-native/pull/345
* chore(deps): bump terser from 4.8.0 to 4.8.1 by @dependabot in https://github.com/storybookjs/react-native/pull/373
* fix: Results seemingly not matching filter terms by @jonathanj in https://github.com/storybookjs/react-native/pull/380
* fix: make react hooks useable in component story by @zhouzh1 in https://github.com/storybookjs/react-native/pull/379
* fix: loader js does not see other preview types by @zakharchenkoAndrii in https://github.com/storybookjs/react-native/pull/374
* refactor: some adjustments to safe area styling by @dannyhw in https://github.com/storybookjs/react-native/pull/371
* feat: outline for hide ui button by @pvinis in https://github.com/storybookjs/react-native/pull/382

## New Contributors
* @pvinis made their first contribution in https://github.com/storybookjs/react-native/pull/345
* @jonathanj made their first contribution in https://github.com/storybookjs/react-native/pull/380
* @zhouzh1 made their first contribution in https://github.com/storybookjs/react-native/pull/379
* @zakharchenkoAndrii made their first contribution in https://github.com/storybookjs/react-native/pull/374

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.7...v6.0.1-beta.8

# v6.0.1-beta.7

## What's Changed
* chore(deps): bump moment from 2.29.1 to 2.29.2 by @dependabot in https://github.com/storybookjs/react-native/pull/343
* chore(deps): bump plist from 3.0.4 to 3.0.5 by @dependabot in https://github.com/storybookjs/react-native/pull/344
* Update README.md for v6 by @dannyhw in https://github.com/storybookjs/react-native/pull/347
* fix: temporary fix for #327 by @dannyhw in https://github.com/storybookjs/react-native/pull/351
* chore(deps): bump cross-fetch from 3.1.4 to 3.1.5 by @dependabot in https://github.com/storybookjs/react-native/pull/353
* chore(deps): bump semver-regex from 3.1.3 to 3.1.4 by @dependabot in https://github.com/storybookjs/react-native/pull/360
* chore(deps): bump simple-plist from 1.1.1 to 1.3.1 by @dependabot in https://github.com/storybookjs/react-native/pull/359
* chore(deps): bump async from 2.6.3 to 2.6.4 by @dependabot in https://github.com/storybookjs/react-native/pull/352
* code typo fixed in manual setup by @BurakGur in https://github.com/storybookjs/react-native/pull/365
* chore(deps): bump parse-url from 6.0.0 to 6.0.2 by @dependabot in https://github.com/storybookjs/react-native/pull/366
* feat: add story id support to initial selection by @jgornick in https://github.com/storybookjs/react-native/pull/368
* Log errors when loading stories on device fails by @micheleb in https://github.com/storybookjs/react-native/pull/358

## New Contributors
* @BurakGur made their first contribution in https://github.com/storybookjs/react-native/pull/365
* @micheleb made their first contribution in https://github.com/storybookjs/react-native/pull/358

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v6.0.1-beta.5...v6.0.1-beta.7

# v5.3.26

note: only notes and knobs were updated in this release so there is no new version of storybook/react-native and instead only for those two packages.

## What's Changed
* Update README.md by @wolverineks in https://github.com/storybookjs/react-native/pull/165
* [bug] Using addon-ondevice-notes crashes app on startup  by @daniellyqueiroz in https://github.com/storybookjs/react-native/pull/361
* fix: v5 notes addon crash and fail to install by @dannyhw in https://github.com/storybookjs/react-native/pull/362

## New Contributors
* @wolverineks made their first contribution in https://github.com/storybookjs/react-native/pull/165
* @daniellyqueiroz made their first contribution in https://github.com/storybookjs/react-native/pull/361

**Full Changelog**: https://github.com/storybookjs/react-native/compare/v5.3.25...v5.3.26

# 6.0.1-beta.5

- Story navigator now more closely matches web design (#326)
- The Number range control now shows the current value (#336)

# v6.0.1-beta.1

## Feature

- export preview for extendability (#312)

## Fixes

- should persist selection by default (#311)
- better web controls (#322)

# Breaking change 

`radios` is now `radio` to better match the web

- fixed inconsistent control type for 'radio' (#309)


# v6.0.1-alpha.5

## Features

- you can now specify a config location and you can change the folder name #278
    - note that this folder should still contain all the same files
    - `—absolute` option will use absolute imports in the requires.js file
    - paths in general should work better with the watcher and get stories script
- choosing an initial selection is now easier and is correctly typed #274

## Breaking changes (since previous alpha):

- In main.js stories are relative from the config directory and no longer add "../", this should fix absolute paths and other bugs #278
 - make sure to update your paths if you were using v6.0.1-alpha.3
- `sbn-get-stories` and `sbn-watcher` are now `sb-rn-get-stories`  and `sb-rn-watcher` so make sure to update these if you were using v6.0.1-alpha.3
- @react-native-async-storage/async-storage is now a peer dependency and is required
- AsyncStorage is no longer needed as an option to getStorybookUI


# v6.0.1-alpha.3

- Build now targets ES6 so that the ondeviceUI works out of the box on react-native-web [251](https://github.com/storybookjs/react-native/pull/251)

# v6.0.1-alpha.2

- moved storybook.requires and storybook.tsx to .storybook/ [252](https://github.com/storybookjs/react-native/pull/252)
- fix for action appearing as invalid control [246](https://github.com/storybookjs/react-native/pull/246)
- Improve the message shown on the Controls tab when the story has no controls configured. [254](https://github.com/storybookjs/react-native/pull/254)
- fix(scripts): reduce watcher updates and fix small path bug [261](https://github.com/storybookjs/react-native/pull/261)

# v6.0.1-alpha.1

fixes:

- #237 adding util dependency

# v6.0.1-alpha.0

## Features

Many of these features come from the web storybook so you can find more info by looking at the storybook documentation.

- New story format CSF
- Args
- Knobs replaced by Controls
- ondevice addons Notes, actions and backgrounds have all been updated to work for 6.0+
- New declarative config style
- Auto story detection built in. Including an optional watcher.
- Overall simplified implementation

## Bug fixes

- Much less warnings when using controls (knobs replacement) - no longer using deprecated components.
- Promises no longer break for the entire app when using storybook. 
- Weird storylist bottom margin is now gone

## Breaking Changes

- Knobs are no longer supported, use controls instead
- storiesOf syntax is no longer recommended and you should move to CSF
- You now require a main.js and preview.js file to configure storybook.
- in order to resolve issues with polyfills that caused promises to break and much more you should change your metro config to include
   - `resolverMainFields: ['sbmodern', 'main']` in the resolver field

See https://github.com/storybookjs/react-native/blob/next-6.0/v6README.md for a guide to try out this alpha


# v5.3.25
 
Includes a fallback for when theme values fail

# v5.3.24

## Bug fixes

- size of radios is inconsistent with other knobs (#118)
- type annotation for storiesOf method (#124)
- ondevice select knob undefined value causes key error (#111)
- reset groupId in selectStory handler (#137)
- fix for status bar covering stories on android+expo (#88)
- on device knobs - number knob  will convert a coma to a dot (#136) 
- some minor ui fixes

# v5.3.23 (September 25, 2020)

updated links for npm

# v5.3.22 (September 25, 2020)

### Bug Fixes

- server addons and update all dependencies to use storybook 5.3.20 #100
- color picker will no longer crash the app #85
- boolean knob no longer throws a warning #70
- modal selector no longer causes the app to freeze/crash #74

# Features

- radios knob type added #83

## 5.3.20-alpha.1 (August 27, 2020)

### Bug Fixes

- server addons and update all dependencies to use storybook 5.3.20 [#100](https://github.com/storybookjs/react-native/pull/100)

## 5.3.20-alpha.0 (August 19, 2020)

### Features

- radios knob type added [83](https://github.com/storybookjs/react-native/pull/83)

### Bug Fixes

- color picker will no longer crash the app [#85](https://github.com/storybookjs/react-native/pull/85)
- boolean knob no longer throws a warning [#70](https://github.com/storybookjs/react-native/pull/70)
- modal selector no longer causes the app to freeze/crash [#74](https://github.com/storybookjs/react-native/pull/74)
