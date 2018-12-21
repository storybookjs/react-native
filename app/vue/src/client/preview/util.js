function getType(fn) {
  const match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : '';
}

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L92
function resolveDefault({ type, default: def }) {
  if (typeof def === 'function' && getType(type) !== 'Function') {
    // known limitation: we dont have the component instance to pass
    return def.call();
  }

  return def;
}

export function extractProps(component) {
  return Object.entries(component.options.props || {})
    .map(([name, prop]) => ({ [name]: resolveDefault(prop) }))
    .reduce((wrap, prop) => ({ ...wrap, ...prop }), {});
}
