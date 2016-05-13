import Layout from '../components/layout';
import { useDeps, composeAll } from 'mantra-core';
import pick from 'lodash.pick';
import reduxComposer from '../libs/redux_composer';

export const composer = ({ shortcuts }) => {
  const data = pick(shortcuts, 'showLeftPanel', 'showDownPanel', 'goFullScreen');
  return data;
};

export default composeAll(
  reduxComposer(composer),
  useDeps()
)(Layout);
