* * *

id: 'addon-gallery'

## title: 'Addon Gallery'

This is a list of available addons for Storybook.

## Addons maintained by storybook team.

### [Actions](https://github.com/storybooks/storybook/tree/master/addons/actions)

With actions, you can inspect events related to your components. This is pretty neat when you are manually testing your components.

Also, you can think of this as a way to document events in your components.

### [Links](https://github.com/storybooks/storybook/tree/master/addons/links)

With links you can link stories together. With that, you can build demos and prototypes directly from your UI components.

### [Knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs)

Knobs allow you to edit React props dynamically using the Storybook UI.
You can also use Knobs as dynamic variables inside your stories.

### [Notes](https://github.com/storybooks/storybook/tree/master/addons/notes)

With this addon, you can write notes for each story in your component. This is pretty useful when you are working with a team.

### [Info](https://github.com/storybooks/storybook/tree/master/addons/info)

If you are using Storybook as a style guide, then this addon will help you to build a nice-looking style guide with docs, automatic sample source code with a PropType explorer.

### [Options](https://github.com/storybooks/storybook/tree/master/addons/options)

The Storybook webapp UI can be customised with this addon. It can be used to change the header, show/hide various UI elements and to enable full-screen mode by default.

### [Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots)

Storyshots is a way to automatically jest-snapshot all your stories. [More info here](/testing/structural-testing/).

### [Console](https://github.com/storybooks/storybook-addon-console)

Redirects console output (logs, errors, warnings) into Action Logger Panel. `withConsole` decorator notifies from what stories logs are coming.

## Community Addons

You need to install these addons directly from NPM in order to use them.

### [Readme](https://github.com/tuchk4/storybook-readme)

With this addon, you can add docs in markdown format for each story.
It very useful because most projects and components already have README.md files.
Now it is easy to add them into your Storybook.

### [Story-router](https://github.com/gvaldambrini/storybook-router)

A [decorator](/addons/introduction) that allows you to use your routing-aware components in your stories.

### [Host](https://github.com/philcockfield/storybook-host)

A [decorator](/addons/introduction) with powerful display options for hosting, sizing and framing your components.

### [Specs](https://github.com/mthuret/storybook-addon-specifications)

This is a very special addon where it'll allow you to write test specs directly inside your stories.
You can even run these tests inside a CI box.

### [Chapters](https://github.com/yangshun/react-storybook-addon-chapters)

With this addon, you can showcase multiple components (or varying component states) within 1 story.
Break your stories down into smaller categories (chapters) and subcategories (sections) for more organizational goodness.

### [Props Combinations](https://github.com/evgenykochetkov/react-storybook-addon-props-combinations)

Given possible values for each prop, renders your component with all combinations of prop values.
Useful for finding edge cases or just seeing all component states at once.

### [Backgrounds](https://github.com/NewSpring/react-storybook-addon-backgrounds)

With this addon, you can switch between background colors and background images for your preview components. It is really helpful for styleguides.

### [Material-UI](https://github.com/sm-react/storybook-addon-material-ui)

Wraps your story into MuiThemeProvider.
It allows you to add your custom themes, switch between them, make changes in the visual editor and download as JSON file

### [i18n tools](https://github.com/joscha/storybook-addon-i18n-tools)

With this addon, you can test your storybooks with a different text-direction.
It is very useful if you are working on components that have to work both in LTR as well as in RTL languages.

### [JSX preview](https://github.com/Kilix/storybook-addon-jsx)

This addon shows a preview of the JSX code for each story.
It allows you to configure the display and copy the code with a single click.

### [Intl](https://github.com/truffls/storybook-addon-intl)

With this addon you will have an additional panel at the bottom which provides you buttons to switch the locale and directly see the result in the preview.

### [Versions](https://github.com/buildit/storybook-addon-versions)

This addon lets you navigate different versions of static Storybook builds. As such you can see how a component has changed over time.

### [Apollo](https://github.com/abhiaiyer91/apollo-storybook-decorator)

Wrap your stories with the Apollo client for mocking GraphQL queries/mutations.

### [Screenshot](https://github.com/tsuyoshiwada/storybook-chrome-screenshot)

Save the screenshot image of your stories. via [Puppeteer](https://github.com/GoogleChrome/puppeteer).

### [Styles](https://github.com/Sambego/storybook-styles)

Add ability to customize styles in the story preview area

### [Figma](https://github.com/hharnisc/storybook-addon-figma)

Embed [Figma](https://figma.com) designs in a storybook panel.

### [State](https://github.com/Sambego/storybook-state)

Manage state inside a story. Update components when this state changes.

### [State](https://github.com/dump247/storybook-state/)

Manage state inside a story. Update components when this state changes.
Wrap the story in a function call to setup state management. The story can modify
state properties with the provided store. The addon provides a panel to view and
reset state.
