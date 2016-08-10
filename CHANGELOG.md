# Changelog

### v1.1.0
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
