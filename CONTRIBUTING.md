# Contributing to Storybook

Thanks for your interest in improving Storybook! We are a community-driven project and welcome contributions of all kinds: from discussion to documentation to bugfixes to feature improvements.

Please review this document to help to streamline the process and save everyone's precious time.

This repo uses pnpm workspaces, so you should install `pnpm` as the package manager. See [installation guide](https://pnpm.io/installation).

- [Issues](#issues)
  - [Reproductions](#reproductions)
- [Pull requests](#pull-requests)
  - [Reviewing PRs](#reviewing-prs)
- [Development Guide](#development-guide)
  - [Repository explained](#repository-explained)

## Issues

No software is bug-free. So, if you got an issue, follow these steps:

- Search the [issue list](https://github.com/storybookjs/react-native/issues?utf8=%E2%9C%93&q=) for current and old issues.
  - If you find an existing issue, please UPVOTE the issue by adding a "thumbs-up reaction". We use this to help prioritize issues!
- If none of that is helping, create an issue with the following information:
  - Clear title (shorter is better).
  - Describe the issue in clear language.
  - Share error logs, screenshots and etc.
  - To speed up the issue fixing process, send us a sample repo with the issue you faced:

### Reproductions

#### In the monorepo

The best way to help figure out an issue you are having is to produce a minimal reproduction against the `master` branch.

A good way to do that is using the example app embedded in this repository:

```sh
# Download and build this repository:
git clone https://github.com/storybookjs/react-native.git react-native-storybook
cd react-native-storybook
pnpm build

# make changes to try and reproduce the problem, such as adding components + stories
cd examples/expo-example
# for ios
pnpm ios
# for android
pnpm android
# for web
pnpm web

# see if you can see the problem, if so, commit it:
git checkout -b "branch-describing-issue"
git add -A
git commit -m "reproduction for issue #123"

# fork the storybook repo to your account, then add the resulting remote
git remote add <your-username> https://github.com/<your-username>/<fork-name>.git
git push -u <your-username> master
```

_setup guide for native example coming soon_

If you follow that process, you can then link to the GitHub repository in the issue.

#### Outside the monorepo

Since react-native by default doesn't support sym links we can't easily link the project like you might with web projects.

No good solution for this currently however if you know an easy way to get symlinking working for react native + metro please open and issue explain your suggestion.

# Pull Requests

We welcome all contributions. There are many ways you can help us. This is few of those ways:

If you need any help, the best way is to [join the discord server and ask in the react-native channel](https://discord.gg/sMFvFsG).

### Reviewing PRs

**As a PR submitter**, you should reference the issue if there is one, include a short description of what you contributed and, if it is a code change, instructions for how to manually test out the change. This is informally enforced by our [PR template](https://github.com/storybookjs/react-native/blob/master/.github/PULL_REQUEST_TEMPLATE.md). If your PR is reviewed as only needing trivial changes (e.g. small typos etc), and you have commit access then you can merge the PR after making those changes.

**As a PR reviewer**, you should read through the changes and comment on any potential problems. If you see something cool, a kind word never hurts either! Additionally, you should follow the testing instructions and manually test the changes. If the instructions are missing, unclear, or overly complex, feel free to request better instructions from the submitter. Unless the PR is tagged with the `do not merge` label, if you approve the review and there is no other required discussion or changes, you should also go ahead and merge the PR.

## Issue Triage

If you are looking for a way to help the project, triaging issues is a great place to start. Here's how you can help:

### Responding to issues

Issues that are tagged `question / support` or `needs reproduction` are great places to help. If you can answer a question, it will help the asker as well as anyone who has a similar question. Also in the future if anyone has that same question they can easily find it by searching. If an issue needs reproduction, you may be able to guide the reporter toward one, or even reproduce it yourself using [this technique](https://github.com/storybookjs/react-native/blob/master/CONTRIBUTING.md#reproductions).

### Triaging issues

Once you've helped out on a few issues, if you'd like triage access you can help label issues and respond to reporters.

We use the following label scheme to categorize issues:

- **type** - `bug`, `feature`, `question / support`, `discussion`, `dependencies`, `maintenance`.
- **area** - `addon: x`, `addons-api`, `stories-api`, `ui`, etc.
- **status** - `needs reproduction`, `needs PR`, `in progress`, etc.

All issues should have a `type` label. `bug`/`feature`/`question`/`discussion` are self-explanatory. `dependencies` is for keeping package dependencies up to date. `maintenance` is a catch-all for any kind of cleanup or refactoring.

They should also have one or more `area`/`status` labels. We use these labels to filter issues down so we can see all of the issues for a particular area, and keep the total number of open issues under control.

For example, here is the list of [open, untyped issues](https://github.com/storybookjs/react-native/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20-label%3A%22bug%22%20-label%3A%22discussion%22%20-label%3A%22feature%22%20-label%3A%22maintenance%22%20-label%3A%22question%20%2F%20support%22%20-label%3A%22documentation%22%20-label%3A%22greenkeeper%22), or here is a list of [bugs that have not been modified since 2017-04-01](https://github.com/storybookjs/react-native/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20label%3A%22bug%22%20updated%3A%3C%3D2017-04-01%20). For more info see [searching issues](https://help.github.com/articles/searching-issues/) in the Github docs.

If an issue is a `bug`, and it doesn't have a clear reproduction that you have personally confirmed, label it `needs reproduction` and ask the author to try and create a reproduction, or have a go yourself.

### Closing issues

- Duplicate issues should be closed with a link to the original.
- Unreproducible issues should be closed if it's not possible to reproduce them (if the reporter drops offline,
  it is reasonable to wait 2 weeks before closing).
- `bug`s should be labelled `merged` when merged, and be closed when the issue is fixed and released.
- `feature`s, `maintenance`s, `greenkeeper`s should be labelled `merged` when merged,
  and closed when released or if the feature is deemed not appropriate.
- `question / support`s should be closed when the question has been answered.
  If the questioner drops offline, a reasonable period to wait is two weeks.
- `discussion`s should be closed at a maintainer's discretion.

## Development Guide

### Repository explained

This repository is madeup of the various packages that are specific to react-native storybook.

These packages are:

- @storybook/react-native
- @storybook/react-native-server
- @storybook/addon-ondevice-actions
- @storybook/addon-ondevice-backgrounds
- @storybook/addon-ondevice-controls
- @storybook/addon-ondevice-notes

#### @storybook/react-native

This is the core of the project that makes it possible to use storybook in react native and "on device" for example android/ios devices. This project uses the packages from @storybook to make a version of storybook that works for react native. You will also find here all of the UI components that you see on your device such as the sidebar and other navigation components.

You can find this package under `packages/react-native`

#### @storybook/react-native-server

This is the web server and client that are used to control the on device UI remotely. By using the server package you can control which story is shown on devices that are running @storybook/react-native.

You can find this package under `packages/react-native-server`

The server is currently not maintained and will be tackled sometime after v6.

#### Ondevice Addons

These are the addons for storybook that have been recreated for the on device UI on react-native. The currently supported addons are actions, knobs, notes and backgrounds.

You can find the addons under `packages/` they start with the prefix `ondevice-`

### Prerequisites

Please have the **_latest_** stable versions of the following on your machine

- node
- pnpm

If this is your first time running react native follow the setup instructions in the [react native documentation](https://reactnative.dev/docs/environment-setup) to get everything setup correctly.

### Initial Setup

If you run into trouble here, make sure your node and **_pnpm_** are on the latest versions.

1.  `cd ~` (optional)
2.  `git clone https://github.com/storybookjs/react-native.git react-native-storybook` _bonus_: use your own fork for this step
3.  `cd react-native-storybook`
4.  `pnpm install`
5.  `pnpm build`

### Running the project

To see your changes you should run `pnpm dev` this starts everything in watch mode so don't need to manually build the packages.
Once you have this running then you can run the example app to see your changes.

### Working with the example app

The `examples/expo-example` folder of the repo has an example storybook implementation built with the react-native cli. It shows many of the options and add-ons available and is automatically linked to all the development packages. We highly encourage you to use it to develop/test contributions on.

You still need to pnpm dev or you won't see your changes reflected in the app. For example if I change an addon or app/react-native I need to rebuild the code for the changes take effect (pnpm prepare) or `pnpm dev` can do this automatically as I make changes.

If this is your first time running react native from the cli follow the setup instructions in the [react native documentation](https://reactnative.dev/docs/environment-setup) to get everything setup correctly.

```
cd examples/expo-example

# for ios
pnpm ios

# for android
pnpm android
```

### Run Linter

We use eslint as a linter for all code (including typescript code).

All you have to run is:

```sh
pnpm lint
```

It can be immensely helpful to get feedback in your editor, if you're using VsCode, you should install the `eslint` plugin and configure it with these settings:

```plaintext
"eslint.autoFixOnSave": true,
"eslint.packageManager": "pnpm",
"eslint.options": {
  "cache": true,
  "cacheLocation": ".cache/eslint",
  "extensions": [".js", ".jsx", ".mjs", ".json", ".ts", ".tsx"]
},
"eslint.validate": [
  "javascript",
  "javascriptreact",
  {"language": "typescript", "autoFix": true },
  {"language": "typescriptreact", "autoFix": true }
],
"eslint.alwaysShowStatus": true
```

This should enable auto-fix for all source files, and give linting warnings and errors within your editor.

## Release Guide

This section is for Storybook maintainers who will be creating releases.

We use [Changesets](https://github.com/changesets/changesets) for versioning and publishing. All public packages are versioned together (fixed versioning).

### Adding a changeset

When you make a change that should be released, add a changeset to your PR:

```sh
pnpm changeset
```

This will prompt you to select the packages affected and the bump type (patch/minor/major). Since all packages are fixed together, the highest bump type across all changesets will be applied to every package.

Not all PRs need a changeset — skip it for documentation, CI, or other non-publishable changes. The [changeset bot](https://github.com/apps/changeset-bot) will comment on PRs to remind contributors.

### Publishing via GitHub Actions (recommended)

Publishing is done via a manually-triggered GitHub Action. Go to **Actions > Publish Packages** and select the release type:

| Release type | npm tag  | Version example                 | Consumes changesets? |
| ------------ | -------- | ------------------------------- | -------------------- |
| **canary**   | `canary` | `10.3.0-canary-20260215T120000` | No                   |
| **next**     | `next`   | `10.3.0-next.0`                 | Yes                  |
| **latest**   | `latest` | `10.3.0`                        | Yes                  |

- **Canary**: Snapshot release for testing. Does not consume changesets or commit back to the repo.
- **Next**: Pre-release for the upcoming version. Consumes changesets and commits version bumps back.
- **Latest**: Stable release. Consumes changesets, commits version bumps, and pushes git tags.

### Publishing locally

If you need to publish from your local machine:

```sh
# make sure you're up to date
git checkout next
git pull origin next

# build all packages
pnpm build

# version packages (requires GITHUB_TOKEN for changelog generation)
GITHUB_TOKEN=your_token pnpm changeset version

# publish with your chosen tag
pnpm changeset publish --tag next     # or --tag latest, --tag canary

# commit and push version changes
git add .
git commit -m "chore: version packages"
git push --follow-tags
```

For canary (snapshot) releases locally:

```sh
pnpm changeset version --snapshot canary
pnpm changeset publish --tag canary
# no need to commit — snapshot versions are disposable
```
