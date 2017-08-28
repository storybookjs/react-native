# Contributing to Storybook

Thanks for your interest in improving Storybook! We are a community-driven project and welcome contributions of all kinds: from discussion to documentation to bugfixes to feature improvements.

Please review this document to help to streamline the process and save everyone's precious time.

This guide assumes you're using `yarn` as package manager. You may have some success using `npm` as well, but there are chances you'll get wrong versions of root dependencies in that case (we only commit `yarn.lock` to the repo).

## Issues

No software is bug free. So, if you got an issue, follow these steps:

-   Search the [issue list](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=) for current and old issues.
    -   If you find an existing issue, please UPVOTE the issue by adding a "thumbs-up reaction". We use this to help prioritize issues!
-   If none of that is helping, create an issue with with following information:
    -   Clear title (make is shorter if possible).
    -   Describe the issue in clear language.
    -   Share error logs, screenshots and etc.
    -   To speed up the issue fixing process, send us a sample repo with the issue you faced:

### Testing against `master`

To test your project against the current latest version of storybook, you can clone the repository and link it with `yarn`. Try following these steps:

1.  Download the latest version of this project, and build it:

    ```sh
    git clone https://github.com/storybooks/storybook.git
    cd storybook
    yarn
    yarn bootstrap -- --core
    ```


2.  Link `storybook` and any other required dependencies:

    ```sh
    cd app/react
    yarn link

    cd <your-project>
    yarn link @storybook/react

    # repeat with whichever other parts of the monorepo you are using.
    ```

### Reproductions

The best way to help figure out an issue you are having is to produce a minimal reproduction against the `master` branch.

A good way to do that is using the example `cra-kitchen-sink` app embedded in this repository:

```sh
# Download and build this repository:
git clone https://github.com/storybooks/storybook.git
cd storybook
yarn
yarn bootstrap -- --core

# make changes to try and reproduce the problem, such as adding components + stories
yarn start

# see if you can see the problem, if so, commit it:
git checkout "branch-describing-issue"
git add -A
git commit -m "reproduction for issue #123"

# fork the storybook repo to your account, then add the resulting remote
git remote add <your-username> https://github.com/<your-username>/storybook.git
git push -u <your-username> master
```

If you follow that process, you can then link to the github repository in the issue. See <https://github.com/storybooks/storybook/issues/708#issuecomment-290589886> for an example.

**NOTE**: If your issue involves a webpack config, create-react-app will prevent you from modifying the _app's_ webpack config, however you can still modify storybook's to mirror your app's version of storybook. Alternatively, use `yarn eject` in the CRA app to get a modifiable webpack config.

## Pull Requests (PRs)

We welcome your contributions. There are many ways you can help us. This is few of those ways:

