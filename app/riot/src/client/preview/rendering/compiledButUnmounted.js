import { mount } from 'riot';

export default function renderCompiledButUnmounted(component) {
  mount('root', component.tagName, component.opts || {});
}
