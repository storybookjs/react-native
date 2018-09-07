@ndelangen
TODO:
- [x] FIX navigate by keyboard shortcut
- [x] FIX addon-storysource click navigate
- [x] FIX addon-links
- [x] FIX addon-actions

- [ ] INVESTIGATE if addon-storysource can use router directly over state method
- [ ] DISCUSS moving router into a separate package

- [ ] TEST other examples (vue with it's different `decorateStory`)

- [x] FIX HMR - stick with story in url
- [x] FIX HMR - HMR in ejected iframe
- [ ] FIX HMR - keep state of explorer

- [ ] FIX http://localhost:9011/?path=/components/Core-Errors-storyErrors (should error)
- [ ] FIX https://deploy-preview-4086--storybooks-official.netlify.com/?selectedKind=Addons%7Ca11y&selectedStory=Invalid%20contrast&full=0&addons=1&stories=1&panelRight=0&addonPanel=%40storybook%2Faddon-a11y%2Fpanel (should redirect correctly)

- [x] OPTIMIZE double selectStory event
- [ ] OPTIMIZE selectStory event at fullscreen switch
- [ ] unify SET_CURRENT_STORY & SELECT_STORY

- [ ] FIX eslint
- [ ] ADD unit tests

- [ ] REMOVE zoom level text & ADD reset button
- [ ] ADD UI to go fullscreen and toggle panels
- [ ] REMOVE grid-lines or move into addons / toggle

- [ ] ADD explorer hover over items
- [ ] ADD support for rootSeparators in explorer
- [ ] ADD auto-open of selection in explorer
- [ ] ADD explorer empty message
- [ ] TRY - when you click on a group, maybe select first renderable child
