/**
 * For more information about ducks:
 * @see https://github.com/erikras/ducks-modular-redux
 */
import { OPT_OUT, UPDATE_PROPS_MAP } from './constants';

// reducers
export const propsTreeReducer = (state = {}, { type = '', payload = {} }) => {
  switch (type) {
    case UPDATE_PROPS_MAP: {
      return {
        ...state,
        [payload.nodeId]: payload.props,
      };
    }
    default: {
      return null;
    }
  }
};

// actions
export const propsTreeUpdater = (nodes) => (nodeId, name) => {
  const { params } = nodes.find((node) => node.nodeId === nodeId);
  const { props = null } =
    // when opt-out context
    (name === OPT_OUT && {}) ||
    // when menu option get selected
    (name && params.find((param) => param.name === name)) ||
    // when being initialized
    params.find((param) => param.default) ||
    // fallback to the first
    params[0] ||
    // fallback for destructuring
    {};
  return {
    type: UPDATE_PROPS_MAP,
    payload: { nodeId, props },
  };
};
