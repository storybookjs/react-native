/**
 * Access to React Native host elements for the testing helpers.
 *
 * The public element API exposes `id` (from `nativeID`), `tagName`, `textContent` and the tree,
 * but not props such as `accessibilityRole`, `placeholder` or `value`. `getProps` reads them from
 * React's fiber, which is private and may change: keep it the only place that does.
 */

export type RNElement = {
  id: string;
  tagName: string;
  textContent: string;
  children: ArrayLike<RNElement>;
  parentElement: RNElement | null;
  dispatchEvent?: (event: object) => boolean;
};

export type Props = Record<string, unknown>;

type InternalElement = RNElement & {
  __internalInstanceHandle?: {
    stateNode?: { canonical?: { currentProps?: Props } };
  };
};

/** Follows the same path as React Native's private `getCurrentProps`. */
export function getProps(element: RNElement): Props {
  const props = (element as InternalElement).__internalInstanceHandle?.stateNode?.canonical
    ?.currentProps;
  if (!props) {
    throw new Error(
      `Can't read the props of ${element.tagName}. React Native's internals may have changed.`
    );
  }
  return props;
}

export function getAllElements(root: RNElement): RNElement[] {
  const found: RNElement[] = [];
  const visit = (element: RNElement) => {
    found.push(element);
    Array.from(element.children).forEach(visit);
  };
  visit(root);
  return found;
}

export function getRoot(element: RNElement): RNElement {
  let root = element;
  while (root.parentElement) root = root.parentElement;
  return root;
}

export function isRNElement(value: unknown): value is RNElement {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as RNElement).tagName === 'string' &&
    'children' in value
  );
}

export function describeElement(element: RNElement) {
  return element.id ? `${element.tagName}#${element.id}` : element.tagName;
}
