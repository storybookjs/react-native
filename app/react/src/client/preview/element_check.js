import React from 'react';

// return true if the element is renderable with react fiber
export const isValidFiberElement = element =>
  typeof element === 'string' || typeof element === 'number' || React.isValidElement(element);

// input: [1, 2, [3, 4, [5, 6, [7]]]]
// output: [ 1, 2, 3, 4, 5, 6, 7 ]
export const flattenList = list =>
  list.reduce((array, element) => {
    const newElement = Array.isArray(element) ? flattenList(element) : [element];

    return [...array, ...newElement];
  }, []);

export const isPriorToFiber = version => {
  const [majorVersion] = version.split('.');

  return Number(majorVersion) < 16;
};

// accepts an element and return true if renderable else return false
const isReactRenderable = element => {
  // storybook is running with a version prior to fiber,
  // run a simple check on the element
  if (isPriorToFiber(React.version)) {
    return React.isValidElement(element);
  }

  // the element is not an array, check if its a fiber renderable element
  if (!Array.isArray(element)) {
    return isValidFiberElement(element);
  }

  // the element is in fact a list of elements (array),
  // loop on its elements to see if its ok to render them
  const elementsList = element.map(isReactRenderable);

  // flatten the list of elements (possibly deep nested)
  const flatList = flattenList(elementsList);

  // keep only invalid elements
  const invalidElements = flatList.filter(elementIsRenderable => elementIsRenderable === false);

  // it's ok to render this list if there is no invalid elements inside
  return !invalidElements.length;
};

export default isReactRenderable;
