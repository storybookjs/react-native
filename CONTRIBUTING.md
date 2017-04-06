# Contributing to React Storybook

We welcome you help to make React Storybook better. This document will help to streamline the contributing process and save everyone's precious time.

## Issues

No software is bug free. So, if you got an issue, follow these steps:

* Search the [issue list](https://github.com/storybooks/react-storybook/issues?utf8=%E2%9C%93&q=) for current and old issues.
* If non of that is helping, create an issue with with following information:
  * Clear title (make is shorter if possible).
  * Describe the issue in clear language.
  * Share error logs, screenshots and etc.
  * To speed up the issue fixing process, send us a sample repo with the issue you faced:
  
### Reproductions

The best way to help figure out an issue you are having is to produce a minimal reproduction. A good way to do that is using Create React App:

```bash
npm install --global create-react-app getstorybook

create-react-app reproduction
cd reproduction
getstorybook

# make changes to try and reproduce the problem, such as adding components + stories
npm start storybook

# see if you can see the problem, if so, commit it:
git init
git add -A
git commit -m "reproduction for issue #123"

# create an new repository on github to host the reproduction, then:
git remote add origin https://github.com/<your-username>/<repo-name>
git push -u origin master
```

If you follow that process, you can then link to the github repository in the issue. See https://github.com/storybooks/react-storybook/issues/708#issuecomment-290589886 for an example.

**NOTE**: If your issue involves a webpack config, create-react-app will prevent you from modifying the *app's* webpack config, however you can still modify storybook's to mirror your app's version of storybook. Alternatively, use `npm run eject` in the CRA app to get a modifiable webpack config.

## Pull Requests (PRs)

We welcome your contributions. There are many ways you can help us. This is few of those ways:

* Fix typos and add more documentation.
* Try to fix some [bugs](https://github.com/storybooks/react-storybook/labels/bug).
* Work on [enhancements](https://github.com/storybooks/react-storybook/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement) and new [features](https://github.com/storybooks/react-storybook/issues?q=is%3Aissue+is%3Aopen+label%3Afeature).
* Add more tests (specially for the UI).

Before you submit a new PR, make you to run `npm test`. Do not submit a PR if tests are failing. If you need any help, create an issue and ask.

## Development Guide

> If you want to work on a UI feature, refer to the [Storybook UI](https://github.com/kadirahq/storybook-ui) project.

This project written in ES2016+ syntax so, we need to transpile it before use.
So run the following command:

```
npm run dev
```

This will watch files and transpile.

### Linking

First of all link this repo with:

```sh
npm link
```

In order to test features you add, you may need to link the local copy of this repo.
For that we need a sample project. Let's create it.

```sh
npm install --global create-react-app getstorybook
create-react-app my-demo-app
cd my-demo-app
getstorybook
```

> It's pretty important to create a very simple sample project like above.
> Otherwise some of the functionality won't work because of linking.

Then link storybook inside the sample project with:

```sh
npm link @kadira/storybook
```

### Getting Changes

After you've done any change, you need to run the `npm run storybook` command everytime to see those changes.
