import { stripIndent } from 'common-tags';

export default {
  id: 'addon-gallery',
  title: 'Addon Gallery',
  content: stripIndent`
    This is a list of available addons for Storybook.

    ## Built-In Addons.

    These addons ship with Storybook by default. You can use them right away.

    ### [Actions](https://github.com/storybooks/storybook-addon-actions)

    With actions, you can inspect events related to your components. This is pretty neat when you are manually testing your components.

    Also, you can think of this as a way to document events in your components.

    ### [Links](https://github.com/storybooks/storybook-addon-links)

    With links you can link stories together. With that, you can build demos and prototypes directly from your UI components. (Like you can do with [InVision](https://www.invisionapp.com/) and [Framer.js](https://framerjs.com/))

    ## Third Party Addons

    You need to install these addons directly from NPM in order to use them.


    ### [Host](https://github.com/philcockfield/storybook-host)

    A [decorator](https://getstorybook.io/docs/react-storybook/addons/introduction) with
    powerful display options for hosting, sizing and framing your components.


    ### [Specs](https://github.com/mthuret/storybook-addon-specifications)

    This is a very special addon where it'll allow you to write test specs directly inside your stories.
    You can even run these tests inside a CI box.

    ### [Knobs](https://github.com/storybooks/storybook-addon-knobs)

    Knobs allow you to edit React props dynamically using the Storybook UI.
    You can also use Knobs as dynamic variables inside your stories.

    ### [Notes](https://github.com/storybooks/storybook-addon-notes)

    With this addon, you can write notes for each story in your component. This is pretty useful when you are working with a team.

    ### [Info](https://github.com/storybooks/react-storybook-addon-info)

    If you are using Storybook as a style guide, then this addon will help you to build a nice-looking style guide with docs, automatic sample source code with a PropType explorer.

    ### [Options](https://github.com/storybooks/storybook-addon-options)

    The Storybook webapp UI can be customised with this addon. It can be used to change the header, show/hide various UI elements and to enable full-screen mode by default.

    ### [Chapters](https://github.com/yangshun/react-storybook-addon-chapters)

    With this addon, you can showcase multiple components (or varying component states) within a story by breaking it down into smaller categories (chapters) and subcategories (sections) for more organizational goodness.

    ### [Backgrounds](https://github.com/NewSpring/react-storybook-addon-backgrounds)

    With this addon, you can switch between background colors and background images for your preview components. It is really helpful for styleguides.

    ### [Material-UI](https://github.com/sm-react/storybook-addon-material-ui)

    Wraps your story into MuiThemeProvider. It allows you to add your custom themes, switch between them, make changes in the visual editor and download as JSON file

    ### [README](https://github.com/tuchk4/storybook-readme)

    With this addon, you can add docs in markdown format for each story. It very useful because most projects and components already have README.md files. Now it is easy to add them into your Storybook.

    ### [i18n tools](https://github.com/joscha/storybook-addon-i18n-tools)

    With this addon, you can test your storybooks with a different text-direction. It is very useful if you are working on components that have to work both in LTR as well as in RTL languages.

    ### [Props Combinations](https://github.com/evgenykochetkov/react-storybook-addon-props-combinations)

    Given possible values for each prop, renders your component with all combinations of prop values. Useful for finding edge cases or just seeing all component states at once.

  `,
};
