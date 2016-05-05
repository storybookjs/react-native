import { compose } from 'mantra-core';

export function baseComposer(fn, props, onData) {
  const { reduxStore } = props.context();

  const processState = () => {
    try {
      const state = reduxStore.getState();
      const data = fn(state, props);
      onData(null, data);
    } catch (ex) {
      onData(ex);
    }
  };

  processState();
  reduxStore.subscribe(processState);
}

export default function reduxComposer(fn) {
  return compose(baseComposer.bind(null, fn));
}
