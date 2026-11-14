/**
 * Testing Library-style queries for React Native elements, named and behaving like
 * `@testing-library/dom`'s where React Native has an equivalent.
 */
import { getAllElements, getProps, type RNElement } from './elements';
import { waitFor, type WaitForOptions } from './waitFor';

export type Matcher = string | RegExp | ((content: string, element: RNElement) => boolean);

export type MatcherOptions = {
  /** Match the whole string, case-sensitively. With `false`, match a case-insensitive substring. */
  exact?: boolean;
  /** Defaults to trimming and collapsing whitespace. */
  normalizer?: (text: string) => string;
};

export type ByRoleOptions = MatcherOptions & {
  /** The accessible name: the label, or the text inside. */
  name?: Matcher;
  /** For switches and checkboxes. */
  checked?: boolean;
  disabled?: boolean;
};

const defaultNormalizer = (text: string) => text.trim().replace(/\s+/g, ' ');

function matches(
  value: unknown,
  element: RNElement,
  matcher: Matcher,
  { exact = true, normalizer = defaultNormalizer }: MatcherOptions = {}
): boolean {
  if (typeof value !== 'string') return false;
  const text = normalizer(value);
  if (typeof matcher === 'function') return matcher(text, element);
  if (matcher instanceof RegExp) return matcher.test(text);
  return exact ? text === matcher : text.toLowerCase().includes(matcher.toLowerCase());
}

const describeMatcher = (matcher: Matcher) =>
  typeof matcher === 'string' ? `"${matcher}"` : String(matcher);

// React Native's `accessibilityRole` values that have a different ARIA name.
const ARIA_ROLES: Record<string, string> = {
  adjustable: 'slider',
  header: 'heading',
  image: 'img',
  imagebutton: 'button',
  search: 'searchbox',
  togglebutton: 'button',
};

// Roles host components have without one being set, like `<input>` is a textbox on the web.
const IMPLICIT_ROLES: Record<string, string> = {
  'RN:Image': 'img',
  'RN:Switch': 'switch',
  'RN:TextInput': 'textbox',
};

export function getRole(element: RNElement): string | undefined {
  const { role, accessibilityRole } = getProps(element);
  const explicit = typeof role === 'string' ? role : accessibilityRole;
  if (typeof explicit === 'string' && explicit !== 'none') {
    return ARIA_ROLES[explicit] ?? explicit;
  }
  return IMPLICIT_ROLES[element.tagName];
}

function findById(root: RNElement, id: string) {
  return getAllElements(root).find((element) => element.id === id);
}

/** The label if there is one, otherwise the text inside, like a screen reader. */
export function getAccessibleName(element: RNElement, root: RNElement): string {
  const props = getProps(element);
  const label = props['aria-label'] ?? props.accessibilityLabel;
  if (typeof label === 'string') return label;

  const labelledBy = props['aria-labelledby'] ?? props.accessibilityLabelledBy;
  const ids = Array.isArray(labelledBy) ? labelledBy : [labelledBy];
  const labels = ids
    .filter((id): id is string => typeof id === 'string')
    .map((id) => findById(root, id)?.textContent ?? '');
  if (labels.some(Boolean)) return labels.join(' ');

  return element.textContent;
}

type Query = {
  describe: string;
  filter: (element: RNElement, root: RNElement) => boolean;
};

function queryAll(root: RNElement, { filter }: Query) {
  return getAllElements(root).filter((element) => filter(element, root));
}

function getAll(root: RNElement, query: Query) {
  const found = queryAll(root, query);
  if (found.length === 0) {
    throw new Error(`Unable to find an element ${query.describe}`);
  }
  return found;
}

function queryOne(root: RNElement, query: Query) {
  const found = queryAll(root, query);
  if (found.length > 1) {
    throw new Error(`Found multiple elements ${query.describe}`);
  }
  return found[0] ?? null;
}

function getOne(root: RNElement, query: Query) {
  const found = queryOne(root, query);
  if (!found) {
    throw new Error(`Unable to find an element ${query.describe}`);
  }
  return found;
}

const byRole = (role: string, options: ByRoleOptions = {}): Query => {
  const { name, checked, disabled } = options;
  return {
    describe: `with the role "${role}"${name !== undefined ? ` and name ${describeMatcher(name)}` : ''}`,
    filter: (element, root) => {
      if (getRole(element) !== role) return false;
      const props = getProps(element);
      const state = (props.accessibilityState ?? {}) as Record<string, unknown>;
      if (checked !== undefined) {
        const value = props['aria-checked'] ?? state.checked ?? props.value;
        if (Boolean(value) !== checked) return false;
      }
      if (disabled !== undefined) {
        const value = props['aria-disabled'] ?? state.disabled ?? props.disabled;
        if (Boolean(value) !== disabled) return false;
      }
      return (
        name === undefined || matches(getAccessibleName(element, root), element, name, options)
      );
    },
  };
};

// `Text` renders as `RN:Paragraph`, with any nested `Text` inside it as part of its content.
const byText = (text: Matcher, options?: MatcherOptions): Query => ({
  describe: `with the text: ${describeMatcher(text)}`,
  filter: (element) =>
    element.tagName === 'RN:Paragraph' && matches(element.textContent, element, text, options),
});

