import { stripIndent } from 'common-tags';

export default {
  id: 'default-config',
  title: 'Default Config',
  content: stripIndent`
    Storybook has a default Webpack setup which is similar to [Create React App](https://github.com/facebookincubator/create-react-app).
    Let's learn about the default config comes with Storybook.

    ## Babel

    We use Babel for JavaScript(ES6) transpiling. Here are some key features of Storybook's Babel configurations.

    ### ES2016+ Support

    We have added ES2016 support with Babel for transpiling your JS code. In addition to that, we've added a few experimental features, like object spreading and async await. Check out our [source](https://github.com/storybooks/react-storybook/blob/master/src/server/config/babel.js#L24) to learn more about these plugins.

    ### .babelrc support

    If your project has a \`.babelrc\` file, we'll use that instead of the default config file. So, you could use any babel plugins or presets that you have used in your project with Storybook.

    ## Webpack

    We use Webpack to serve and load JavaScript modules for the web. We've added some Webpack loaders to bring some good defaults. (This setup is very close to what you get with the [Create React App](https://github.com/facebookincubator/create-react-app).)

    ### CSS Support

    You can simply import CSS files wherever you want, whether it's in the storybook config file, a UI component, or inside a story definition file.

    Basically, you can import CSS like this:

    ~~~js
    // locally
    import './styles.css'
    // or from NPM modules
    import 'bootstrap/dist/css/bootstrap.css';
    ~~~

    ### Image and Static File Support

    You can also import images and media files directly via JavaScript. This helps you to write stories with media files easily. This is how to do it:

    ~~~js
    import React from 'react';
    import { storiesOf, action } from '@kadira/storybook';

    import imageFile from './static/image.png';

    storiesOf('<img>', module)
      .add('with a image', () => (
        <img src={imageFile} />
      ));
    ~~~

    When you are building a storybook, we'll also export the imported image. So, this is a good approach to loading all of your static content.


    > Storybook also has a way to mention static directories via the -s option of the \`react-storybook\` and \`build-storybook\` commands.

    ### JSON Loader

    You can import \`.json\` files, as you do with Node.js. This will also allow you to use NPM projects, which imports \`.json\` files inside them.

    ## NPM Modules

    You can use any of the NPM modules installed on your project. You can simply import and use them.


    > Unfortunately, we don't support Meteor packages. If your UI component includes one or more Meteor packages, try to avoid using them in UI components.
    > If they are containers, you can use [React Stubber](https://github.com/kadirahq/react-stubber) to use them in Storybook.
  `,
};
