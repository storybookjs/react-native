---
id: 'quick-start-guide'
title: 'Quick Start Guide'
---

Storybook supports many different frontend frameworks with more coming!
React, Vue, Angular, Mithril, Marko, and HTML are currently supported. Follow these steps to get started with Storybook.

Get started using our automated command line tool. This command adds a set of boilerplate files for Storybook in your project:
```sh
cd my-project-directory
npm i -g @storybook/cli
getstorybook
```
The `-g` global install is used to run our cli tool in your project directory to generate templates for your existing projects. To avoid the global install and setup your project manually, take a look at our [Slow Start Guide](/basics/slow-start-guide/).

To install storybook for HTML, add `--html` argument:
```
getstorybook --html
```

You can run your Storybook with:
```sh
npm run storybook
```

Storybook should now be available in your browser with the link provided in the console.

* * *

To learn more about what `getstorybook` command does, have a look at our slow start guides:
* [React](/basics/guide-react/)
* [Vue](/basics/guide-vue/)
* [Angular](/basics/guide-angular/)
* [Mithril](/basics/guide-mithril/)
* [Marko](/basics/guide-marko/)
* [HTML](/basics/guide-html/)


If you prefer a guided tutorial to reading docs, head to [Learn Storybook](https://www.learnstorybook.com) for a step-by-step guide (only available for React).