const byLabelText = (label: Matcher, options?: MatcherOptions): Query => ({
  describe: `with the label: ${describeMatcher(label)}`,
  filter: (element, root) => {
    const props = getProps(element);
    const hasLabel =
      props['aria-label'] !== undefined ||
      props.accessibilityLabel !== undefined ||
      props['aria-labelledby'] !== undefined ||
      props.accessibilityLabelledBy !== undefined;
    return hasLabel && matches(getAccessibleName(element, root), element, label, options);
  },
});

const byProp =
  (prop: string, description: string) =>
  (value: Matcher, options?: MatcherOptions): Query => ({
    describe: `with the ${description}: ${describeMatcher(value)}`,
    filter: (element) => matches(getProps(element)[prop], element, value, options),
  });

const byPlaceholderText = byProp('placeholder', 'placeholder text');
const byAltText = byProp('alt', 'alt text');
const byTestId = byProp('testID', 'testID');

const byDisplayValue = (value: Matcher, options?: MatcherOptions): Query => ({
  describe: `with the display value: ${describeMatcher(value)}`,
  filter: (element) => {
    if (element.tagName !== 'RN:TextInput') return false;
    const props = getProps(element);
    return matches(props.value ?? props.defaultValue, element, value, options);
  },
});

type QueryFactory<Args extends unknown[]> = (...args: Args) => Query;

/** Builds the `getBy`, `getAllBy`, `queryBy`, `queryAllBy`, `findBy` and `findAllBy` variants. */
function variants<Args extends unknown[]>(root: RNElement, factory: QueryFactory<Args>) {
  return {
    get: (...args: Args) => getOne(root, factory(...args)),
    getAll: (...args: Args) => getAll(root, factory(...args)),
    query: (...args: Args) => queryOne(root, factory(...args)),
    queryAll: (...args: Args) => queryAll(root, factory(...args)),
    find: (...args: [...Args, WaitForOptions?]) => {
      const [queryArgs, waitForOptions] = splitFindArgs<Args>(args);
      return waitFor(() => getOne(root, factory(...queryArgs)), waitForOptions);
    },
    findAll: (...args: [...Args, WaitForOptions?]) => {
      const [queryArgs, waitForOptions] = splitFindArgs<Args>(args);
      return waitFor(() => getAll(root, factory(...queryArgs)), waitForOptions);
    },
  };
}

// Every query takes a matcher and options. `findBy*` takes the `waitFor` options after them, as on
// the web.
function splitFindArgs<Args extends unknown[]>(
  args: unknown[]
): [Args, WaitForOptions | undefined] {
  return [args.slice(0, 2) as Args, args[2] as WaitForOptions | undefined];
}

/** Queries scoped to `root`, like Testing Library's `within`. */
export function within(root: RNElement) {
  const role = variants(root, byRole);
  const text = variants(root, byText);
  const labelText = variants(root, byLabelText);
  const placeholderText = variants(root, byPlaceholderText);
  const displayValue = variants(root, byDisplayValue);
  const altText = variants(root, byAltText);
  const testId = variants(root, byTestId);

  return {
    getByRole: role.get,
    getAllByRole: role.getAll,
    queryByRole: role.query,
    queryAllByRole: role.queryAll,
    findByRole: role.find,
    findAllByRole: role.findAll,

    getByText: text.get,
    getAllByText: text.getAll,
    queryByText: text.query,
    queryAllByText: text.queryAll,
    findByText: text.find,
    findAllByText: text.findAll,

    getByLabelText: labelText.get,
    getAllByLabelText: labelText.getAll,
    queryByLabelText: labelText.query,
    queryAllByLabelText: labelText.queryAll,
    findByLabelText: labelText.find,
    findAllByLabelText: labelText.findAll,

    getByPlaceholderText: placeholderText.get,
    getAllByPlaceholderText: placeholderText.getAll,
    queryByPlaceholderText: placeholderText.query,
    queryAllByPlaceholderText: placeholderText.queryAll,
    findByPlaceholderText: placeholderText.find,
    findAllByPlaceholderText: placeholderText.findAll,

    getByDisplayValue: displayValue.get,
    getAllByDisplayValue: displayValue.getAll,
    queryByDisplayValue: displayValue.query,
    queryAllByDisplayValue: displayValue.queryAll,
    findByDisplayValue: displayValue.find,
    findAllByDisplayValue: displayValue.findAll,

    getByAltText: altText.get,
    getAllByAltText: altText.getAll,
    queryByAltText: altText.query,
    queryAllByAltText: altText.queryAll,
    findByAltText: altText.find,
    findAllByAltText: altText.findAll,

    getByTestId: testId.get,
    getAllByTestId: testId.getAll,
    queryByTestId: testId.query,
    queryAllByTestId: testId.queryAll,
    findByTestId: testId.find,
    findAllByTestId: testId.findAll,
  };
}

export type Canvas = ReturnType<typeof within>;
