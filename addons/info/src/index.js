import React from 'react';
import _Story from './components/Story';
import { H1, H2, H3, H4, H5, H6, Code, P, UL, A, LI } from './components/markdown';

function addonCompose(addonFn) {
  return storyFn => context => addonFn(storyFn, context);
}

function deprecate() {
  const logger = console;
  let warned = false;
  const deprecated = msg => {
    if (!warned) {
      logger.warn(msg);
      warned = true;
    }
  };
  return deprecated;
}

const showWarning = deprecate();

const warning = addonCompose((storyFn, context) => {
  showWarning(
    `Warning: Applying addWithInfo is deprecated and will be removed in the next major release. Use withInfo from the same package instead. \nPlease check the "${context.kind}/${context.story}" story. \nSee https://github.com/storybooks/storybook/tree/master/addons/info`
  );
  return storyFn(context);
});

export const Story = _Story;

const defaultOptions = {
  inline: false,
  header: true,
  source: true,
  propTables: [],
  maxPropsIntoLine: 3,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
};

const defaultMarksyConf = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  p: P,
  a: A,
  li: LI,
  ul: UL,
};

export function addInfo(storyFn, context, { info, _options }) {
  if (typeof storyFn !== 'function') {
    if (typeof info === 'function') {
        _options = storyFn; // eslint-disable-line
        storyFn = info; // eslint-disable-line
        info = ''; // eslint-disable-line
    } else {
      throw new Error('No story defining function has been specified');
    }
  }

  const options = {
    ...defaultOptions,
    ..._options,
  };

  // props.propTables can only be either an array of components or null
  // propTables option is allowed to be set to 'false' (a boolean)
  // if the option is false, replace it with null to avoid react warnings
  if (!options.propTables) {
    options.propTables = null;
  }

  const marksyConf = { ...defaultMarksyConf };
  if (options && options.marksyConf) {
    Object.assign(marksyConf, options.marksyConf);
  }
  const props = {
    info,
    context,
    showInline: Boolean(options.inline),
    showHeader: Boolean(options.header),
    showSource: Boolean(options.source),
    propTables: options.propTables,
    propTablesExclude: options.propTablesExclude,
    styles: typeof options.styles === 'function' ? options.styles : s => s,
    marksyConf,
    maxPropObjectKeys: options.maxPropObjectKeys,
    maxPropArrayLength: options.maxPropArrayLength,
    maxPropsIntoLine: options.maxPropsIntoLine,
    maxPropStringLength: options.maxPropStringLength,
  };
  return (
    <Story {...props}>
      {storyFn(context)}
    </Story>
  );
}

export const withInfo = (info, _options) =>
  addonCompose((storyFn, context) => addInfo(storyFn, context, { info, _options }));

export default {
  addWithInfo(storyName, info, storyFn, _options) {
    return this.add(storyName, warning(withInfo(info, _options)(storyFn)));
  },
};

export function setDefaults(newDefaults) {
  return Object.assign(defaultOptions, newDefaults);
}
