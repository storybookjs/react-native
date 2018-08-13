import { navigator, document } from 'global';

export const prevent = e => e.preventDefault();

export const isMacLike = () => !!navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);

export const keyEventToAction = ({ keyCode }) => {
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

export const createId = (path, prefix) => `treeview_${prefix}-${path}`;

export const get = ({ path, dataset }) => dataset[path];
export const getParent = ({ path, dataset }) => {
  const item = get({ path, dataset });
  if (!item || item === dataset.root) {
    return undefined;
  }
  return get({ path: item.pid, dataset }) || dataset.root;
};
export const getParents = ({ path, dataset }) => {
  let result = [];
  const item = get({ path, dataset });
  if (!item) {
    return undefined;
  }
  let p = item.pid;
  while (p) {
    const r = get({ path: p, dataset });
    result = result.concat(r);
    p = r.pid;
  }
  return result;
};

export const getSelected = ({ dataset }) => Object.values(dataset).filter(i => i.isSelected);

export const getPrevious = ({ path, dataset }) => {
  // STEP 1
  // find parent
  // if no previous sibling, use parent
  // unless parent is root
  //
  // STEP 2
  // find previous sibling
  // recurse into that sibling's last children that are isExpanded

  const current = get({ path, dataset });
  const parent = getParent({ path, dataset });
  const siblings = parent.children ? parent.children : parent;
  const index = siblings.indexOf(current.path);

  if (index === 0) {
    if (parent === dataset.root) {
      return undefined;
    }
    return parent;
  }

  let item = get({ path: siblings[index - 1], dataset });

  while (item.children && item.isExpanded) {
    item = get({ path: item.children.slice(-1)[0], dataset });
  }

  return item;
};

export const getNext = ({ path, dataset }) => {
  // STEP 1:
  // find any children if the node is expanded, first child
  //
  // STEP 2
  // find all parents as 'paths':
  // - go up 1 level
  // - get children
  // - find the index of the path
  // - if is NOT last in list, return next in list
  // - if IS last in list, move to next path in 'paths'

  const current = get({ path, dataset });

  if (!current) {
    return undefined;
  }

  const { children } = current;

  if (children && children.length && current.isExpanded) {
    return get({ path: children[0], dataset });
  }

  const parents = [current].concat(getParents({ path, dataset }));

  const next = parents.reduce((acc, item) => {
    if (acc) {
      return acc;
    }
    const parent = getParent({ path: item.path, dataset });
    const siblings = parent.children ? parent.children : parent;
    const index = siblings.indexOf(item.path);

    if (siblings[index + 1]) {
      return get({ path: siblings[index + 1], dataset });
    }
    return acc;
  }, undefined);
  return next;
};

export const isRoot = (k, v) => k == v.id;

export const toId = (base, addition) => (base === '' ? `${addition}` : `${base}-${addition}`);
export const toDataset = (set, path = '', output = {}) =>
  set.reduce((acc, i) => {
    const p = toId(path, i.id);
    if (i.children) {
      toDataset(i.children, p, acc);
    }

    return Object.assign(acc, {
      root: [].concat(acc.root || []).concat(isRoot(p, i) ? p : []),
      [p]: i.children
        ? { ...i, children: i.children.map(c => toId(p, c.id)), path: p, pid: path }
        : { ...i, path: p, pid: path },
    });
  }, output);
export const toNested = (dataset, list = dataset.root, depth = 0) =>
  list.map(i => {
    const item = get({ path: i, dataset });
    return item.children
      ? { ...item, depth, children: toNested(dataset, item.children, depth + 1) }
      : { ...item, depth };
  });
