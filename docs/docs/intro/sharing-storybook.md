---
sidebar_position: 5
---

# Sharing Storybook

Storybook is a great tool for sharing your components with your team. It's a great way to get feedback on your components and to make sure they're working as expected.

## Share on iOS via TestFlight

On iOS internal builds are often shared via ad hoc provisioning. The problem with this is that you need to create a new build anytime you want to give a new team member access to the app. Not only that but they will need to have their own device in developer mode in order to install it. Using TestFlight enables you to share your app with up to 10k without the need to rebuild each time you want to give someone access.

The one complication is that usually your TestFlight build is a production build of your app, this means you can't usually use this for a developer preview. However what you can do is create a separate app in App Center that is specifically used for preview builds and won't ever ship to the App Store.

The following guide will be written for expo because its simpler to get setup, but the same principles apply to other frameworks. The important part will be having a preview version of your app that you ship only internally.

### Get setup

If you don't already have an app, lets create one to get started with.

```bash
npx create-expo-app --template expo-template-storybook@next AwesomeStorybook
```

This will create a new expo app with storybook already setup.

```bash
cd AwesomeStorybook
```

### Configure eas

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

<img  height="400" alt="tfinvitesb" src="https://github.com/user-attachments/assets/aacd14aa-bf60-4f23-b78a-9418cc77407c" />

From here just install the app and you should see storybook.

https://github.com/user-attachments/assets/7d8d3970-8c46-4a74-822d-0abe35cfb98b

## Android

For android you can make either an internal testing build available on the play store or you can create an internal distribution with an apk buildType

```json
{
  "build": {
    // other build types...

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
    },
    // 👇 for internal sharing of apk builds
    "storybook-internal": {
      "extends": "storybook",
      "distribution": "internal",
      "android": { "buildType": "apk" }
    }
  }
}
```

Then update your `app.config.ts`

```tsx
function config({ config }: ConfigContext): Partial<ExpoConfig> {
  return {
    // this is the config from app.json
    ...config,
    // rest of the config...
    android: {
      ...config.android,
      package: getBundleIdentifier(),
    },
  };
}
```

Now to create an internal build run

```bash
eas build -p android --profile storybook-internal
```

When you open up the build in eas you’ll see a button to install that will give you a QR code and a link that you can use to download the apk directly.
<img width="1170" height="344" alt="sbandr" src="https://github.com/user-attachments/assets/cdc3a11b-2422-4378-be2b-1f9233283c4b" />

## Publishing on the Web

The React Native Storybook UI is compatible with React Native Web so if you are supporting the web with your components then you’ll be able to use `expo export` and `eas deploy` to deploy your stories on the web.

First build your app for web:

```tsx
 EXPO_PUBLIC_ENVIRONMENT=storybook bun expo export --platform web
```

Then deploy:

```tsx
eas deploy
```

Heres one I deployed earlier: https://sharestorybook--qclgxuc645.expo.app/
