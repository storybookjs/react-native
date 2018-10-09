import pick from 'lodash/pick';
import { Layout } from '@storybook/components';
import genPoddaLoader from '../libs/gen_podda_loader';
import compose from '../../../compose';

export const mapper = state => {
  const { shortcutOptions, isMobileDevice, uiOptions } = state;
  const currentOptions = pick(
    shortcutOptions,
    'showStoriesPanel',
    'showAddonPanel',
    'goFullScreen',
    'addonPanelInRight'
  );

  return {
    ...currentOptions,
    isMobileDevice,
    ...uiOptions,
  };
};

export default compose(
  genPoddaLoader(mapper),
  { withRef: false }
)(Layout);
