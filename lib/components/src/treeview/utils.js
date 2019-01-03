import { navigator } from 'global';
import memoize from 'memoizerific';

export const prevent = e => e.preventDefault();

export const isMacLike = () =>
  navigator && navigator.platform ? !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) : false;
export const controlOrMetaSymbol = () => (isMacLike() ? '⌘' : 'ctrl');
export const controlOrMetaKey = () => (isMacLike() ? 'meta' : 'control');
export const optionOrAltSymbol = () => (isMacLike() ? '⌥' : 'alt');

export const keyEventToAction = ({ keyCode, ctrlKey, shiftKey, altKey, metaKey }) => {
  if (shiftKey || metaKey || ctrlKey || altKey) {
    return false;
  }
  switch (keyCode) {
    case 18: {
      return 'ENTER';
    }
    case 32: {
      return 'SPACE';
    }
    case 38: {
      return 'UP';
    }
    case 40: {
      return 'DOWN';
    }
    case 37: {
      return 'LEFT';
    }
    case 39: {
      return 'RIGHT';
    }
    default: {
      return false;
    }
  }
};

export const createId = (path, prefix) => `${prefix}_${path}`;

export const get = ({ path, dataset }) => dataset[path];
export const getParent = ({ path, dataset }) => {
  const item = get({ path, dataset });
  if (!item || item.isRoot) {
    return undefined;
  }
  return get({ path: item.parent, dataset });
};
export const getParents = ({ path, dataset }) => {
  const parent = getParent({ path, dataset });

  if (!parent) {
    return [];
  }
  return [parent, ...getParents({ path: parent.path, dataset })];
};

export const getMains = memoize(1)(dataset =>
  Object.values(dataset)
    .filter(m => m.depth === 0)
    .sort((a, b) => {
      if (a.isRoot && b.isRoot) {
        return a.id > b.id;
      }
      if (!a.isRoot && !b.isRoot) {
        return 0;
      }
      if (a.isRoot) {
        return -1;
      }
      if (b.isRoot) {
        return 1;
      }
      return 0;
    })
);
const getMainsKeys = ({ dataset }) => getMains(dataset).map(m => m.path);

export const getPrevious = ({ path, dataset, expanded }) => {
  // STEP 1
  // find parent
  // if no previous sibling, use parent
  // unless parent is root
  //
  // STEP 2
  // find previous sibling
  // recurse into that sibling's last children that are expanded

  // debugger;
  const current = get({ path, dataset });
  const parent = getParent({ path, dataset });
  const mains = getMainsKeys({ dataset });

  const siblings = parent && parent.children ? parent.children : mains;
  const index = siblings.indexOf(current.path);

  if (index === 0) {
    if (parent && parent.isRoot) {
      return getPrevious({ path: parent.path, dataset, expanded });
    }
    if (!parent) {
      return undefined;
    }
    return parent;
  }

  let item = get({ path: siblings[index - 1], dataset });

  while (item.children && expanded[item.path]) {
    item = get({ path: item.children.slice(-1)[0], dataset });
  }

  if (item.isRoot) {
    return getPrevious({ path: item.path, dataset, expanded });
  }

  return item;
};

export const getNext = ({ path, dataset, expanded }) => {
  // STEP 1:
  // find any children if the node is expanded, first child
  //
  // STEP 2
  // iterate over parents, + fake 'root':
  // - find index of last parent as child in grandparent
  // - if child has next sibling, return
  // - if not, continue iterating
  const current = get({ path, dataset });

  if (!current) {
    return undefined;
  }

  const { children } = current;

  if (children && children.length && (expanded[current.path] || current.isRoot)) {
    return get({ path: children[0], dataset });
  }

  const mains = getMainsKeys({ dataset });

  const parents = getParents({ path, dataset }).concat([{ children: mains }]);

  const next = parents.reduce(
    (acc, item) => {
      if (acc.result) {
        return acc;
      }
      const parent = item;
      const siblings = parent && parent.children ? parent.children : mains;
      const index = siblings.indexOf(acc.child.path);

      if (siblings[index + 1]) {
        return { result: get({ path: siblings[index + 1], dataset }) };
      }
      return { child: parent };
    },
    { child: current, result: undefined }
  );

  if (next.result && next.result.isRoot) {
    return getNext({ path: next.result.path, dataset, expanded });
  }
  return next.result;
};

export const toId = (base, addition) => (base === '' ? `${addition}` : `${base}-${addition}`);
export const toFiltered = (dataset, filter) => {
  // match items on the filter
  const found = Object.entries(dataset).filter(
    ([k, v]) =>
      k.match(new RegExp(filter, 'i')) || (v.token && v.token.match(new RegExp(filter, 'i')))
  );

  // get all parents for all results
  const result = found.reduce((acc, [key, item]) => {
    const parents = getParents({ path: item.path, dataset }).reduce(
      (pacc, pitem) => ({ ...pacc, [pitem.path]: { ...pitem } }),
      {}
    );

    return { ...acc, [key]: item, ...parents };
  }, {});

  // filter the children of the found items (and their parents) so only found entries are present
  return Object.entries(result).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: v.children ? { ...v, children: v.children.filter(c => !!result[c]) } : v,
    }),
    {}
    // { root: { children: dataset.root.children.filter(k => result[k]) } }
  );
};
