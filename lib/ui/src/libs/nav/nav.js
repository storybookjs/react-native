import mergeWith from 'lodash.mergewith';
import toKey from 'to-camel-case';

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

const splitPath = (path, { rootSeperator, groupSeperator }) => {
  const [root, remainder] = path.split(new RegExp(rootSeperator), 2);
  const groups = (remainder || path).split(new RegExp(groupSeperator));

  return {
    root,
    groups,
  };
};

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
            ? { ...toChild(name), children: stories.map(toChild) }
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