-   Fix typos and add more [documentation](https://github.com/storybooks/storybook/labels/needs%20docs).
-   Try to fix some [bugs](https://github.com/storybooks/storybook/labels/bug).
-   Work on [API](https://github.com/storybooks/storybook/labels/enhancement%3A%20api), [Addons](https://github.com/storybooks/storybook/labels/enhancement%3A%20addons), [UI](https://github.com/storybooks/storybook/labels/enhancement%3A%20ui) or [Webpack](https://github.com/storybooks/storybook/labels/enhancement%3A%20webpack) use enhancements and new [features](https://github.com/storybooks/storybook/labels/feature%20request).
-   Add more [tests](https://codecov.io/gh/storybooks/storybook/tree/master/packages) (specially for the [UI](https://codecov.io/gh/storybooks/storybook/tree/master/packages/storybook-ui/src)).

Before you submit a new PR, make you to run `yarn test`. Do not submit a PR if tests are failing. If you need any help, create an issue and ask.

### Reviewing PRs

**As a PR submitter**, you should reference the issue if there is one, include a short description of what you contributed and, if it is a code change, instructions for how to manually test out the change. This is informally enforced by our [PR template](https://github.com/storybooks/storybook/blob/master/.github/PULL_REQUEST_TEMPLATE.md). If your PR is reviewed as only needing trivial changes (e.g. small typos etc), and you have commit access, then you can merge the PR after making those changes.

**As a PR reviewer**, you should read through the changes and comment on any potential problems. If you see something cool, a kind word never hurts either! Additionally, you should follow the testing instructions and manually test the changes. If the instructions are missing, unclear, or overly complex, feel free to request better instructions from the submitter. Unless the PR is tagged with the `do not merge` label, if you approve the review and there is no other required discussion or changes, you should also go ahead and merge the PR.

## Issue Triage

If you are looking for a way to help the project, triaging issues is a great place to start. Here's how you can help:

### Responding to issues

Issues that are tagged `question / support` or `needs reproduction` are great places to help. If you can answer a question, it will help the asker as well as anyone searching. If an issue needs reproduction, you may be able to guide the reporter toward one, or even reproduce it yourself using [this technique](https://github.com/storybooks/storybook/blob/master/CONTRIBUTING.md#reproductions).

### Triaging issues

Once you've helped out on a few issues, if you'd like triage access you can help label issues and respond to reporters.

We use the following label scheme to categorize issues:

-   **type** - `bug`, `feature`, `question / support`, `discussion`, `greenkeeper`, `maintenance`.
-   **area** - `addon: x`, `addons-api`, `stories-api`, `ui`, etc.
-   **status** - `needs reproduction`, `needs PR`, `in progress`, etc.

All issues should have a `type` label. `bug`/`feature`/`question`/`discussion` are self-explanatory. `greenkeeper` is for keeping package dependencies up to date. `maintenance` is a catch-all for any kind of cleanup or refactoring.

They should also have one or more `area`/`status` labels. We use these labels to filter issues down so we can easily see all of the issues for a particular area, and keep the total number of open issues under control.

For example, here is the list of [open, untyped issues](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20-label%3A%22bug%22%20-label%3A%22discussion%22%20-label%3A%22feature%22%20-label%3A%22maintenance%22%20-label%3A%22question%20%2F%20support%22%20-label%3A%22documentation%22%20-label%3A%22greenkeeper%22), or here is a list of [bugs that have not been modified since 2017-04-01](https://github.com/storybooks/storybook/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22bug%22%20updated%3A%3C%3D2017-04-01%20). For more info see [searching issues](https://help.github.com/articles/searching-issues/) in the Github docs.

If an issue is a `bug`, and it doesn't have a clear reproduction that you have personally confirmed, label it `needs reproduction` and ask the author to try and create a reproduction, or have a go yourself.

### Closing issues

-   Duplicate issues should be closed with a link to the original.
-   Unreproducible issues should be closed if it's not possible to reproduce them (if the reporter drops offline, 
    it is reasonable to wait 2 weeks before closing).
-   `bug`s should be labelled `merged` when merged, and be closed when the issue is fixed and released.
-   `feature`s, `maintenance`s, `greenkeeper`s should be labelled `merged` when merged, 
    and closed when released or if the feature is deemed not appropriate.
-   `question / support`s should be closed when the question has been answered. 
    If the questioner drops offline, a reasonable period to wait is two weeks.
-   `discussion`s should be closed at a maintainer's discretion.

## Development Guide

> If you want to work on a UI feature, refer to the [Storybook UI](https://github.com/storybooks/storybook/tree/master/lib/ui) page.

This project written in ES2016+ syntax so, we need to transpile it before use.
So run the following command:

```sh
yarn dev
```

This will watch files and transpile in watch mode.

### Linking

First of all link this repo with:

```sh
yarn link
```

In order to test features you add, you may need to link the local copy of this repo.
For that we need a sample project. Let's create it.

```sh
yarn global add create-react-app getstorybook
create-react-app my-demo-app
cd my-demo-app
getstorybook
```

> It's pretty important to create a very simple sample project like above.
> Otherwise some of the functionality won't work because of linking.

Then link storybook inside the sample project with:

```sh
yarn link @storybook/react
```

### Getting Changes

After you've done any change, you need to run the `yarn storybook` command every time to see those changes.

## Release Guide

This section is for Storybook maintainers who will be creating releases.

Each release is described by:

-   A version
-   A list of merged pull requests
-   Optionally, a short hand-written description

Thus, the current release sequence is as follows:

**NOTE: This is a work in progress. Don't try this unless you know what you're doing. We hope to automate this in CI, so this process is designed with that in mind.**

First, build the release:

```sh
# make sure you current with origin/master.
git checkout master
git status

# clean out extra files
# WARNING: destructive if you have extra files lying around!
git clean -fdx && yarn

# build all the packages
yarn bootstrap -- --all
```

From here there are different procedures for prerelease (e.g. alpha/beta/rc) and proper release.

> **NOTE:** the very first time you publish a scoped package (`@storybook/x`) you need to publish it by hand because the default for scoped packages is private, and we need to make our packages public. If you try to publish a package for the first time using our `lerna` publish script, `lerna` will crash halfway through and you'll be in a world of pain.

#### For prerelease (no CHANGELOG):

```sh
# publish and tag the release
yarn publish -- --concurrency 1 --npm-tag=alpha

# push the tags
git push --tags
```

#### For full release (with CHANGELOG):

```sh
# publish but don't commit to git
yarn publish -- --concurrency 1 --skip-git

# Update `CHANGELOG.md`
# - Edit PR titles/labels on github until output is good
# - Optionally, edit a handwritten description in `CHANGELOG.md`
yarn changelog

# tag the release and push `CHANGELOG.md` and tags
# FIXME: not end-to-end tested!
yarn github-release
```
