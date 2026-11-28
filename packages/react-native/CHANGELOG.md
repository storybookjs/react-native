# @storybook/react-native

## 11.0.0-next.4

### Patch Changes

- [#989](https://github.com/storybookjs/react-native/pull/989) [`edb58a3`](https://github.com/storybookjs/react-native/commit/edb58a33565ca9355f41507a180abdb4e6a399a4) Thanks [@dannyhw](https://github.com/dannyhw)! - Storybook no longer fails to start with "Property 'FinalizationRegistry' doesn't exist" on React Native versions before 0.88 (for example Expo SDK 57). The generated `storybook.requires` file now imports `@storybook/react-native/polyfills` first, which adds a no-op `FinalizationRegistry` when Hermes has none. Restart Metro after updating so the file is regenerated.

- Updated dependencies []:
  - @storybook/react-native-ui@11.0.0-next.4
  - @storybook/react-native-ui-common@11.0.0-next.4
  - @storybook/react-native-theming@11.0.0-next.4

## 11.0.0-next.3

### Patch Changes

- [#988](https://github.com/storybookjs/react-native/pull/988) [`c8f2bad`](https://github.com/storybookjs/react-native/commit/c8f2bad21a08f0f0be07f7bc3a4d0ba7c39611a2) Thanks [@dannyhw](https://github.com/dannyhw)! - Index CSF factories story files that have no default export, the shape Storybook's `csf-factories` codemod produces. The on-device index now reads the meta from a file's factory stories, like Storybook does, instead of skipping every file without `export default meta`, which left the index empty and failed with `EmptyIndexError`. Its title, `includeStories`, `excludeStories` and `tags` are read from the meta's input, so metas from a preview not made with this package's `definePreview` work too. In a CSF factories file only factory stories are indexed.

- [#983](https://github.com/storybookjs/react-native/pull/983) [`29747b4`](https://github.com/storybookjs/react-native/commit/29747b4b317d01915228aebb2e0c0222eb98fb14) Thanks [@dannyhw](https://github.com/dannyhw)! - Update `@storybook/react` and `@storybook/mcp` to 11.0.0-rc.0, and `@tmcp/transport-http` to 0.9.1 to match `@storybook/mcp`.

- [#985](https://github.com/storybookjs/react-native/pull/985) [`a12e43d`](https://github.com/storybookjs/react-native/commit/a12e43d4581405dcdc383adb072492c48e0e6b29) Thanks [@dannyhw](https://github.com/dannyhw)! - Update `@storybook/react` and `@storybook/mcp` to 11.0.0-rc.1.

- Updated dependencies [[`5999fa5`](https://github.com/storybookjs/react-native/commit/5999fa5158671bfcc38efee0561f3739f366c5a1)]:
  - @storybook/react-native-ui@11.0.0-next.3
  - @storybook/react-native-ui-common@11.0.0-next.3
  - @storybook/react-native-theming@11.0.0-next.3

## 11.0.0-next.2

### Minor Changes

- [#969](https://github.com/storybookjs/react-native/pull/969) [`8d58643`](https://github.com/storybookjs/react-native/commit/8d586430a9671a3d9c0ea7878e7c770ab9a99929) Thanks [@officialasishkumar](https://github.com/officialasishkumar)! - Stories now get their tags in the story index, combined from the project, meta and story `tags` the same way Storybook does for the web, instead of a fixed `['story']`. Stories without the `dev` tag (for example `tags: ['!dev']`) are hidden from the on-device sidebar and are not opened by default, but can still be selected by id. The index served by the channel server includes the same tags.

### Patch Changes

- [#971](https://github.com/storybookjs/react-native/pull/971) [`87b1d83`](https://github.com/storybookjs/react-native/commit/87b1d83fccee5082122e69a72f6076164e6f28d0) Thanks [@dannyhw](https://github.com/dannyhw)! - Update dependencies: `tmcp` 1.20, `@tmcp/adapter-valibot` 0.1.7, `valibot` 1.5, `ws` 8.22 and `glob` 14.0.5 in `@storybook/react-native`, `es-toolkit` 1.53 in `@storybook/react-native-ui-common`, and `@legendapp/list` 3.7.2 in `@storybook/react-native-ui-lite`.

- [#945](https://github.com/storybookjs/react-native/pull/945) [`ab54070`](https://github.com/storybookjs/react-native/commit/ab5407069996c0394da1267f0c2f74c2faeb7b1b) Thanks [@dannyhw](https://github.com/dannyhw)! - Generated `storybook.requires` no longer crashes on startup when `features` is set in `main`. Feature flags are now merged into `globalThis.FEATURES` instead of written onto it, so the file no longer throws `TypeError: Cannot set property 'ondeviceBackgrounds' of undefined` when Metro's `inlineRequires` evaluates it before Storybook has created that object.

- [#966](https://github.com/storybookjs/react-native/pull/966) [`5e9cd39`](https://github.com/storybookjs/react-native/commit/5e9cd397e3f7cbc16feaa65b95ea2d8c4918ccba) Thanks [@dannyhw](https://github.com/dannyhw)! - Storybook 11.0.0-beta.1 guards its `window.addEventListener` call for landmark navigation itself, so the `setupListeners` workaround is removed and the minimum `storybook` version is now 11.0.0-beta.1.

  `@storybook/mcp` is updated to 11.0.0-beta.1, and the `select-story` MCP tool now points agents to `docs-list` instead of the old `list-all-documentation` tool name.

- [#939](https://github.com/storybookjs/react-native/pull/939) [`6affb3e`](https://github.com/storybookjs/react-native/commit/6affb3e6bd855bf594685e495139ce059166389b) Thanks [@dannyhw](https://github.com/dannyhw)! - Support Storybook 11.0.0-alpha.7, which removed deprecated type aliases such as `StoriesHash` and `StoryContextForLoaders`. The sidebar now throws on story index versions below v3, matching core.

- [#958](https://github.com/storybookjs/react-native/pull/958) [`490a3f0`](https://github.com/storybookjs/react-native/commit/490a3f07cf1f27dca3c4d517749b2fff1a7abf1e) Thanks [@dannyhw](https://github.com/dannyhw)! - Support Storybook 11.0.0-beta.0. Its preview now calls `window.addEventListener` while setting up listeners, which React Native doesn't provide, so `start()` threw `globalWindow.addEventListener is not a function`.

- [#970](https://github.com/storybookjs/react-native/pull/970) [`9e8f511`](https://github.com/storybookjs/react-native/commit/9e8f511f21efae6231a64f8a5a0815523e365170) Thanks [@dannyhw](https://github.com/dannyhw)! - Update `@storybook/react` and `@storybook/mcp` to 11.0.0-beta.2.

- [#974](https://github.com/storybookjs/react-native/pull/974) [`79a2fc1`](https://github.com/storybookjs/react-native/commit/79a2fc144dcb76f4cb0d99c6251a42b61c0a341a) Thanks [@dannyhw](https://github.com/dannyhw)! - Update `@storybook/react` and `@storybook/mcp` to 11.0.0-beta.3.

- [#953](https://github.com/storybookjs/react-native/pull/953) [`50d5180`](https://github.com/storybookjs/react-native/commit/50d5180886c458ca527451d3a993e5b999ea3c05) Thanks [@jeltehomminga](https://github.com/jeltehomminga)! - Allow `react-native-url-polyfill` v4. The dependency range is now `^3.0.0 || ^4.0.0`, so an app that uses v4 no longer gets a second, nested v3 copy for Storybook.

- Updated dependencies [[`87b1d83`](https://github.com/storybookjs/react-native/commit/87b1d83fccee5082122e69a72f6076164e6f28d0), [`503529a`](https://github.com/storybookjs/react-native/commit/503529a26f63c43a01d5d9a5ef2a3817f6c04ef7), [`d96e62f`](https://github.com/storybookjs/react-native/commit/d96e62fe83a3e0abf323cf23d2d6c26fedf15bd8), [`cbeb0c2`](https://github.com/storybookjs/react-native/commit/cbeb0c2c9227116775e89bbe14183761e674e75a), [`894a300`](https://github.com/storybookjs/react-native/commit/894a300bb0da4356b1332c2b638a42abf10f4254), [`490a3f0`](https://github.com/storybookjs/react-native/commit/490a3f07cf1f27dca3c4d517749b2fff1a7abf1e), [`97caee2`](https://github.com/storybookjs/react-native/commit/97caee29205765c7d2df61926b48b2849dac8f12), [`da0e7cf`](https://github.com/storybookjs/react-native/commit/da0e7cf8dd4db6faf6c78c520b2c0b7017b57adc)]:
  - @storybook/react-native-ui-common@11.0.0-next.2
  - @storybook/react-native-ui@11.0.0-next.2
  - @storybook/react-native-theming@11.0.0-next.2

## 11.0.0-next.1

### Major Changes

- [#932](https://github.com/storybookjs/react-native/pull/932) [`ae7bf63`](https://github.com/storybookjs/react-native/commit/ae7bf6380244d1bc348283815a19892bcf4f3e2c) Thanks [@ndelangen](https://github.com/ndelangen)! - `.rnstorybook` main configs no longer load addons from `addons`. List them in `deviceAddons`. The Storybook CLI automigration `rn-ondevice-addons-to-device-addons` renames the field when `deviceAddons` is not already set. `definePreview({ addons })` is unchanged.

### Patch Changes

- [#931](https://github.com/storybookjs/react-native/pull/931) [`daf48e2`](https://github.com/storybookjs/react-native/commit/daf48e203854b00385d37c2c11f5db9f6ce64fa6) Thanks [@dannyhw](https://github.com/dannyhw)! - Storybook React Native now requires Storybook 11. Update `storybook`, `@storybook/react` and the other Storybook packages to 11.x.

  Story sorting moves to `storySorts` in `.rnstorybook/main.ts`, following Storybook 11. Each sorter only orders the stories that the sorters before it consider equal. `parameters.options.storySort` in preview is no longer read; run `npx storybook automigrate story-sort-to-main --config-dir .rnstorybook` to move it. See the migration guide for details.

- Updated dependencies []:
  - @storybook/react-native-ui@11.0.0-next.1
  - @storybook/react-native-ui-common@11.0.0-next.1
  - @storybook/react-native-theming@11.0.0-next.1

## 11.0.0-next.0

### Major Changes

- [#919](https://github.com/storybookjs/react-native/pull/919) [`01d4ec2`](https://github.com/storybookjs/react-native/commit/01d4ec2877ede9d0ea5db5b01ae217bb3da0bfa3) Thanks [@kasperpeulen](https://github.com/kasperpeulen)! - feat: adds csf next support

### Patch Changes

- [#919](https://github.com/storybookjs/react-native/pull/919) [`01d4ec2`](https://github.com/storybookjs/react-native/commit/01d4ec2877ede9d0ea5db5b01ae217bb3da0bfa3) Thanks [@kasperpeulen](https://github.com/kasperpeulen)! - Metro and Repack now rewrite `#.storybook/preview` to `{configPath}/preview` so CSF Next stories can use the documented specifier on native.

- Updated dependencies []:
  - @storybook/react-native-ui@11.0.0-next.0
  - @storybook/react-native-ui-common@11.0.0-next.0
  - @storybook/react-native-theming@11.0.0-next.0

## 10.6.2

### Patch Changes

- [#930](https://github.com/storybookjs/react-native/pull/930) [`2456fa6`](https://github.com/storybookjs/react-native/commit/2456fa6809e8c94b3d5a61426b9c42d49db60a48) Thanks [@dannyhw](https://github.com/dannyhw)! - Restore the `react-native-reanimated` and `react-native-safe-area-context` peer dependency ranges that were accidentally pinned to the monorepo's exact versions (`4.5.1` and `5.8.0`). `@storybook/react-native` now requires `react-native-reanimated@>=3`, matching `@storybook/react-native-ui`.

- Updated dependencies [[`2456fa6`](https://github.com/storybookjs/react-native/commit/2456fa6809e8c94b3d5a61426b9c42d49db60a48)]:
  - @storybook/react-native-ui@10.6.2
  - @storybook/react-native-ui-common@10.6.2
  - @storybook/react-native-theming@10.6.2

## 10.6.1

### Patch Changes

- [#929](https://github.com/storybookjs/react-native/pull/929) [`beecf7c`](https://github.com/storybookjs/react-native/commit/beecf7c098a232b9e12702a1197064bb54beb7a7) Thanks [@dannyhw](https://github.com/dannyhw)! - Fix on-device Controls breaking after Fast Refresh with "cannot render when canvasElement is unset". Story renders now run one at a time, so overlapping Fast Refresh updates, story selection or remote control no longer leave a stale render behind.

- Updated dependencies []:
  - @storybook/react-native-ui@10.6.1
  - @storybook/react-native-ui-common@10.6.1
  - @storybook/react-native-theming@10.6.1

## 10.6.0

### Minor Changes

- [#922](https://github.com/storybookjs/react-native/pull/922) [`93574f3`](https://github.com/storybookjs/react-native/commit/93574f3bb745a423170b7b6e5a1be7cb7f6137a0) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

### Patch Changes

- [#921](https://github.com/storybookjs/react-native/pull/921) [`b726795`](https://github.com/storybookjs/react-native/commit/b7267955afc75a569f167f9d73eb150f7e717dfe) Thanks [@dannyhw](https://github.com/dannyhw)! - Update `@storybook/mcp` to ^10.6.0 so the MCP server no longer pins a vulnerable `valibot` release (GHSA-5qjj-4xww-7phc), and refresh transitive dependencies to patched versions.

- Updated dependencies [[`93574f3`](https://github.com/storybookjs/react-native/commit/93574f3bb745a423170b7b6e5a1be7cb7f6137a0)]:
  - @storybook/react-native-ui-common@10.6.0
  - @storybook/react-native-ui@10.6.0
  - @storybook/react-native-theming@10.6.0

## 10.5.4

### Patch Changes

- [#915](https://github.com/storybookjs/react-native/pull/915) [`612b47a`](https://github.com/storybookjs/react-native/commit/612b47a1014e4c07e65cecb2b9a78cb685b6fa39) Thanks [@ndelangen](https://github.com/ndelangen)! - Require storybook ^10.5.4 so RN picks up core telemetry framework inference

- Updated dependencies [[`612b47a`](https://github.com/storybookjs/react-native/commit/612b47a1014e4c07e65cecb2b9a78cb685b6fa39)]:
  - @storybook/react-native-ui-common@10.5.4
  - @storybook/react-native-ui@10.5.4
  - @storybook/react-native-theming@10.5.4

## 10.5.3

### Patch Changes

- [#913](https://github.com/storybookjs/react-native/pull/913) [`38ce5e6`](https://github.com/storybookjs/react-native/commit/38ce5e6d02fb09cfd365335b7c102241b8cf34d6) Thanks [@ndelangen](https://github.com/ndelangen)! - Require storybook ^10.5.4 so RN picks up core telemetry framework inference

- Updated dependencies [[`38ce5e6`](https://github.com/storybookjs/react-native/commit/38ce5e6d02fb09cfd365335b7c102241b8cf34d6)]:
  - @storybook/react-native-ui-common@10.5.3
  - @storybook/react-native-ui@10.5.3
  - @storybook/react-native-theming@10.5.3

## 10.5.2

### Patch Changes

- [#911](https://github.com/storybookjs/react-native/pull/911) [`c0da377`](https://github.com/storybookjs/react-native/commit/c0da37774a1318c152daa8f4b159d79e64c2f565) Thanks [@dannyhw](https://github.com/dannyhw)! - address npm audit issues

- [#910](https://github.com/storybookjs/react-native/pull/910) [`2e0f148`](https://github.com/storybookjs/react-native/commit/2e0f148ecfa3a346965129f156dcdb1575d3f1fd) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook deps

- Updated dependencies [[`c0da377`](https://github.com/storybookjs/react-native/commit/c0da37774a1318c152daa8f4b159d79e64c2f565), [`2e0f148`](https://github.com/storybookjs/react-native/commit/2e0f148ecfa3a346965129f156dcdb1575d3f1fd)]:
  - @storybook/react-native-theming@10.5.2
  - @storybook/react-native-ui@10.5.2
  - @storybook/react-native-ui-common@10.5.2

## 10.5.1

### Patch Changes

- [#907](https://github.com/storybookjs/react-native/pull/907) [`e74641b`](https://github.com/storybookjs/react-native/commit/e74641b6f35c5005a348b1fd1f982e76ed47f04b) Thanks [@yatishgoel](https://github.com/yatishgoel)! - Telemetry: actually send the `dev` event and report framework metadata

  React Native runs through Metro/Re.Pack rather than the Storybook core-server, so two things were missing from the `dev` telemetry event:

  - The telemetry module's enabled state was never resolved (that normally happens in the core-server), so the event was queued and never sent. `withStorybook` now calls `setTelemetryEnabled(true)` when telemetry is enabled, flushing the event.
  - The event was sent without a `configDir`, so `getStorybookMetadata` defaulted to `.storybook` and could not read React Native's `.rnstorybook` config, leaving `metadata.framework` empty. The resolved config path is now passed through.

  Applied to the Metro, Re.Pack, and shared `withStorybook` entry points.

- Updated dependencies []:
  - @storybook/react-native-ui@10.5.1
  - @storybook/react-native-ui-common@10.5.1
  - @storybook/react-native-theming@10.5.1

## 10.5.0

### Minor Changes

- [`40f25fa`](https://github.com/storybookjs/react-native/commit/40f25fad669a5034b119e07669e7287c9f51c9bc) Thanks [@dannyhw](https://github.com/dannyhw)! - update deps for compatibility with 10.5 and for audit fixes

### Patch Changes

- [#903](https://github.com/storybookjs/react-native/pull/903) [`44e3413`](https://github.com/storybookjs/react-native/commit/44e34137552a211c9c15570330c42480f2c5abfb) Thanks [@ndelangen](https://github.com/ndelangen)! - Fix docgen-based auto argTypes (controls) that were silently disabled. `preview.ts` imported `argTypesEnhancers` and `parameters.docs.extractArgTypes` from `@storybook/react/entry-preview-docs`, which does not export them, so both resolved to `undefined`. They are now imported from `@storybook/react/entry-preview-argtypes`, restoring auto-generated controls from component `__docgenInfo`.

- Updated dependencies [[`40f25fa`](https://github.com/storybookjs/react-native/commit/40f25fad669a5034b119e07669e7287c9f51c9bc)]:
  - @storybook/react-native-theming@10.5.0
  - @storybook/react-native-ui@10.5.0
  - @storybook/react-native-ui-common@10.5.0

## 10.4.7

### Patch Changes

- [#894](https://github.com/storybookjs/react-native/pull/894) [`f1371a3`](https://github.com/storybookjs/react-native/commit/f1371a3fca389b500af9363bd90a9972e55a59e2) Thanks [@ndelangen](https://github.com/ndelangen)! - respect STORYBOOK_SERVER env variable in legacy metro and repack withStorybook wrappers

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.7
  - @storybook/react-native-ui-common@10.4.7
  - @storybook/react-native-theming@10.4.7

## 10.4.6

### Patch Changes

- [#900](https://github.com/storybookjs/react-native/pull/900) [`494c1b7`](https://github.com/storybookjs/react-native/commit/494c1b715194a71df18ac7d3f8fe08501b436cba) Thanks [@dannyhw](https://github.com/dannyhw)! - bump dependencies

- Updated dependencies [[`494c1b7`](https://github.com/storybookjs/react-native/commit/494c1b715194a71df18ac7d3f8fe08501b436cba)]:
  - @storybook/react-native-ui-common@10.4.6
  - @storybook/react-native-theming@10.4.6
  - @storybook/react-native-ui@10.4.6

## 10.4.5

### Patch Changes

- [#893](https://github.com/storybookjs/react-native/pull/893) [`cd00a0c`](https://github.com/storybookjs/react-native/commit/cd00a0cba7adf733a05f90db6c99a948d19088e7) Thanks [@ndelangen](https://github.com/ndelangen)! - Add Storybook telemetry when on-device Storybook is enabled, with opt-out via `STORYBOOK_DISABLE_TELEMETRY`. Telemetry runs from the unified `withStorybook` wrapper and the Re.Pack plugin.

- [#892](https://github.com/storybookjs/react-native/pull/892) [`18af09e`](https://github.com/storybookjs/react-native/commit/18af09e609e97c1609b48dda19400938db32c8f8) Thanks [@Arunsiva003](https://github.com/Arunsiva003)! - Align the React Native Page story template with the other CLI example stories.

- [#896](https://github.com/storybookjs/react-native/pull/896) [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b) Thanks [@dannyhw](https://github.com/dannyhw)! - fix being broken by incompatible legend list versions by bundling it in

- [#896](https://github.com/storybookjs/react-native/pull/896) [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b) Thanks [@dannyhw](https://github.com/dannyhw)! - bump package versions

- [#895](https://github.com/storybookjs/react-native/pull/895) [`ce3eb7b`](https://github.com/storybookjs/react-native/commit/ce3eb7b494aacb40dd2fcd9f473a7ccb16302e4d) Thanks [@saseungmin](https://github.com/saseungmin)! - Mark the generated Storybook `View` import as type-only for TypeScript `verbatimModuleSyntax` compatibility.

- Updated dependencies [[`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b), [`092e9f0`](https://github.com/storybookjs/react-native/commit/092e9f09096d5000543ddda5a9acd34ebbadfa07), [`922c104`](https://github.com/storybookjs/react-native/commit/922c104819152d0af56224ad8daa8dba6ad7f66b)]:
  - @storybook/react-native-ui-common@10.4.5
  - @storybook/react-native-ui@10.4.5
  - @storybook/react-native-theming@10.4.5

## 10.4.4

### Patch Changes

- [#891](https://github.com/storybookjs/react-native/pull/891) [`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fixes for color control

- Updated dependencies [[`e785fc5`](https://github.com/storybookjs/react-native/commit/e785fc528a68163d49a8662fcaab27a8753b9521)]:
  - @storybook/react-native-ui-common@10.4.4
  - @storybook/react-native-ui@10.4.4
  - @storybook/react-native-theming@10.4.4

## 10.4.3

### Patch Changes

- [#890](https://github.com/storybookjs/react-native/pull/890) [`511bca0`](https://github.com/storybookjs/react-native/commit/511bca0fdd6aaa2018f4f265cef6d91836a3d5cb) Thanks [@ndelangen](https://github.com/ndelangen)! - auto-detect websocket enabling

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.3
  - @storybook/react-native-ui-common@10.4.3
  - @storybook/react-native-theming@10.4.3

## 10.4.2

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.2
  - @storybook/react-native-ui-common@10.4.2
  - @storybook/react-native-theming@10.4.2

## 10.4.2-next.0

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.2-next.0
  - @storybook/react-native-ui-common@10.4.2-next.0
  - @storybook/react-native-theming@10.4.2-next.0

## 10.4.1

### Patch Changes

- [#886](https://github.com/storybookjs/react-native/pull/886) [`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0) Thanks [@dannyhw](https://github.com/dannyhw)! - apply npm audit fixes

- [#883](https://github.com/storybookjs/react-native/pull/883) [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90) Thanks [@dannyhw](https://github.com/dannyhw)! - liteui animation changes and select control adjustments

- Updated dependencies [[`1efd1ce`](https://github.com/storybookjs/react-native/commit/1efd1ced9b3723f67e6fce6b0b1bdec6808fd3e0), [`5e10b7f`](https://github.com/storybookjs/react-native/commit/5e10b7f4240e9b23f63e27ef12412c0b0df9bc90)]:
  - @storybook/react-native-theming@10.4.1
  - @storybook/react-native-ui@10.4.1
  - @storybook/react-native-ui-common@10.4.1

## 10.4.0

### Minor Changes

- [#871](https://github.com/storybookjs/react-native/pull/871) [`08f59a6`](https://github.com/storybookjs/react-native/commit/08f59a620b8a8d3d20fe8d57c2317bc529c0f22b) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add `deviceAddons` property to `StorybookConfig` for separating on-device addons from core addons. On-device addons listed in `deviceAddons` are only consumed at runtime by the code generator, not evaluated as presets by Storybook Core. This prevents `extract` failures caused by loading React Native code in a Node.js context. Backwards compatible: addons in the `addons` field continue to work.

- [#871](https://github.com/storybookjs/react-native/pull/871) [`08f59a6`](https://github.com/storybookjs/react-native/commit/08f59a620b8a8d3d20fe8d57c2317bc529c0f22b) Thanks [@copilot-swe-agent](https://github.com/apps/copilot-swe-agent)! - Add unified bundler-agnostic withStorybook wrapper at @storybook/react-native/withStorybook

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.4.0
  - @storybook/react-native-ui-common@10.4.0
  - @storybook/react-native-theming@10.4.0

## 10.3.2

### Patch Changes

- [#876](https://github.com/storybookjs/react-native/pull/876) [`95d4211`](https://github.com/storybookjs/react-native/commit/95d4211abc85244c64af63ec8e1381a036a5025c) Thanks [@Nezz](https://github.com/Nezz)! - fix os/tty removed in server of expo router

- [#875](https://github.com/storybookjs/react-native/pull/875) [`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook versions

- Updated dependencies [[`609c1fe`](https://github.com/storybookjs/react-native/commit/609c1fe3996be28184054d9413f2404400d77e52), [`b3e2164`](https://github.com/storybookjs/react-native/commit/b3e2164f33988b7b1cb7046eeb46cce79f2273e1)]:
  - @storybook/react-native-ui-common@10.3.2
  - @storybook/react-native-ui@10.3.2
  - @storybook/react-native-theming@10.3.2

## 10.3.1

### Patch Changes

- [#870](https://github.com/storybookjs/react-native/pull/870) [`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2) Thanks [@dannyhw](https://github.com/dannyhw)! - update storybook dependencies and fix mcp tool name change

- Updated dependencies [[`7456b7f`](https://github.com/storybookjs/react-native/commit/7456b7fb858a13df814289a39bd4a7fa4a5e31c2)]:
  - @storybook/react-native-ui-common@10.3.1
  - @storybook/react-native-ui@10.3.1
  - @storybook/react-native-theming@10.3.1

## 10.3.0

### Minor Changes

- [#848](https://github.com/storybookjs/react-native/pull/848) [`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add backgrounds addon behind `features.ondeviceBackgrounds` flag

  When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.

  ### Usage

  **1. Enable the feature in `.storybook/main.ts`:**

  ```ts
  import type { StorybookConfig } from '@storybook/react-native';

  const main: StorybookConfig = {
    stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
    features: {
      ondeviceBackgrounds: true,
    },
  };

  export default main;
  ```

  **2. Configure background options in `.storybook/preview.tsx`:**

  ```tsx
  import type { Preview } from '@storybook/react-native';

  const preview: Preview = {
    parameters: {
      backgrounds: {
        options: {
          light: { name: 'Light', value: '#ffffff' },
          dark: {
            name: 'Dark',
            value: '[#333333](https://github.com/storybookjs/react-native/issues/333333)',
          },
          app: { name: 'App', value: '#eeeeee' },
        },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'light' },
    },
  };

  export default preview;
  ```

  **3. Optionally override at the story level:**

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react-native';

  const meta: Meta<typeof MyComponent> = {
    component: MyComponent,
    globals: {
      // Lock background for all stories in this file
      backgrounds: { value: 'dark' },
    },
  };

  export default meta;
  ```

### Patch Changes

- [#863](https://github.com/storybookjs/react-native/pull/863) [`47e0d9d`](https://github.com/storybookjs/react-native/commit/47e0d9d2eaddba52619b9581a8993bcd0ea4cd3f) Thanks [@dannyhw](https://github.com/dannyhw)! - fix types for metro require

- [#832](https://github.com/storybookjs/react-native/pull/832) [`d2f2d99`](https://github.com/storybookjs/react-native/commit/d2f2d9994f98c29c07bf1fe0108134c3bec094f9) Thanks [@YevheniiKotyrlo](https://github.com/YevheniiKotyrlo)! - fix: replace @ts-ignore with Metro-specific type definitions

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- [#849](https://github.com/storybookjs/react-native/pull/849) [`c0b14e8`](https://github.com/storybookjs/react-native/commit/c0b14e842f17a3e8d56501e08f59a771431946de) Thanks [@dannyhw](https://github.com/dannyhw)! - adds an mcp option to withStorybook that enables an mcp endpoint in the channel server

- [#860](https://github.com/storybookjs/react-native/pull/860) [`794f4f0`](https://github.com/storybookjs/react-native/commit/794f4f03c6c5e77752ae1838901e620b8f0f21a3) Thanks [@dannyhw](https://github.com/dannyhw)! - Added a new channel server endpoint: `POST /select-story-sync/:storyId`

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: snapshot RN synthetic events and prevent channel echo

- [#861](https://github.com/storybookjs/react-native/pull/861) [`74c26e2`](https://github.com/storybookjs/react-native/commit/74c26e23c470e044c50c86a6259afbf5a8d8aad9) Thanks [@dannyhw](https://github.com/dannyhw)! - add secure option for wss/https on the channel server

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - fix invalid reanimated globals breaking actions on web

- Updated dependencies [[`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0), [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91), [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3), [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui-common@10.3.0
  - @storybook/react-native-ui@10.3.0
  - @storybook/react-native-theming@10.3.0

## 10.3.0-next.6

### Patch Changes

- [#863](https://github.com/storybookjs/react-native/pull/863) [`47e0d9d`](https://github.com/storybookjs/react-native/commit/47e0d9d2eaddba52619b9581a8993bcd0ea4cd3f) Thanks [@dannyhw](https://github.com/dannyhw)! - fix types for metro require

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.6
  - @storybook/react-native-ui-common@10.3.0-next.6
  - @storybook/react-native-theming@10.3.0-next.6

## 10.3.0-next.5

### Patch Changes

- [#860](https://github.com/storybookjs/react-native/pull/860) [`794f4f0`](https://github.com/storybookjs/react-native/commit/794f4f03c6c5e77752ae1838901e620b8f0f21a3) Thanks [@dannyhw](https://github.com/dannyhw)! - Added a new channel server endpoint: `POST /select-story-sync/:storyId`

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.5
  - @storybook/react-native-ui-common@10.3.0-next.5
  - @storybook/react-native-theming@10.3.0-next.5

## 10.3.0-next.4

### Patch Changes

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.4
  - @storybook/react-native-ui-common@10.3.0-next.4
  - @storybook/react-native-theming@10.3.0-next.4

## 10.3.0-next.3

### Patch Changes

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: addon panels only update when active

- [#857](https://github.com/storybookjs/react-native/pull/857) [`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: snapshot RN synthetic events and prevent channel echo

- [#855](https://github.com/storybookjs/react-native/pull/855) [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a) Thanks [@dannyhw](https://github.com/dannyhw)! - fix invalid reanimated globals breaking actions on web

- Updated dependencies [[`32b4cee`](https://github.com/storybookjs/react-native/commit/32b4cee543b92128fd52b996eba66a48fbcdd3e3), [`6b85c99`](https://github.com/storybookjs/react-native/commit/6b85c9934532ade16f854b07084566d08693965a)]:
  - @storybook/react-native-ui@10.3.0-next.3
  - @storybook/react-native-ui-common@10.3.0-next.3
  - @storybook/react-native-theming@10.3.0-next.3

## 10.3.0-next.2

### Patch Changes

- [#851](https://github.com/storybookjs/react-native/pull/851) [`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91) Thanks [@andre-krueger](https://github.com/andre-krueger)! - fix: png included in npm publish

- Updated dependencies [[`f74c577`](https://github.com/storybookjs/react-native/commit/f74c577ff040c5039024ab9c5fc63fae0eec0a91)]:
  - @storybook/react-native-ui-common@10.3.0-next.2
  - @storybook/react-native-ui@10.3.0-next.2
  - @storybook/react-native-theming@10.3.0-next.2

## 10.3.0-next.1

### Patch Changes

- [#832](https://github.com/storybookjs/react-native/pull/832) [`d2f2d99`](https://github.com/storybookjs/react-native/commit/d2f2d9994f98c29c07bf1fe0108134c3bec094f9) Thanks [@YevheniiKotyrlo](https://github.com/YevheniiKotyrlo)! - fix: replace @ts-ignore with Metro-specific type definitions

- [#849](https://github.com/storybookjs/react-native/pull/849) [`c0b14e8`](https://github.com/storybookjs/react-native/commit/c0b14e842f17a3e8d56501e08f59a771431946de) Thanks [@dannyhw](https://github.com/dannyhw)! - adds an mcp option to withStorybook that enables an mcp endpoint in the channel server

- Updated dependencies []:
  - @storybook/react-native-ui@10.3.0-next.1
  - @storybook/react-native-ui-common@10.3.0-next.1
  - @storybook/react-native-theming@10.3.0-next.1

## 10.3.0-next.0

### Minor Changes

- [#848](https://github.com/storybookjs/react-native/pull/848) [`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add backgrounds addon behind `features.ondeviceBackgrounds` flag

  When `features: { ondeviceBackgrounds: true }` is set in main.ts, a Backgrounds panel is registered automatically in core without needing `@storybook/addon-ondevice-backgrounds`. Background color is resolved from globals and applied full-screen including safe areas. The `features` config is propagated via the generated `storybook.requires.ts` file onto `globalThis.FEATURES`.

  ### Usage

  **1. Enable the feature in `.storybook/main.ts`:**

  ```ts
  import type { StorybookConfig } from '@storybook/react-native';

  const main: StorybookConfig = {
    stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
    addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
    features: {
      ondeviceBackgrounds: true,
    },
  };

  export default main;
  ```

  **2. Configure background options in `.storybook/preview.tsx`:**

  ```tsx
  import type { Preview } from '@storybook/react-native';

  const preview: Preview = {
    parameters: {
      backgrounds: {
        options: {
          light: { name: 'Light', value: '#ffffff' },
          dark: { name: 'Dark', value: '#333333' },
          app: { name: 'App', value: '#eeeeee' },
        },
      },
    },
    initialGlobals: {
      backgrounds: { value: 'light' },
    },
  };

  export default preview;
  ```

  **3. Optionally override at the story level:**

  ```tsx
  import type { Meta, StoryObj } from '@storybook/react-native';

  const meta: Meta<typeof MyComponent> = {
    component: MyComponent,
    globals: {
      // Lock background for all stories in this file
      backgrounds: { value: 'dark' },
    },
  };

  export default meta;
  ```

### Patch Changes

- Updated dependencies [[`a61dbc0`](https://github.com/storybookjs/react-native/commit/a61dbc0c700f16270128b12fd25be284ada993b0)]:
  - @storybook/react-native-ui-common@10.3.0-next.0
  - @storybook/react-native-ui@10.3.0-next.0
  - @storybook/react-native-theming@10.3.0-next.0

## 10.2.3

### Patch Changes

- [`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588) Thanks [@dannyhw](https://github.com/dannyhw)! - bump storybook deps

- [#847](https://github.com/storybookjs/react-native/pull/847) [`4f50496`](https://github.com/storybookjs/react-native/commit/4f50496b5f38fa8eaad0731f08ecd3647ce727a3) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: prevent crash when websocket port is in use

- Updated dependencies [[`769f13e`](https://github.com/storybookjs/react-native/commit/769f13e80d925c7f88ae878dd8566534f1db4588)]:
  - @storybook/react-native-ui-common@10.2.3
  - @storybook/react-native-ui@10.2.3
  - @storybook/react-native-theming@10.2.3

## 10.2.2

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`eeab1bc`](https://github.com/storybookjs/react-native/commit/eeab1bc31ee5f791677280ae35120c2660184e90) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: linked addon packages should still resolve for generate script

- [`f7cba17`](https://github.com/storybookjs/react-native/commit/f7cba17598c8dd4aa045a27bc58127d32abe832e) Thanks [@dannyhw](https://github.com/dannyhw)! - release workflow test :)

- [#846](https://github.com/storybookjs/react-native/pull/846) [`eeab1bc`](https://github.com/storybookjs/react-native/commit/eeab1bc31ee5f791677280ae35120c2660184e90) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add Repack/rspack plugin for React Native Storybook
  feat: virtualize sidebar tree with LegendList for performance
  fix: root node style and text sizing adjustments
- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2
  - @storybook/react-native-ui-common@10.2.2
  - @storybook/react-native-theming@10.2.2

## 10.2.2-next.8

### Patch Changes

- [`f7cba17`](https://github.com/storybookjs/react-native/commit/f7cba17598c8dd4aa045a27bc58127d32abe832e) Thanks [@dannyhw](https://github.com/dannyhw)! - release workflow test :)

- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.8
  - @storybook/react-native-ui-common@10.2.2-next.8
  - @storybook/react-native-theming@10.2.2-next.8

## 10.2.2-next.7

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`f9c82f3`](https://github.com/storybookjs/react-native/commit/f9c82f3c8313cb9faf9b86ab4cc2afb9489cb8bb) Thanks [@dannyhw](https://github.com/dannyhw)! - fix: linked addon packages should still resolve for generate script

- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.7
  - @storybook/react-native-ui-common@10.2.2-next.7
  - @storybook/react-native-theming@10.2.2-next.7

## 10.2.2-next.6

### Patch Changes

- [#846](https://github.com/storybookjs/react-native/pull/846) [`4d6cb1e`](https://github.com/storybookjs/react-native/commit/4d6cb1e64ab7f06ce9c08836e8683d595b26f7cc) Thanks [@dannyhw](https://github.com/dannyhw)! - feat: add Repack/rspack plugin for React Native Storybook
  feat: virtualize sidebar tree with LegendList for performance
  fix: root node style and text sizing adjustments
- Updated dependencies []:
  - @storybook/react-native-ui@10.2.2-next.6
  - @storybook/react-native-ui-common@10.2.2-next.6
  - @storybook/react-native-theming@10.2.2-next.6
