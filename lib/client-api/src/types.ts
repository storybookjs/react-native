import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';

export type Keys =
  | 'addons-a11y-basebutton--default'
  | 'addons-a11y-basebutton--delayed-render'
  | 'addons-a11y-basebutton--disabled'
  | 'addons-a11y-basebutton--invalid-contrast'
  | 'addons-a11y-basebutton--label'
  | 'addons-a11y-button--content'
  | 'addons-a11y-button--default'
  | 'addons-a11y-button--disabled'
  | 'addons-a11y-button--invalid-contrast'
  | 'addons-a11y-button--label'
  | 'addons-a11y-form--with-label'
  | 'addons-a11y-form--with-placeholder'
  | 'addons-a11y-form--without-label'
  | 'addons-a11y-image--presentation'
  | 'addons-a11y-image--with-alt'
  | 'addons-a11y-image--without-alt'
  | 'addons-a11y-image--without-alt-but-unchecked'
  | 'addons-a11y-typography--correct'
  | 'addons-a11y-typography--empty-heading'
  | 'addons-a11y-typography--empty-link'
  | 'addons-a11y-typography--empty-paragraph'
  | 'addons-a11y-typography--link-without-href'
  | 'addons-actions--all-types'
  | 'addons-actions--basic-example'
  | 'addons-actions--circular-payload'
  | 'addons-actions--configureactionsdepth'
  | 'addons-actions--decorated-action'
  | 'addons-actions--decorated-action-config'
  | 'addons-actions--decorated-actions'
  | 'addons-actions--decorated-actions-config'
  | 'addons-actions--limit-action-output'
  | 'addons-actions--multiple-actions'
  | 'addons-actions--multiple-actions-as-object'
  | 'addons-actions--multiple-actions-config'
  | 'addons-actions--multiple-actions-object-config'
  | 'addons-actions--persisting-the-action-logger'
  | 'addons-actions--reserved-keyword-as-name'
  | 'addons-actions-deprecated--decorated-action'
  | 'addons-backgrounds--disabled-via'
  | 'addons-backgrounds--overriden'
  | 'addons-backgrounds--skipped-via-disable-true'
  | 'addons-backgrounds--story-1'
  | 'addons-backgrounds--story-2'
  | 'addons-centered--story-1'
  | 'addons-contexts--languages'
  | 'addons-contexts--simple-css-theming'
  | 'addons-cssresources--camera-icon'
  | 'addons-cssresources--primary-large-button'
  | 'addons-design-assets--multiple-images'
  | 'addons-design-assets--named-assets'
  | 'addons-design-assets--single-image'
  | 'addons-design-assets--single-webpage'
  | 'addons-design-assets--url-replacement'
  | 'addons-design-assets--youtube-video'
  | 'addons-events--logger'
  | 'addons-events-deprecated--logger'
  | 'addons-graphql--get-pickachu'
  | 'addons-info-decorator--use-info-as-story-decorator'
  | 'addons-info-deprecated--displays-markdown-in-description'
  | 'addons-info-forwardref--displays-forwarded-ref-components-correctly'
  | 'addons-info-forwardref--uses-forwardref-displayname-if-available'
  | 'addons-info-github-issues--1814'
  | 'addons-info-jsx--displays-jsx-in-description'
  | 'addons-info-markdown--displays-markdown-in-description'
  | 'addons-info-markdown--from-external-markdown-file'
  | 'addons-info-markdown--from-internal-markdown-file'
  | 'addons-info-options-excludedproptypes--excludes-proptypes-that-are-in-the-excludedproptypes-array'
  | 'addons-info-options-header--shows-or-hides-info-addon-header'
  | 'addons-info-options-inline--inlines-component-inside-story'
  | 'addons-info-options-proptables--shows-additional-component-prop-tables'
  | 'addons-info-options-proptablesexclude--exclude-component-from-prop-tables'
  | 'addons-info-options-source--shows-or-hides-info-addon-source'
  | 'addons-info-options-styles--extend-info-styles-with-an-object'
  | 'addons-info-options-styles--full-control-over-styles-using-a-function'
  | 'addons-info-options-tablecomponent--use-a-custom-component-for-the-table'
  | 'addons-info-parameters--disable-the-addon-entirely'
  | 'addons-info-parameters--overwrite-the-parameters-with-markdown-variable'
  | 'addons-info-parameters--overwrite-the-text-parameter-with-markdown-inline'
  | 'addons-info-parameters--overwriting-and-extending-the-parameters-and-options-set-stories-wise'
  | 'addons-info-parameters--using-paramaters-across-all-stories'
  | 'addons-info-react-docgen--comments-from-component-declaration'
  | 'addons-info-react-docgen--comments-from-flow-declarations'
  | 'addons-info-react-docgen--comments-from-named-export-component-declaration'
  | 'addons-info-react-docgen--comments-from-proptype-declarations'
  | 'addons-info-story-source--array-prop'
  | 'addons-info-story-source--children'
  | 'addons-info-story-source--many-props'
  | 'addons-info-story-source--object-prop'
  | 'addons-info-story-source--one-prop'
  | 'addons-jest--withtests'
  | 'addons-knobs-withknobs--accepts-story-parameters'
  | 'addons-knobs-withknobs--complex-select'
  | 'addons-knobs-withknobs--dynamic-knobs'
  | 'addons-knobs-withknobs--optionsknob'
  | 'addons-knobs-withknobs--triggers-actions-via-button'
  | 'addons-knobs-withknobs--tweaks-static-values'
  | 'addons-knobs-withknobs--tweaks-static-values-organized-in-groups'
  | 'addons-knobs-withknobs--xss-safety'
  | 'addons-knobs-withknobs-using-options--accepts-options'
  | 'addons-links-button--first'
  | 'addons-links-button--second'
  | 'addons-links-href--log'
  | 'addons-links-link--first'
  | 'addons-links-link--second'
  | 'addons-links-scroll-position--first'
  | 'addons-links-scroll-position--second'
  | 'addons-links-select--first'
  | 'addons-links-select--index'
  | 'addons-links-select--second'
  | 'addons-links-select--third'
  | 'addons-notes--addon-notes'
  | 'addons-notes--addon-notes-rendering-imported-markdown'
  | 'addons-notes--addon-notes-rendering-inline-github-flavored-markdown'
  | 'addons-notes--with-a-markdown-giphy'
  | 'addons-notes--with-a-markdown-table'
  | 'addons-options--hiding-addon-panel'
  | 'addons-options--setting-name'
  | 'addons-queryparams--mock-is-4'
  | 'addons-queryparams--mock-is-true'
  | 'addons-storyshots--block'
  | 'addons-viewport--default'
  | 'addons-viewport-custom-default-kindle-fire-2--disabled'
  | 'addons-viewport-custom-default-kindle-fire-2--inherited'
  | 'addons-viewport-custom-default-kindle-fire-2--overridden-via-withviewport-parameterized-decorator'
  | 'app-acceptance--angular-cli'
  | 'app-acceptance--cra-kitchen-sink'
  | 'app-acceptance--cra-react15'
  | 'app-acceptance--cra-ts-kitchen-sink'
  | 'app-acceptance--html-kitchen-sink'
  | 'app-acceptance--mithril-kitchen-sink'
  | 'app-acceptance--polymer-cli'
  | 'app-acceptance--preact-kitchen-sink'
  | 'app-acceptance--riot-kitchen-sink'
  | 'app-acceptance--svelte-kitchen-sink'
  | 'app-acceptance--vue-kitchen-sink'
  | 'basics-actionbar--manyitems'
  | 'basics-actionbar--singleitem'
  | 'basics-badge--all-badges'
  | 'basics-brand-storybookicon--default'
  | 'basics-brand-storybooklogo--normal'
  | 'basics-button--all-buttons'
  | 'basics-documentformatting--withdom'
  | 'basics-documentformatting--withmarkdown'
  | 'basics-form-button--sizes'
  | 'basics-form-button--validations'
  | 'basics-form-field--field'
  | 'basics-form-input--alignment'
  | 'basics-form-input--sizes'
  | 'basics-form-input--validations'
  | 'basics-form-select--sizes'
  | 'basics-form-select--validations'
  | 'basics-form-textarea--alignment'
  | 'basics-form-textarea--sizes'
  | 'basics-form-textarea--validations'
  | 'basics-icon--labels'
  | 'basics-icon--no-labels'
  | 'basics-link--cancel-w-href'
  | 'basics-link--cancel-w-onclick'
  | 'basics-link--no-cancel-w-href'
  | 'basics-link--no-cancel-w-onclick'
  | 'basics-link--styled-links'
  | 'basics-placeholder--singlechild'
  | 'basics-placeholder--twochildren'
  | 'basics-scrollarea--both'
  | 'basics-scrollarea--horizontal'
  | 'basics-scrollarea--vertical'
  | 'basics-scrollarea--withouterborder'
  | 'basics-spaced--col'
  | 'basics-spaced--col-outer'
  | 'basics-spaced--row'
  | 'basics-spaced--row-multiply'
  | 'basics-spaced--row-outer'
  | 'basics-syntaxhighlighter--bash'
  | 'basics-syntaxhighlighter--bordered-copy-able'
  | 'basics-syntaxhighlighter--dark-unsupported'
  | 'basics-syntaxhighlighter--jsx'
  | 'basics-syntaxhighlighter--padded'
  | 'basics-syntaxhighlighter--showlinenumbers'
  | 'basics-syntaxhighlighter--story'
  | 'basics-syntaxhighlighter--unsupported'
  | 'basics-tabs--stateful-dynamic'
  | 'basics-tabs--stateful-no-initial'
  | 'basics-tabs--stateful-static'
  | 'basics-tabs--stateless-absolute'
  | 'basics-tabs--stateless-bordered'
  | 'basics-tabs--stateless-empty'
  | 'basics-tabs--stateless-with-tools'
  | 'basics-tooltip-listitem--active-icon'
  | 'basics-tooltip-listitem--all'
  | 'basics-tooltip-listitem--default'
  | 'basics-tooltip-listitem--default-icon'
  | 'basics-tooltip-listitem--disabled'
  | 'basics-tooltip-listitem--loading'
  | 'basics-tooltip-listitem--w-positions'
  | 'basics-tooltip-listitem--w-positions-active'
  | 'basics-tooltip-tooltip--basic-default'
  | 'basics-tooltip-tooltip--basic-default-bottom'
  | 'basics-tooltip-tooltip--basic-default-left'
  | 'basics-tooltip-tooltip--basic-default-right'
  | 'basics-tooltip-tooltip--no-chrome'
  | 'basics-tooltip-tooltiplinklist--links'
  | 'basics-tooltip-tooltiplinklist--links-and-callback'
  | 'basics-tooltip-tooltipmessage--default'
  | 'basics-tooltip-tooltipmessage--minimal-message'
  | 'basics-tooltip-tooltipmessage--with-link'
  | 'basics-tooltip-tooltipmessage--with-links'
  | 'basics-tooltip-tooltipnote--default'
  | 'basics-tooltip-withtooltip--no-chrome'
  | 'basics-tooltip-withtooltip--simple-click'
  | 'basics-tooltip-withtooltip--simple-click-closeonclick'
  | 'basics-tooltip-withtooltip--simple-click-start-open'
  | 'basics-tooltip-withtooltip--simple-hover'
  | 'basics-tooltip-withtooltip--simple-hover-functional'
  | 'basics-typography--all'
  | 'core-decorators--all'
  | 'core-errors--story-errors'
  | 'core-errors--story-throws-exception'
  | 'core-events--force-re-render'
  | 'core-parameters--passed-to-story'
  | 'core-scroll--story-with-100vh-padding-1'
  | 'core-scroll--story-with-100vh-padding-2'
  | 'core-unicode--кнопки'
  | 'core-unicode--바보x`'
  | 'core-unicode--😀'
  | 'other-demo-button--with-some-emoji'
  | 'other-demo-button--with-text'
  | 'other-demo-welcome--to-storybook'
  | 'other-stories-dirname-example--story-1'
  | 'other-stories-dirname-example--story-2'
  | 'ui-layout-desktop--bottom-panel'
  | 'ui-layout-desktop--default'
  | 'ui-layout-desktop--full'
  | 'ui-layout-desktop--no-nav'
  | 'ui-layout-desktop--no-panel'
  | 'ui-layout-desktop--no-panel-no-nav'
  | 'ui-layout-desktop--page'
  | 'ui-layout-mobile--initial-0'
  | 'ui-layout-mobile--initial-1'
  | 'ui-layout-mobile--initial-2'
  | 'ui-layout-mobile--page'
  | 'ui-notifications-item--longtext'
  | 'ui-notifications-item--simple'
  | 'ui-notifications-item--withlink'
  | 'ui-notifications-notifications--all'
  | 'ui-notifications-notifications--placement'
  | 'ui-notifications-notifications--single'
  | 'ui-panel--default'
  | 'ui-panel--no-panels'
  | 'ui-preview-iframe--errorstory'
  | 'ui-preview-iframe--missingstory'
  | 'ui-preview-iframe--workingstory'
  | 'ui-preview-preview--no-tabs'
  | 'ui-preview-preview--with-tabs'
  | 'ui-settings-aboutscreen--failed-to-fetch-new-version'
  | 'ui-settings-aboutscreen--new-version-required'
  | 'ui-settings-aboutscreen--up-to-date'
  | 'ui-settings-settingsfooter--basic'
  | 'ui-settings-shortcutsscreen--default-shortcuts'
  | 'ui-sidebar-listitemicon--all'
  | 'ui-sidebar-sidebar--loading'
  | 'ui-sidebar-sidebar--simple'
  | 'ui-sidebar-sidebarheading--custombrandimage'
  | 'ui-sidebar-sidebarheading--linkandtext'
  | 'ui-sidebar-sidebarheading--longtext'
  | 'ui-sidebar-sidebarheading--menuhighlighted'
  | 'ui-sidebar-sidebarheading--onlytext'
  | 'ui-sidebar-sidebarheading--standard'
  | 'ui-sidebar-sidebarheading--standardnolink'
  | 'ui-sidebar-sidebaritem--component'
  | 'ui-sidebar-sidebaritem--componentexpanded'
  | 'ui-sidebar-sidebaritem--group'
  | 'ui-sidebar-sidebaritem--loading'
  | 'ui-sidebar-sidebaritem--nesteddepths'
  | 'ui-sidebar-sidebaritem--story'
  | 'ui-sidebar-sidebaritem--storyselected'
  | 'ui-sidebar-sidebaritem--with-long-name'
  | 'ui-sidebar-sidebarsearch--filledin'
  | 'ui-sidebar-sidebarsearch--focussed'
  | 'ui-sidebar-sidebarsearch--simple'
  | 'ui-sidebar-sidebarstories--empty'
  | 'ui-sidebar-sidebarstories--loading'
  | 'ui-sidebar-sidebarstories--noroot'
  | 'ui-sidebar-sidebarstories--withroot'
  | 'ui-sidebar-sidebarsubheading--default';

