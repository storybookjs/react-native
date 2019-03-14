---
id: 'quick-start-guide'
title: 'Quick Start Guide'
---

Storybook supports many different frontend view layers with more coming!
React, Vue, Angular, Mithril, Marko, HTML, Svelte, Meteor, Ember and Preact are currently supported. Follow these steps to get started with Storybook.

Get started using the automated command line tool. This command adds a set of boilerplate files for Storybook in your project:

```sh
cd my-project-directory
npx -p @storybook/cli sb init
```

The tool inspects your `package.json` to determine which view layer you're using. If you want to develop HTML snippets in storybook, we can't determine that automatically. So to install storybook for HTML, use the `--type` flag to force that the HTML project type:

```sh
npx -p @storybook/cli sb init --type html
```

It's also useful if our automatic detection fails.

By default npx will use the latest version, if you want to try out the next version (or any specific version), you can use the following:

```sh
npx -p @storybook/cli@5.0.0-rc.6 sb init
```

To setup a project manually, take a look at the [Slow Start Guide](/guides/slow-start-guide/).

Start Storybook with:

```sh
npm run storybook
```

Storybook should now be available in the browser with a link provided in the console.

---

To learn more about what the Storybook CLI command `sb init` command does, have a look at the slow start guides:

- [React](/guides/guide-react/)
- [React Native](/guides/guide-react-native/)
- [Vue](/guides/guide-vue/)
- [Angular](/guides/guide-angular/)
- [Mithril](/guides/guide-mithril/)
- [Marko](/guides/guide-marko/)
- [HTML](/guides/guide-html/)
- [Svelte](/guides/guide-svelte/)
- [Ember](/guides/guide-ember/)
- [Riot](/guides/guide-riot/)
- [Preact](/guides/guide-preact/)

A tutorial is also available at [Learn Storybook](https://www.learnstorybook.com) for a step-by-step guide (only available for React).
