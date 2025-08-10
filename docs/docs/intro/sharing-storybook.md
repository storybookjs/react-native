---
sidebar_position: 5
---

# Sharing Storybook

Storybook is a great tool for sharing your components with your team. It's a great way to get feedback on your components and to make sure they're working as expected.

## Share on iOS via TestFlight

On iOS internal builds are often shared via ad hoc provisioning. The problem with this is that you need to create a new build anytime you want to give a new team member access to the app. Not only that but they will need to have their own device in developer mode in order to install it. Using TestFlight enables you to share your app with up to 10k without the need to rebuild each time you want to give someone access.

The one complication is that usually your TestFlight build is a production build of your app, this means you can't usually use this for a developer preview. However what you can do is create a separate app in App Center that is specifically used for preview builds and won't ever ship to the App Store.

The following guide will be written for expo because its simpler to get setup, but the same principles apply to other frameworks. The important part will be having a preview version of your app that you ship only internally.

## Get setup

If you don't already have an app, lets create one to get started with.

```bash
npx create-expo-app --template expo-template-storybook@next AwesomeStorybook
```

This will create a new expo app with storybook already setup.

```bash
cd AwesomeStorybook
```

## Configure eas

Next we'll want to configure eas and setup eas updates.

if you don't already have it then install the eas cli

```bash
npm install -g eas-cli
```

Then lets have it setup the project for us.

If you run each of these commands you'll end up with a project setup for eas builds and updates.

```bash
eas login
eas init
eas build:configure -p all
eas update:configure
```

You should now have an eas.json file in your project.

We're going to want to make a few tweaks to setup the preview builds I mentioned earlier.

Lets add a storybook build type and use the store distribution with auto increment. We'll set this up as a preview environment with a different bundle identifier and app name than your production app.

```json
{
  "build": {
    // other build types...

    // add storybook build type here
    "storybook": {
      "distribution": "store",
      "channel": "storybook",
      "autoIncrement": true,
      "ios": {
        "simulator": false
      },
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "storybook",
        "EXPO_PUBLIC_STORYBOOK_ENABLED": "true"
      }
    }
  },
  "submit": {
    // other submit types...

    // add storybook submit type here
    "storybook": {
      "ios": {
        "bundleIdentifier": "com.example.myapp-storybook",
        "appName": "My App Storybook"
      }
    }
  }
}
```

Make sure to replace `com.example.myapp-storybook` and `My App` with your own bundle identifier and app name.

Now lets add an `app.config.ts` file to use the environment variable to change the bundle identifier.
Note that when you have an app.json and app.config.ts file you can extend the app.json config since its passed to the config function.

```ts
// CREATE THIS FILE
// app.config.ts
import { type ExpoConfig, ConfigContext } from 'expo/config';

function getBundleIdentifier() {
  const isStorybook = process.env.EXPO_PUBLIC_ENVIRONMENT === 'storybook';

  if (isStorybook) {
    return 'com.example.myapp.storybook';
  }

  return 'com.example.myapp';
}

function config({ config }: ConfigContext): Partial<ExpoConfig> {
  return {
    // this is the config from app.json
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier: getBundleIdentifier(),
      infoPlist: {
        ...config.ios?.infoPlist,
        ITSAppUsesNonExemptEncryption: false,
      },
    },
  };
}

export default config;
```

```bash
eas build -p ios --submit --profile storybook
```

You will be asked to confirm a few things but you can usually just press enter to accept the defaults.

If all goes well you should get an email saying your app is ready to be installed through TestFlight.

From here just install the app and you should see storybook.