export interface IDecoratorParams {
  default?: boolean;
  name: string;
  value: string;
}

export interface IDecoratorParamA11y {
  config: { [key: string]: any }; // this was empty, not sure what its type is
  options: { [key: string]: string };
}

export interface IHierarchyObj {
  hierarchyRootSeparator: string;
  hierarchySeparator: RegExp;
  theme?: { base: string; brandTitle: string };
}
export interface IDecoratorParamOptions extends Object {
  hierarchyRootSeparator: string;
  hierarchySeparator: RegExp;
  theme: {
    base: string;
    brandTitle: string;
  };
}

export interface IDecoratorBackgrounds {
  name: string;
  value: string;
  default?: true;
}

export interface IContext {
  id: string;
  kind: string;
  name: string;
  options: IDecoratorParamOptions;
  parameters: DecoratorParameters;
  story: string;
}

export interface DecoratorParameters {
  a11y: IDecoratorParamA11y;
  backgrounds: IDecoratorBackgrounds[];
  fileName?: string;
  globalParameter?: string;
  options: IDecoratorParamOptions;
}

export type StoryFn = (p?: any) => any;
export interface Decorator {
  getDecorated: () => (args: any) => any;
  getOriginal: () => any;
  id: string;
  kind: string;
  name: string;
  parameters: DecoratorParameters;
  story: string;
  storyFn: storyFn;
}

