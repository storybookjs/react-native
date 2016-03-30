# Setting up for CSS

CSS is a dark area of React. There are tons of ways to write CSS with React.

> Arunoda wrote as [article](https://voice.kadira.io/state-of-react-and-css-501d179443d3) about that recently as well. Have a [look at it](https://voice.kadira.io/state-of-react-and-css-501d179443d3).

So, React Storybook allows you to write CSS as you like. It's configurable.

## TOC

* [CSS in JavaScript](#css-in-javascript)
* [CSS webpack Loaders](#css-webpack-loaders)
* [CSS with Meteor](#css-with-meteor)

## CSS in JavaScript

By default, React Storybook doesn't come with any CSS setup. That's because there is no single default option everyone uses. But, if you write CSS using JavaScript, you can use Storybook without any configuration.

This is also true if you use a UI framework like [Material UI](https://github.com/callemall/material-ui).

## CSS webpack Loaders

Usually, we use CSS with the help of webpack and we use CSS loaders inside our app. You can ask React Storybook to use the same loaders. It's pretty simple.

Let's say you are using the style loader inside your app. Then, your webpack config would usually look like this:

```js
var path = require('path')
var webpack = require('webpack')

module.exports = {

  ...

  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [ 'babel' ],
        exclude: /node_modules/,
        include: __dirname
      },
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: __dirname
      }
    ]
  }
}
```

Now, let's customize React Stoybook to use these CSS modules.

> By default, React Storybook uses the babel loader for JavaScript. So, you don't need to add it.

Create a file `.storybook/webpack.config.js`. Then add the following content to it:

```js

const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}
```


It's exactly similar to what we had before, but we have simply chosen to include the parent directory. That's because we are inside the “.storybook” directory.

**That's it.**

Now you can work with CSS files. Follow these steps:


* If your app has a root CSS file(s), simply import it into `.storybook/config.js`.
* If you've imported CSS files directly into a component, you don't have to do anything.
* Just like this, you can use any CSS loader you want, whether it's CSS Modules, SCSS, Less or anything.

> [Refer to this project for more information.](https://github.com/kadira-samples/react-storybook-demo)

## CSS with Meteor

Meteor will automatically import any CSS files into your app. You can also use Less, SCSS or other preprocessors via build-time packages.

React Storybook cannot import CSS automatically. But instead, you can do this:

* You can configure React Storybook to use a CSS loader.
* Then import the main CSS file(s) into `.storybook/config.js`.
* Then import component-specific CSS file(s) right into your story files.

**Let's configure React Storybook to use the style loader inside a Meteor app.**

* Make sure you've added React Storybook properly inside the app.
* Then install style loader with `npm install --save-dev style-loader raw-loader`.
* Then create a file called `.storybook/webpack.config.js` with the following content

```js
const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.css?$/,
        loaders: [ 'style', 'raw' ],
        include: path.resolve(__dirname, '../')
      }
    ]
  }
}
```

> Click [here](https://github.com/mantrajs/mantra-sample-blog-app) to see a complete example.
