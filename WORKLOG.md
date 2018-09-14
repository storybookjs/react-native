@ndelangen
TODO:
- [x] FIX navigate by keyboard shortcut
- [x] FIX addon-storysource click navigate
- [x] FIX addon-links
- [x] FIX addon-actions
- [ ] FIX when reloading page selected story should stay (this happens when there's a mismatch between hierarchySeparators)

- [ ] INVESTIGATE if addon-storysource can use router directly over state method
- [ ] DISCUSS moving router into a separate package

- [ ] TEST other examples (vue with it's different `decorateStory`)

- [x] FIX HMR - stick with story in url
- [x] FIX HMR - HMR in ejected iframe
- [ ] FIX HMR - keep state of explorer

- [x] FIX http://localhost:9011/?path=/components/Core-Errors-storyErrors (should error)
- [ ] FIX https://deploy-preview-4086--storybooks-official.netlify.com/?selectedKind=Addons%7Ca11y&selectedStory=Invalid%20contrast&full=0&addons=1&stories=1&panelRight=0&addonPanel=%40storybook%2Faddon-a11y%2Fpanel (should redirect correctly)

- [x] OPTIMIZE double selectStory event
- [x] OPTIMIZE selectStory event at fullscreen switch
- [ ] unify SET_CURRENT_STORY & SELECT_STORY

- [x] FIX eslint
- [ ] ADD unit tests

- [x] REMOVE zoom level text & ADD reset button
- [x] REMOVE grid-lines or move into addons / toggle
- [x] FIX refresh when toggle panel or nav
- [ ] FIX main is weird when entry page is settings after switching to components
- [x] FIX delay in resizing panels because of transition

- [ ] ADD postMessage to ejected iframe

- [x] REMOVE toNested
- [ ] ADD explorer hover over items
- [ ] ADD support for rootSeparators in explorer
- [ ] ADD auto-open of selection in explorer
- [ ] ADD explorer empty message
- [ ] ADD highlighting of the search results
- [ ] TRY - when you click on a group, maybe select first renderable child - in an option?

- [ ] ADD fetching of data for version notification
- [ ] ADD storage of version info in localStorage

Dom's changes
- [x] ADD tools/hotkeys button
- [x] ADD UI to go fullscreen and toggle panels
- [ ] CHANGE styles of explorer
- [ ] CHANGE styles of notifications
- [x] CHANGE styles of main (preview+panel)
- [ ] CHANGE toolbar
- [ ] ADD shortcut for toggle toolbar
- [ ] ADD shortcut for zoom
- [ ] ADD shortcut for toggle grid
- [ ] ADD tools to TabsBar