export type DecoratorData = { [K in Keys]: Decorator };
export interface IModule {
  exports: any;
  id: string;
  loaded: boolean;
  webpackPolyfill: number;
  hot: any;
}

export interface ClientApi {
  add: (storyName: string, storyFn: () => any, parameters: any) => void;
  _addons: { [key: string]: any };
  addDecorator: (decorator: any) => any;
  addDecorators: (parameters: any) => any;
  kind: string;
}
export interface ClientApiParams {
  storyStore: StoryStore;
  decorateStory: (storyFn: any, decorators: any) => any;
}
export type HandlerFunction = (...args: any[]) => void;
export type DecoratorFunction = (args: any[]) => any[];

export interface LegacyItem {
  fileName: string;
  index: number;
  kind: string;
  stories: { [key: string]: any };
  revision?: number;
  selection?: { storyId: string };
}

export type LegacyData = { [K in Keys]: LegacyItem };
export interface StoryStore {
  fromId: (id: string) => any;
  getSelection: () => void;
  getRevision: () => number;
  incrementRevision: () => void;
  addLegacyStory: (p: DecoratorData) => void;
  pushToManager: () => void;
  addStory: (p: DecoratorData) => void;
  remove: (id: string) => void;
  setChannel: (channel: Channel) => void;
  setSelection: (ref: any) => void;
  emit?: (...args: any) => void;
  raw?: () => [] | {};
  extract: () => {};
  getStoryWithContext: () => any;
  getStoryFileName: (kind: string) => null | string;
  getStories: (kind: string) => any[];
  getStoryKinds: () => string[];
  removeStoryKind: (kind: string) => void;
  hasStoryKind: (kind: string) => boolean;
  getStoryAndParameters: (
    kind: string,
    name: string
  ) => {
    story: any;
    parameters: any;
  };
  getStory: (kind: string, name: string) => any;
  hasStory: (kind: string, name: string) => boolean;
  size: () => number;
  clean: () => void;
  _channel: Channel;
  _data: DecoratorData;
  _events?: Events;
  _eventsCount?: number;
  _legacyData?: LegacyData;
}
