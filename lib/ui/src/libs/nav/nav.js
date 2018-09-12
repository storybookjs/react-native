import mergeWith from 'lodash.mergewith';

// TODO: these are copies from components/nav/lib
// refactor to DRY

const toKey = input =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

const toChild = name => ({ name, id: toKey(name) });

// merge with concatinating arrays
const merge = (a, b) =>
  mergeWith(a, b, (objValue, srcValue) => {
    if (Array.isArray(objValue)) {
      srcValue.forEach(item => {
        const existing = objValue.find(({ id }) => id === item.id);
        if (existing) {
          merge(existing, item);
        } else {
          objValue.push(item);
        }
      });
      return objValue;
      // return objValue.concat(srcValue);
    }
    return undefined;
  });

export const splitPath = (path, { rootSeperator, groupSeperator }) => {
  const [root, remainder] = path.split(rootSeperator, 2);
  const groups = (remainder || path).split(groupSeperator);

  // when there's no remainder, it means the root wasn't found/split
  return {
    root: remainder ? root : null,
    groups,
  };
};

export { toKey };

// eslint-disable-next-line eqeqeq
export const isRoot = (k, v) => k == v.id;

export const toId = (base, addition) => (base === '' ? `${addition}` : `${base}-${addition}`);
export const toDataset = (set, path = '', output = {}, depth = 0) =>
  set.reduce((acc, i) => {
    const p = toId(path, i.id);
    if (i.children) {
      toDataset(i.children, p, acc, depth + 1);
    }

    return Object.assign(acc, {
      root: {
        children: [].concat(acc.root ? acc.root.children : []).concat(isRoot(p, i) ? p : []),
      },
      [p]: Object.assign(
        {},
        i,
        {
          isExpanded: !!i.isExpanded,
          isSelected: !!i.isSelected,
          path: p,
          depth,
          pid: path,
        },
        i.children ? { children: i.children.map(c => toId(p, c.id)) } : {}
      ),
    });
  }, output);

export const toNested = (input, options) =>
  input.reduce((acc, { stories, kind }) => {
    const { root, groups = [] } = splitPath(kind, options);

    const hierarchy = []
      .concat(root || [])
      .concat(groups)
      .filter(Boolean)
      .map(
        (name, index, list) =>
          index === list.length - 1
            ? {
                ...toChild(name),
                children: stories.map(toChild).map(i => ({ ...i, legacyKind: kind })),
              }
            : toChild(name)
      );

    // going from the leaf to trunk
    const addition = hierarchy.reduceRight(
      (localAcc, item) =>
        localAcc && localAcc.length
          ? [
              {
                ...item,
                children: [...(item.children || []), ...localAcc],
              },
            ]
          : [item],
      []
    );

    const currentRootId = hierarchy[0].id;
    const existingRoot = acc.find(({ id }) => id === currentRootId);
    if (existingRoot) {
      // MUTATION !
      merge(existingRoot, addition.find(({ id }) => id === currentRootId));
      return acc;
    }
    return acc.concat(addition);
  }, []);
