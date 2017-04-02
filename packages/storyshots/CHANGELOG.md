# ChangeLog

### v3.2.2
16-February-2016

Move set channel to happen before anything runs because addons might init expecting the channel to exist. [PR75](https://github.com/storybooks/storyshots/pull/75)

### v3.2.1
21-January-2016

Provide mock Storybook Channel to Storybook addons. [PR72](https://github.com/storybooks/storyshots/pull/72)

### v3.2.0
30-December-2016

Add support to filter stories by story name using a regexp. [PR70](https://github.com/storybooks/storyshots/pull/70)

### v3.1.1
27-December-2016

Pass storybook context to render function of stories. [PR69](https://github.com/storybooks/storyshots/pull/69)

### v3.1.0
24-December-2016

Add support for require.context. [PR67](https://github.com/storybooks/storyshots/pull/67)

### v3.0.0
22-December-2016

This is a brand new version of StoryShots where it allows you to use StoryShots inside Jest. Earlier we have also bundled a CLI tool which uses some of the internal modules used by Jest.

But it seems like we are building an our own Jest with that. That's why we decided to go with this approach.

If you still like to use our CLI version, use this [version](https://github.com/storybooks/storyshots/tree/v2.1.0).
(It's working but we no longer maintain it.)

### v2.1.0
8-November-2016

Default loaders support markdown file [PR56](https://github.com/kadirahq/storyshots/pull/56)

### v2.0.2
7-November-2016

* `NODE_ENV` is set to `"development"` by default [PR50](https://github.com/kadirahq/storyshots/pull/50)
* `require.context` regexp test includes the begining `./` of filenames [PR55](https://github.com/kadirahq/storyshots/pull/55)

### v2.0.1
20-October-2016

Prepare channel before reading storybook as some addons use it before running stories. [PR41](https://github.com/kadirahq/storyshots/pull/41)

### v2.0.0
11-October-2016

* Update `jest-snapshot` to version 16.0.0. [PR39](https://github.com/kadirahq/storyshots/pull/39)
* Use a directory and extension different from regular jest snapshots for storyshots. [PR40](https://github.com/kadirahq/storyshots/pull/40)

#### Migrating from 1.x.x

From version 2.0.0 by default storyshot files will be stored in a directory named `__storyshots__` (instead of `__snapshots__`) inside storybook config directory. Further storyshot files will use extension `.shot` instead of `.snap`.

These changes are important because they allow storyshots to be used with jest in the same project. See [issue#34](https://github.com/kadirahq/storyshots/issues/34) for more info.

This mean that once storyshots is updated to 2.0.0 it wont check your existing snapshots. It will create new snapshots in the new location and you can delete old ones.

To update safely, follow these steps.

1. Run your 1.x.x version of storyshots and make sure all stories pass.
2. Update storyshots. `npm install @kadira/storyshots@^2.0.0 --save-dev`
3. Delete `__snapshots__` directory and contents from your storybook config directory. Also remove it from your version control system.
4. Run updated storyshots and add the newly added `__storyshots__` directory to your version control system.

Done!

### v1.1.5
9-October-2016

Fix issue where `require.context` did not work with regexps for full path. [PR37](https://github.com/kadirahq/storyshots/pull/37)

### v1.1.4
6-October-2016

Add support for `require.context` inside storybook config module. The regression introduced in v1.1.2 is addressed. [PR33](https://github.com/kadirahq/storyshots/pull/30)

### v1.1.3
30-September-2016

v1.1.2 introduce a [regression](https://github.com/kadirahq/storyshots/pull/30#issuecomment-250805615). So this revert that version.

### v1.1.2
30-September-2016

Add support for `require.context` inside storybook config module. [PR30](https://github.com/kadirahq/storyshots/pull/30)

### v1.1.1
28-September-2016

* Watch mode Summary shows the stats for the last run only. [PR27](https://github.com/kadirahq/storyshots/pull/27)
* If some tests fail exit with status code 1. [PR28](https://github.com/kadirahq/storyshots/pull/28)

### v1.1.0
27-September-2016

Add `--exclude` flag to avoid running stories matching a given regexp. [PR24](https://github.com/kadirahq/storyshots/pull/24) [PR25](https://github.com/kadirahq/storyshots/pull/25)

### v1.0.5
25-September-2016

* Fix missing dependencies. [PR21](https://github.com/kadirahq/storyshots/pull/21)
* Context should contain only the story name. [PR20](https://github.com/kadirahq/storyshots/pull/20)

### v1.0.4

Invalid Version. Same as v1.0.3

### v1.0.3
23-September-2016

Fix a typo in the console Summary message.

### v1.0.1
22-September-2016

Fix: Allow module loaders to return something. [PR14](https://github.com/kadirahq/storyshots/pull/14)

### v1.0.1
22-September-2016

Fix a typo.

### v1.0.0
22-September-2016

Initial Release.
