---
id: 'quick-start-guide'
title: 'Quick Start Guide'
---

Storybook is very easy to use. You can use it with any kind of React or Vue or Angular or Mithril project.
Follow these steps to get started with Storybook.

```sh
cd my-project-directory
npm i -g @storybook/cli
getstorybook
```
The `-g` global install is used to run our cli tool in your project directory to generate templates for your existing projects. To avoid the global install and start your project manually, take a look at our [Slow Start Guide](/basics/slow-start-guide/).

To install storybook for HTML, add `--html` argument:
```
getstorybook --html
```
 
This will configure your app for Storybook. After that, you can run your Storybook with:

```sh
npm run storybook
```

Then you can access your storybook from the browser.

* * *

To learn more about what `getstorybook` command does, have a look at our slow start guides:
  * [React](/basics/guide-react/)
  * [Vue](/basics/guide-vue/)
  * [Angular](/basics/guide-angular/)
  * [Mithril](/basics/guide-mithril/)
  * [HTML](/basics/guide-html/)


If you prefer a guided tutorial to reading docs, head to [Learn Storybook](https://www.learnstorybook.com) for a step-by-step guide (currently React-only).
