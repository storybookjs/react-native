# Changelog

### v1.7.0
18-Dec-2016

Use a non-hacky way to detect yarn. [PR24](https://github.com/storybooks/getstorybook/pull/24)

### v1.6.1
18-Oct-2016

Fix some typos. [PR21](https://github.com/kadirahq/getstorybook/pull/21)

### v1.6.0
12-Oct-2016

Add yarn support. Now users could install storybook with yarn and use yarn to install deps:

```
yarn global add getstorybook
getstorybook
```

For more info check [docs](https://github.com/kadirahq/getstorybook#yarn-support).

### v1.5.2
07-Oct-2016

* Update more user friendly welcome screen to REACT_SCRIPTS generator.

### v1.5.0
05-Oct-2016

* Update to use the latest storybook. Also update REACT_SCRIPTS generator to support public folder.

### v1.4.6
30-Sep-2016

* Remove index.css import from config.js in CRA.

### v1.4.5
06-Aug-2016

Fix an issue related to Meteor.

  * Related issue: [kadirahq/react-storybook#423](https://github.com/kadirahq/react-storybook/issues/423)
  * The fix: [088eecf](https://github.com/kadirahq/getstorybook/commit/088eecf740bebf522b6608892a3a7e3e34bcfc31)

### v1.4.4
30-Aug-2016

* Update @kadira/storybook to version 2.5.2. [PR17](https://github.com/kadirahq/getstorybook/pull/17)
* Add Arial font and remove image from Welcome message. [PR16](https://github.com/kadirahq/getstorybook/pull/16)

### v1.4.3
30-Aug-2016

This is a mistakenly published version.

### v1.4.2
28-Aug-2016

* React Native: Do not import addons.js on entryfiles.[PR14](https://github.com/kadirahq/getstorybook/pull/14)
* Fix "emojies" typo. [PR15](https://github.com/kadirahq/getstorybook/pull/15)

### v1.4.1
26-Aug-2016

* [RN] Automate setting app name on entry files [PR12](https://github.com/kadirahq/getstorybook/pull/12)
* [RN] Add entry javascript file for Android [PR13](https://github.com/kadirahq/getstorybook/pull/13)

### v1.4.0
25-Aug-2016

* Add support for React Native apps. [PR11](https://github.com/kadirahq/getstorybook/pull/11)

### v1.3.0
11-Aug-2016

* Add support for Webpack React apps. [PR8](https://github.com/kadirahq/getstorybook/pull/8)
* Add support for Meteor. [PR9](https://github.com/kadirahq/getstorybook/pull/9)

### v1.2.0
10-Aug-2016

* Add better default stories. [PR7](https://github.com/kadirahq/getstorybook/pull/7)
* Fix an issue with the `-f` option. With `-f`, it was detecting every app as a CRA based app.

### v1.1.0
3-Aug-2016

Show some feedback when installing NPM dependencies. Fixes: [#5](https://github.com/kadirahq/getstorybook/issues/5).

Now we use `childProcess.spawnSync` to run the `npm install` command.

### v1.0.0
2-Aug-2016

Add the initial release supporting following project types:

* Create React App based projects.
* Any other React app.
* Any React component library.
