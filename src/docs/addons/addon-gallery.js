import {stripIndent} from 'common-tags'

export default {
  id: "addon-gallery",
  title: "Addon Gallery",
  content: stripIndent`
    This is a list of available addons for Storybook.

    ## Built-In Addons.

    These addons ship with Storybook by default. You can use them right away.

    ### [Actions](https://github.com/kadirahq/storybook-addon-actions)

    With actions, you can inspect events related to your components. This is pretty neat when you are manually testing your components.

    Also, you can think of this as a way to document events in your components.

    ### [Links](https://github.com/kadirahq/storybook-addon-links)

    With links you can link stories together. With that, you can build demos and prototypes directly from your UI components. (Like you can do with [InVision](https://www.invisionapp.com/) and [Framer.js](https://framerjs.com/))

    ## Third Party Addons

    You need to install these addons directly from NPM in order to use them.

    ### [Specs](https://github.com/mthuret/storybook-addon-specifications)

    This is a very special addon where it'll allow you to write test specs directly inside your stories.
    You can even run these tests inside a CI box.

    ### [Notes](https://github.com/kadirahq/storybook-addon-notes)

    With this addon, you can write notes for each story in your component. This is pretty useful when you are working with a team.

    ### [Info](https://github.com/kadirahq/react-storybook-addon-info)

    If you are using Storybook as a style guide, then this addon will help you to build a nice-looking style guide with docs, automatic sample source code with a PropType explorer.
  `
};
