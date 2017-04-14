import { stripIndent } from 'common-tags';

export default {
  id: 'add-custom-head-tags',
  title: 'Add Custom Head Tags',
  content: stripIndent`
    Sometimes, you may need to add different tags to the HTML head. This is useful for adding web fonts or some external scripts.

    You can do this very easily. Simply create a file called \`head.html\` inside the Storybook config directory and add tags like this:

    ~~~html
    <script src="https://use.typekit.net/xxxyyy.js"></script>
    <script>try{ Typekit.load(); } catch(e){ }</script>
    ~~~

    That's it. Storybook will inject these tags.

    > **Important**

    > Storybook will inject these tags to the iframe where your components are rendered. So, these won’t be loaded into the main Storybook UI.
  `,
};
