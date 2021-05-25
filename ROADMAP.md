# Roadmap

React native storybook has been in a weird spot for a little while since it was inactive for some time whilst being halfway through a migration to the new repository (here).
I've spent some time trying to get a hold of where things are at and what the next steps should be.

Since the migration of this repository started the v6 of storybook came out and we've stayed behind in 5.3 due to the inactivity etc. The main goal for the near future is to make storybook stable for those using 5.3 and then prepare for a v6 release.

**This roapmap is still a work in progress**

## Bug fixes and quick wins

A few react native releases have come around this year and this broke a few things. Also there are some little ui bugs and things like this which we could fix quickly and these would be great to do now.

- fix bugs caused by react native upgrades - partially done
- fix warnings where possible - partially done
- upgrade examples to latest versions of react native and expo - ongoing
- improve documentation - in progress

## V6 of react native storybook

### features that we need to be v6

- Support for csf
- controls support
- more to be added here once I make a proper list

### Breaking changes that should be part of v6

- remove all deprecated components such as date time picker and use community versions or homegrown components.
- investigate possibility of using webviews for on device ui
  - This one deserves a bit of explanation: Basically the storybook core has a much more active development and in order to support all the addons and other features from the web the way it's currently being done we would need to rewrite every single component for react native and it's really not sustainable. If we can reuse parts of storybook for react we would be able to keep up with features much easier.
