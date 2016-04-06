# Known Issues

## NPM 404 Error

This package is published as a NPM [scoped package](https://docs.npmjs.com/misc/scope). So, if you get a 404 error while doing `npm install`, that seems like you are using a different NPM registry(or a NPM proxy).

**Try to use the default registy.**

See more: https://github.com/kadirahq/react-storybook/issues/15

## Potential issues with NPM 2

If you are using NPM 2, you may got some weird [issues](https://github.com/kadirahq/react-storybook/issues/65). Try to use NPM 3. Here's how to do it:

```
npm i -g npm@3.8.5
rm -rf node_modules
npm i
```

## Issues with Babel 5

If you are using babel 5 inside your project, you will get some errors on parsing modules.
Try to migrate your project to babel 6.

See more: https://github.com/kadirahq/react-storybook/issues/16
