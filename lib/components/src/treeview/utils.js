import { navigator } from 'global';

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

export const createId = (path, prefix) => `${prefix}_${path}`;

export const get = ({ path, dataset }) => dataset[path];
export const getParent = ({ path, dataset }) => {
  const item = get({ path, dataset });
  if (!item || item.isRoot) {
    return undefined;
  }
  const pid = path
    .split('-')
    .slice(0, -1)
    .join('-');
  return get({ path: pid, dataset });
};
export const getParents = ({ path, dataset }) => {
  const items = path.split('-').slice(0, -1);

  return items
    .map((item, index, list) =>
      list
        .slice(0, index)
        .concat(item)
        .join('-')
    )
    .map(p => get({ path: p, dataset }));
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

export const getRoots = ({ dataset }) => Object.keys(dataset).filter(k => dataset[k].isRoot);

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
    const siblings = parent && parent.children ? parent.children : getRoots({ dataset });
    const index = siblings.indexOf(item.path);

    if (siblings[index + 1]) {
      return get({ path: siblings[index + 1], dataset });
    }
    return acc;
  }, undefined);
  return next;
};

// eslint-disable-next-line eqeqeq
export const isRoot = (k, v) => k == v.id;

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
      (pacc, pitem) => ({ ...pacc, [pitem.path]: { ...pitem, isExpanded: true } }),
      {}
    );

    return { ...acc, [key]: item, ...parents };
  }, {});

  // filter the children of the found items (and their parents) so only found entries are present
  return Object.entries(result).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: v.children
        ? { ...v, isExpanded: true, children: v.children.filter(c => !!result[c]) }
        : v,
    }),
    {}
    // { root: { children: dataset.root.children.filter(k => result[k]) } }
  );
};
