---
sidebar_position: 5
---

# Sharing Storybook

Storybook is a great tool for sharing your components with your team. It's a great way to get feedback on your components and to make sure they're working as expected.

## Share on iOS via TestFlight

On iOS internal builds are often shared via ad hoc provisioning. The problem with this is that you need to create a new build anytime you want to give a new team member access to the app. Not only that but they will need to have their own device in developer mode in order to install it.

Using TestFlight to share your app is a much easier way that requires much less work and you can share with up to 10k people.

The one complication is that usually your TestFlight build is a production build of your app, this means you can't usually use this for a developer preview. However what you can do is create a separate app in App Center that is specifically used for preview builds and won't ever ship to the App Store.

The following guide will be written for expo because its simpler to get setup, but the same principles apply to other frameworks. The important part will be having a preview version of your app that you ship only internally.

## Get setup

If you don't already have an app, lets create one to get started with.

```bash
npx create-expo-app --template expo-template-storybook AwesomeStorybook
```

This will create a new expo app with storybook already setup.

```bash
cd AwesomeStorybook
```

## Configure eas

Next we'll want to configure eas and setup eas updates.
