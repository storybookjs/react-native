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

```bash
eas build:configure -p all
```

You might find that you are asked to manually edit the app.config.ts file since we're using dynamic config.

Add copy the config it gives you to the app.config.ts file.

```ts
const config: ExpoConfig = {
  name: "ExpoRouterStorybook",
  slug: "ExpoRouterStorybook",
  // ...
  // add this 👇
  extra: {
    eas: {
      // replace this with the project id in your terminal
      projectId: "111a11a1-1111-1111-1111-111111111111",
    },
  },
```

Now re-run the command to configure eas.

```bash
eas build:configure -p all
```

You should now have an eas.json file in your project.

We're going to want to make a few tweaks to setup the preview builds I mentioned earlier.

First lets make the preview build channel use the store distribution and auto increment.

```json
{
  "build": {
    "preview": {
      "distribution": "store",
      "autoIncrement": true
    }
  }
}
```

Then we want to define a environment variable that will be used to determine if we're in a preview build or not.

```json
{
  "build": {
    "preview": {
      "distribution": "store",
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "preview"
      }
    }
  }
}
```

We'll also want to add the environment variable to the production build but set it to production.

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "production"
      }
    }
  }
}
```

Then lets update the submit section to use different bundle identifiers and app names for the preview and production builds.
Make sure to replace the bundle identifier and app name with your own.

```json
{
  "submit": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.example.myapp"
      },
      "appName": "My App"
    },
    "preview": {
      "ios": {
        "bundleIdentifier": "com.example.myapp-preview",
        "appName": "My App Preview"
      }
    }
  }
}
```

Heres the full eas.json file with all the changes.

```json
{
  "cli": {
    "version": ">= 16.17.4",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "channel": "development",
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "development"
      }
    },
    "preview": {
      "distribution": "store",
      "channel": "preview",
      "autoIncrement": true,
      "ios": {
        "simulator": false
      },
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "preview"
      }
    },
    "production": {
      "autoIncrement": true,
      "channel": "production",
      "env": {
        "EXPO_PUBLIC_ENVIRONMENT": "production"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "bundleIdentifier": "com.example.myapp",
        "appName": "My App"
      }
    },
    "preview": {
      "ios": {
        "bundleIdentifier": "com.example.myapp-preview",
        "appName": "My App Preview"
      }
    }
  }
}
```

Make sure not to forget to replace "com.example.myapp" and "My App" with your own bundle identifier and app name.

Now lets update the app.config.ts file to use the environment variable too.

```ts
// app.config.ts

const BUNDLE_MAPPING = {
  development: 'com.dannyhw.blogexample-development',
  preview: 'com.dannyhw.blogexample-preview',
  production: 'com.dannyhw.blogexample',
};

const environment = process.env.EXPO_PUBLIC_ENVIRONMENT as keyof typeof BUNDLE_MAPPING;

if ((!environment || !BUNDLE_MAPPING[environment]) && process.env.NODE_ENV === 'production') {
  throw new Error(`EXPO_PUBLIC_ENVIRONMENT is not set`);
}

const bundleId = BUNDLE_MAPPING[environment ?? 'development'];

const config: ExpoConfig = {
  // ...
  ios: {
    // add this 👇
    bundleIdentifier: bundleId,
  },
};
```

Next thing we should do is setup eas updates so we can easily update the app without needing to make a new build everytime.

```bash
eas update:configure
```

Again if you're asked to manually edit app.config.ts then follow the instructions and run again.

```ts
// app.config.ts

const config: ExpoConfig = {
  // ...
  // add these 👇
  updates: {
    // replace this with the url in your terminal
    url: 'https://u.expo.dev/111a11a1-1111-1111-1111-111111111111',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
};
```

Now that we're setup for eas updates and we've configured eas build lets do our first build and submit it app center.

```bash
EXPO_PUBLIC_ENVIRONMENT=preview eas build -p ios --submit --profile preview
```

You will be asked to confirm a few things but you can usually just press enter to accept the defaults.

If all goes well you should get an email saying your app is ready to be installed through TestFlight.

From here just install the app and you should see storybook.
