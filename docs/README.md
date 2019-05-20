# Website for [storybook.js.org](https://storybook.js.org)

This is the source for [storybook.js.org](https://storybook.js.org). It documents [Storybook](https://github.com/storybooks/storybook), an amazing UI component development environment for React and React Native. The site is built with [Gatsby](https://github.com/gatsbyjs/gatsby).

### Usage

```sh
yarn
yarn dev
```

### Edit Documentation

Documentation is written in Markdown and located inside the [`docs/src/pages`](https://github.com/storybooks/storybook/tree/master/docs/src/pages) directory.

### Guidelines for Writing Good Documentation

0. Explain **why** in addition to **how**. If something is designed a certain way for a reason, provide that reason.
1. Provide examples of code snippets whenever possible - showing is always better than telling.
2. Avoid simplifying problems - this frustrates users even more when they don't understand something "simple".
* Bad examples:
  - `All you need to do is apply...`
  - `Simply add...`
  - `The object is just...`
3. Use concise language - The less time users spend on reading and understanding docs, the better.
* Avoid using passive voice.
  - Passive (bad): `It is believed by Storybook that empowering component builders is important.`
  - Active (good): `Storybook believes in empowering component builders.`
* Place action in the verb.
  - Indirect action (bad): `A refactor of this code is necessary`.
  - Direct action (good): `This code needs to be refactored`.
4. Avoid the use of pronouns - documentation should not address the reader because not everything applies to the person reading our docs.
* Don't use `you` to refer to the user or a third party.
  - Pronoun (bad): `You can also...`
  - Without pronoun (good): `Users can also...`
* Don't use `we` to refer to Storybook, contributors, or Storybook users.
  - Pronoun (bad): `We can create this component...`
  - Without pronoun (good): `The component can be created...`
* Don't use `he`, `she`, `him`, `her`, etc. to refer to a third party unless referring to a specific person.
* Refer to contributors and the product as `Storybook`.
* Refer to users as `users`.
