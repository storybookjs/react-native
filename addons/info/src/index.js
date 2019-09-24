import React from 'react';
import nestedObjectAssign from 'nested-object-assign';
import deprecate from 'util-deprecate';
import { makeDecorator } from '@storybook/addons';
import { logger } from '@storybook/client-logger';
import Story from './components/Story';
import PropTable from './components/PropTable/index';
import makeTableComponent from './components/makeTableComponent';
import { H1, H2, H3, H4, H5, H6, Code, P, UL, A, LI } from './components/markdown';

const defaultOptions = {
  inline: false,
  header: true,
  source: true,
  propTables: [],
  propTableCompare: (element, Component) =>
    // https://github.com/gaearon/react-hot-loader#checking-element-types
    typeof reactHotLoaderGlobal === 'undefined'
      ? element.type === Component
      : // eslint-disable-next-line no-undef
        reactHotLoaderGlobal.areComponentsEqual(element.type, Component),
  TableComponent: PropTable,
  maxPropsIntoLine: 3,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
};

const defaultComponents = {
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

let hasWarned = false;

function addInfo(storyFn, context, infoOptions) {
  const options = {
    ...defaultOptions,
    ...infoOptions,
  };

  // props.propTables can only be either an array of components or null
  // propTables option is allowed to be set to 'false' (a boolean)
  // if the option is false, replace it with null to avoid react warnings
  if (!options.propTables) {
    options.propTables = null;
  }

  const components = { ...defaultComponents };
  if (options && options.components) {
    Object.assign(components, options.components);
  }
  if (options && options.marksyConf) {
    if (!hasWarned) {
      logger.warn('@storybook/addon-info: "marksyConf" option has been renamed to "components"');
      hasWarned = true;
    }

    Object.assign(components, options.marksyConf);
  }
  const props = {
    info: options.text,
    context,
    showInline: Boolean(options.inline),
    showHeader: Boolean(options.header),
    showSource: Boolean(options.source),
    styles:
      typeof options.styles === 'function'
        ? options.styles
        : s => nestedObjectAssign({}, s, options.styles),
    propTables: options.propTables,
    propTablesExclude: options.propTablesExclude,
    propTableCompare: options.propTableCompare,
    PropTable: makeTableComponent(options.TableComponent),
    components,
    maxPropObjectKeys: options.maxPropObjectKeys,
    maxPropArrayLength: options.maxPropArrayLength,
    maxPropsIntoLine: options.maxPropsIntoLine,
    maxPropStringLength: options.maxPropStringLength,
    excludedPropTypes: options.excludedPropTypes,
  };
  return <Story {...props}>{storyFn(context)}</Story>;
}

export const withInfo = makeDecorator({
  name: 'withInfo',
  parameterName: 'info',
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    const infoOptions = typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;
    const mergedOptions =
      typeof infoOptions === 'string' ? infoOptions : { ...options, ...infoOptions };
    return addInfo(getStory, context, mergedOptions);
  },
});

export { Story };

export function setDefaults(newDefaults) {
  return deprecate(
    () => Object.assign(defaultOptions, newDefaults),
    'setDefaults is deprecated. Instead, you can pass options into withInfo(options) directly, or use the info parameter.'
  )();
}
