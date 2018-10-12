---
id: "quick-start-guide"
title: "Quick Start Guide"
---

Storybook supports many different frontend view layers with more coming!
React, Vue, Angular, Mithril, Marko, HTML and Svelte are currently supported. Follow these steps to get started with Storybook.

Get started using the automated command line tool. This command adds a set of boilerplate files for Storybook in your project:

```sh
cd my-project-directory
npx -p @storybook/cli sb init
```

The tool inspects your `package.json` to determine which view layer you're using. If you want to develop HTML snippets in storybook, we can't determine that automatically. So to install storybook for HTML, add the `--html` argument:

```
npx -p @storybook/cli sb init --html
```

To setup a project manually, take a look at the [Slow Start Guide](/basics/slow-start-guide/).

Start Storybook with:

```sh
npm run storybook
```

Storybook should now be available in the browser with a link provided in the console.

---

To learn more about what `getstorybook` command does, have a look at the slow start guides:

- [React](/basics/guide-react/)
- [Vue](/basics/guide-vue/)
- [Angular](/basics/guide-angular/)
- [Mithril](/basics/guide-mithril/)
- [Marko](/basics/guide-marko/)
- [HTML](/basics/guide-html/)
- [Svelte](/basics/guide-svelte/)
- [Ember](/basics/guide-ember/)

A tutorial is also available at [Learn Storybook](https://www.learnstorybook.com) for a step-by-step guide (only available for React).
