import { document } from 'global';
import React, { Component, ReactElement, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RenderMainArgs } from './types';

const rootEl = document ? document.getElementById('root') : null;

const render = (node: ReactElement, el: Element) =>
  new Promise(resolve => {
    ReactDOM.render(
      process.env.STORYBOOK_EXAMPLE_APP ? <StrictMode>{node}</StrictMode> : node,
      el,
      resolve
    );
  });

class ErrorBoundary extends Component<{
  showException: (err: Error) => void;
  showMain: () => void;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidMount() {
    const { hasError } = this.state;
    const { showMain } = this.props;
    if (!hasError) {
      showMain();
    }
  }

  componentDidCatch(err: Error) {
    const { showException } = this.props;
    // message partially duplicates stack, strip it
    showException(err);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? null : children;
  }
}

export default async function renderMain({
  storyFn: StoryFn,
  showMain,
  showException,
  forceRender,
}: RenderMainArgs) {
  const element = (
    <ErrorBoundary showMain={showMain} showException={showException}>
      <StoryFn />
    </ErrorBoundary>
  );

  // We need to unmount the existing set of components in the DOM node.
  // Otherwise, React may not recreate instances for every story run.
  // This could leads to issues like below:
  // https://github.com/storybookjs/react-storybook/issues/81
  // But forceRender means that it's the same story, so we want too keep the state in that case.
  if (!forceRender) {
    ReactDOM.unmountComponentAtNode(rootEl);
  }

  await render(element, rootEl);
}
