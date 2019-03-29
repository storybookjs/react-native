import { createStore } from 'redux';
import { ADD_ELEMENT, CLEAR_ELEMENTS } from './constants';

// actions

// add element is passed a HighlightedElementData object as the payload
export function addElement(payload: any) {
  return { type: ADD_ELEMENT, payload };
}

// clear elements is a function to remove elements from the map and reset elements to their original state
export function clearElements(payload: any) {
  return { type: CLEAR_ELEMENTS, payload };
}

// reducers
const initialState = {
  highlightedElementsMap: new Map(),
};

function rootReducer(state = initialState, action: any) {
  if (action.type === ADD_ELEMENT) {
    return {
      ...state,
      highlightedElementsMap: state.highlightedElementsMap.set(
        action.payload.element,
        action.payload.highlightedElementData
      ),
    };
  } else if (action.type === CLEAR_ELEMENTS) {
    for (let key of Array.from(state.highlightedElementsMap.keys())) {
      key.style.outline = state.highlightedElementsMap.get(key).originalOutline;
      state.highlightedElementsMap.delete(key);
    }
  }
  return state;
}

// store
const store = createStore(rootReducer);
export default store;
