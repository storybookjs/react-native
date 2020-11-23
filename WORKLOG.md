# migration notes

## things to do:

main.js compatibility, allow users to define entry points.
consider https://github.com/kentcdodds/preval.macro

check this later
addons/ondevice-backgrounds/src/index.tsx

# request for change

For 6.0 Making storybook ondevice only. Then 7.0 to add server funcionality maybe.

# 16/11/2020

fixed rerender infinite loop
renamed stories to story store
story id in state to cause sidebar rerender in sidebar and preview without using force rerender

## next time

consolidate the state of the list view and the story view into a single state component or maybe a hook. Hooks don't work, maybe we can fix that.

before next session danny to setup expo web, to make it easier to test changes quickly.

create issues for 6.0 to maybe get more people involved and create visibility also roadmap/project thing.

triconfig

# 23/11/2020

we did some stuff with preval and got something kind of working

we tried to figure how to do a custom resolver in metro config.
We should try and find what the default behaviour of resolveRequest is.

https://github.com/facebook/metro/blob/master/packages/metro-resolver/src/resolve.js
https://docs.expo.io/guides/customizing-metro/
https://github.com/expo/expo-cli/tree/master/packages/metro-config
https://github.com/facebook/metro/tree/master/packages/metro-resolver

look into doing a custom transformer

```
    transformer: {
        babelTransformerPath: require.resolve(
            'storybook-transformer'
        ),
    },
```

https://github.com/bamlab/react-native-graphql-transformer/blob/master/index.js
