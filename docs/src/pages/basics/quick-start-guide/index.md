---
id: 'quick-start-guide'
title: 'Quick Start Guide'
---

Storybook supports many different frontend frameworks with more coming!
React, Vue, Angular, Mithril, Marko, HTML and Svelte are currently supported. Follow these steps to get started with Storybook.

Get started using the automated command line tool. This command adds a set of boilerplate files for Storybook in your project:
```sh
cd my-project-directory
npm i -g @storybook/cli
getstorybook
```
The `-g` global install is used to run our cli tool in your project directory to generate templates for existing projects. To avoid the global install and setup a project manually, take a look at the [Slow Start Guide](/basics/slow-start-guide/).

To install storybook for HTML, add `--html` argument:
```
getstorybook --html
```


Start Storybook with:
```sh
npm run storybook
```

Storybook should now be available in the browser with a link provided in the console.

* * *

To learn more about what `getstorybook` command does, have a look at the slow start guides:
* [React](/basics/guide-react/)
* [Vue](/basics/guide-vue/)
* [Svelte](/basics/guide-svelte/)
* [Angular](/basics/guide-angular/)
* [Mithril](/basics/guide-mithril/)
* [Marko](/basics/guide-marko/)
* [HTML](/basics/guide-html/)


A tutorial is also available at [Learn Storybook](https://www.learnstorybook.com) for a step-by-step guide (only available for React).
