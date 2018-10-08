import renderCompiledButUnmounted from './compiledButUnmounted';
import renderStringified from './stringified';
import renderRaw from './raw';

export function render(component) {
  if (typeof component === 'string') {
    renderRaw(component);
    return true;
  }
  const { tags } = component || {};
  if (Array.isArray(tags)) {
    renderStringified(component);
    return true;
  }
  if (component && component.tagName) {
    renderCompiledButUnmounted(component);
    return true;
  }
  if (component && component.length) {
    // already rendered, nothing to do
    return true;
  }
  return false;
}
