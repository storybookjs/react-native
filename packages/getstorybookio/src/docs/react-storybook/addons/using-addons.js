import { stripIndent } from 'common-tags';

const images = {
  storiesWithoutNotes: require('./static/stories-without-notes.png'),
  storiesWithNotes: require('./static/stories-with-notes.png'),
};

export default {
  id: 'using-addons',
  title: 'Using Addons',
  content: stripIndent`
    By default, Storybook comes with two addons, which are [actions](https://github.com/storybooks/storybook-addon-actions) and [links](https://github.com/storybooks/storybook-addon-links). But you can use any third party addons distributed via NPM.

    Here's how to do it.

    Now we are going to use an addon called [Notes](https://github.com/storybooks/storybook-addon-notes). Basically, it allows you to write notes for your stories.

    First, you need to create a file called \`addons.js\` inside the storybook config directory and add the following content:

    ~~~js
    import '@kadira/storybook/addons';
    ~~~

    This will load our default addons.

    Then install the notes addon with:

    ~~~sh
    npm i --save '@kadira/storybook-addon-notes';
    ~~~


    After that, add it to the addons.js like this:

    ~~~js
    import '@kadira/storybook/addons';
    import '@kadira/storybook-addon-notes/register';
    ~~~


    Then you'll be able to see those notes when you are viewing the story.

    ![Stories without notes](${images.storiesWithoutNotes})

    Now when you are writing a story it like this and add some notes:

    ~~~js
    import React from 'react';
    import { storiesOf, action, linkTo } from '@kadira/storybook';
    import Button from './Button';
    import { WithNotes } from '@kadira/storybook-addon-notes';

    storiesOf('Button', module)
      .add('with some emoji', () => (
        <WithNotes notes={'Here we use some emoji as the Button text. Isn\\'t it look nice?'}>
          <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>
        </WithNotes>
      ));
    ~~~

    Then you'll be able to see those notes when you are viewing the story.

    ![Stories with notes](${images.storiesWithNotes})

    Just like this, you can install any other addon and use it. Have a look at our [addon gallery](/docs/react-storybook/addons/addon-gallery) to discover more addons.

    > This particular addon has created a panel in Storybook. Some addons may not create a panel and may use some other Storybook platform features.
    >
    > So, look at the addon’s own documentation on how to use it.
  `,
};
