import { stripIndent } from 'common-tags';

export default {
  id: 'faq',
  title: 'Frequently Asked Questions',
  content: stripIndent`
    Here are some answers to frequently asked questions. If you have a question, you can ask it by opening an issue on the [Storybook Repository](https://github.com/storybooks/react-storybook/).

    ### How can I run coverage tests with Create React App and leave out stories?

    Create React App does not allow providing options to Jest in your \`package.json\`, however you can run \`jest\` with commandline arguments:

    ~~~
    npm test -- --coverage --collectCoverageFrom='["src/**/*.{js,jsx}","!src/**/stories/*"]'
    ~~~
  `,
};
