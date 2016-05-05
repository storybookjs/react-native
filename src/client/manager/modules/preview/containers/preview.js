import Preview from '../components/preview.js';
import { useDeps, compose, composeAll } from 'mantra-core';
import qs from 'qs';

export const composer = ({ context }, onData) => {
  const { reduxStore } = context();
  // Here we are sure that, Redux store initialize with the dataId.
  // So that's why don't need to subscribe here.
  const state = reduxStore.getState();
  const queryParams = {
    dataId: state.core.dataId,
  };

  // pick selectedKind and selectedStory if exists
  if (state.api) {
    queryParams.selectedKind = state.api.selectedKind;
    queryParams.selectedStory = state.api.selectedStory;
  }

  const queryString = qs.stringify(queryParams);
  const url = `iframe.html?${queryString}`;
  onData(null, { url });
};

export default composeAll(
  compose(composer),
  useDeps()
)(Preview);
