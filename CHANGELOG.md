# Changelog

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
