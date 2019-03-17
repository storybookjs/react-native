import { createStore } from 'redux';
import { ADD_ELEMENT } from './constants';

// actions

// add element is passed a HighlightedElementData object as the payload
export function addElement(payload: any) {
  return { type: ADD_ELEMENT, payload };
}

// reducers
const initialState = {
  highlightedElementsMap: new Map(),
};

function rootReducer(state = initialState, action: any) {
  if (action.type === ADD_ELEMENT) {
    state.highlightedElementsMap = state.highlightedElementsMap.set(action.payload.element, action.payload.highlightedElementData);
  }
  return state;
}

// store
const store = createStore(rootReducer);
export default store;
