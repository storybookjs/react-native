# Roadmap

## Table of contents

-   [New features](#new-features)
    -   [Responsive + multi-device viewports preview.](#responsive--multi-device-viewports-preview)
    -   [Automatic story detection](#automatic-story-detection)
    -   [Theme ability and override core UI components](#theme-ability-and-override-core-ui-components)
    -   [Add a playground addon](#add-a-playground-addon)
    -   [See multiple (or all) stories in 1 preview.](#see-multiple-or-all-stories-in-1-preview)
    -   [Deeper level hierarchy](#deeper-level-hierarchy)
-   [Supporting other frameworks and libraries](#supporting-other-frameworks-and-libraries)
    -   [Vue](#vue) (*in alpha*)
    -   [Angular](#angular) (*in development*)
    -   [Webcomponents](#webcomponents)
    -   [Polymer](#polymer)
    -   [Aurelia](#aurelia)
-   [Breaking changes](#breaking-changes)
    -   [Addon API](#addon-api)
    -   [API for adding stories](#api-for-adding-stories)
-   [Documentation](#documentation)
    -   [Better design](#better-design)
    -   [Record videos and write blog post on how to tweak storybook](#record-videos-and-write-blog-post-on-how-to-tweak-storybook)

## New features

Doing these will be backwards compatible.

### Responsive + multi-device viewports preview.

If you're smart about it you can already view the preview on multiple devices and windows. It's just an iframe after-all.
But story selection and addon-settings are not synced.
We want to make this much much simpler and really are core feature of storybook.

### Automatic story detection

Some tools are doing automatic file detection, jest for example.
We think such a feature is highly needed. A lot of users are already hacking this themselves using webpack specific features.

### Theme ability and override core UI components

Storybook is often used inside product companies and agencies. We want to help them have a sense of quality and immersion.
We're interested in full customizability of our UI, though addons and options.

### Add a playground addon

Many other styleguide-type projects have what's called a playground, where developers can change the code rendering the component inside the app.
Storybook has of course a very tight connection with your editor, and it has a knobs addon.
But we still see value in an addon that will allow the workflow of a playground.

### See multiple (or all) stories in 1 preview.

Storybook's philosophy is about describing small bits in a variety of states.
However some components are best understood when viewed in multiple varieties in 1 view.
It's quite common to see users write a single story, with a wrapper components and multiple instances of the component the story is about.
We plan to add a second mode to storybook that will allow you to see all stories in 1 preview.
That way you can write your stories how they are best, and preview them how you like.

### Deeper level hierarchy

A very long standing issue is about "what about larger styleguides?". Some styleguides have lots and lots of components.
At some point is becomes unmaintainable if you do not group them somehow.
Storybook's UI is not exactly setup for very large styleguides, right now.
But we are going to add a way of defining groups! And develop a UI that allows you to quickly navigate to other groups / stories.

## Supporting other frameworks and libraries

We believe in the power of react, and think it's the right choice for a lot of projects.
But it's up to you and your team to decide your stack.
Unfortunately if you choose anything other then React or React-Native you can not use storybook.

We want you to be able to use storybook with the framework / library of your choice.

### Vue

Storybook for Vue is currently in alpha release, it won't be long now!

### Angular

Storybook for Angular is in development.

### Webcomponents

Interested in supporting.

### Polymer

Interested in supporting, once bower and html-imports are gone.

### Aurelia

Please contact us if you want this.

## Breaking changes

### Addon API

Our addon api is limited and will eventually have to be improved to accommodate better more optimized and modern addons.

### API for adding stories

Currently it's getting hard to setup a story that has data / options for multiple addons.
We want to support this, but will likely mean we will have to change the `add` method's API.

## Documentation

### Better design

We have a new logo, so next step is a overhaul of our documentation site.

### Record videos and write blog post on how to use, tweak & develop storybook

- writing addons, 
- choosing the right addons.
- how to start developing on our codebase.
- how to use storybook itself and the CLI.

