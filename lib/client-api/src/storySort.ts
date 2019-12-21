import { StorySortObjectParameter, Comparator } from '@storybook/addons';

const storySort = (options: StorySortObjectParameter = {}): Comparator<any> => (
  a: any,
  b: any
): number => {
  // If the two stories have the same story kind, then use the default
  // ordering, which is the order they are defined in the story file.
  if (a[1].kind === b[1].kind) {
    return 0;
  }

  // Get the StorySortParameter options.
  const method = options.method || 'configure';
  let order = options.order || [];

  // Examine each part of the story kind in turn.
  const storyKindA = a[1].kind.split('/');
  const storyKindB = b[1].kind.split('/');
  let depth = 0;
  while (storyKindA[depth] || storyKindB[depth]) {
    // Stories with a shorter depth should go first.
    if (!storyKindA[depth]) {
      return -1;
    }
    if (!storyKindB[depth]) {
      return 1;
    }

    // Compare the next part of the story kind.
    const nameA = storyKindA[depth];
    const nameB = storyKindB[depth];
    if (nameA !== nameB) {
      // Look for the names in the given `order` array.
      let indexA = order.indexOf(nameA);
      let indexB = order.indexOf(nameB);

      // If at least one of the names is found, sort by the `order` array.
      if (indexA !== -1 || indexB !== -1) {
        // If one of the names is not found in `order`, list it last.
        if (indexA === -1) {
          indexA = order.length;
        }
        if (indexB === -1) {
          indexB = order.length;
        }

        return indexA - indexB;
      }

      // Use the default configure() order.
      if (method === 'configure') {
        return 0;
      }

      // Otherwise, use alphabetical order.
      return nameA.localeCompare(nameB, options.locales ? options.locales : undefined, {
        numeric: true,
        sensitivity: 'accent',
      });
    }

    // If a nested array is provided for a name, use it for ordering.
    const index = order.indexOf(nameA);
    order = index !== -1 && Array.isArray(order[index + 1]) ? order[index + 1] : [];

    // We'll need to look at the next part of the name.
    depth += 1;
  }

  // Identical story kinds. The shortcut at the start of this function prevents
  // this from ever being used.
  /* istanbul ignore next */
  return 0;
};

export default storySort;
