/** @jsx m */

import m from 'mithril';
import { linkTo, hrefTo } from '@storybook/addon-links';

const Main = {
  view: vnode => (
    <article
      style={{
        padding: '15px',
        lineHeight: 1.4,
        fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
        backgroundColor: '#ffffff',
      }}
    >
      {vnode.children}
    </article>
  ),
};

const Title = {
  view: vnode => <h1>{vnode.children}</h1>,
};

const Note = {
  view: vnode => (
    <p
      style={{
        opacity: 0.5,
      }}
    >
      {vnode.children}
    </p>
  ),
};

const InlineCode = {
  view: vnode => (
    <code
      style={{
        fontSize: '15px',
        fontWeight: 600,
        padding: '2px 5px',
        border: '1px solid #eae9e9',
        borderRadius: '4px',
        backgroundColor: '#f3f2f2',
        color: '#3a3a3a',
      }}
    >
      {vnode.children}
    </code>
  ),
};

const Link = {
  view: vnode => (
    <a
      style={{
        color: '#1474f3',
        textDecoration: 'none',
        borderBottom: '1px solid #1474f3',
        paddingBottom: '2px',
      }}
      {...vnode.attrs}
    >
      {vnode.children}
    </a>
  ),
};

const NavButton = {
  view: vnode => (
    <button
      type="button"
      style={{
        borderTop: 'none',
        borderRight: 'none',
        borderLeft: 'none',
        backgroundColor: 'transparent',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
      }}
      {...vnode.attrs}
    >
      {vnode.children}
    </button>
  ),
};

const StoryLink = {
  oninit: vnode => {
    // eslint-disable-next-line no-param-reassign
    vnode.state.href = '/';
    // eslint-disable-next-line no-param-reassign
    vnode.state.onclick = () => {
      linkTo(vnode.attrs.kind, vnode.attrs.story)();
      return false;
    };
    StoryLink.updateHref(vnode);
  },
  updateHref: async vnode => {
    const href = await hrefTo(vnode.attrs.kind, vnode.attrs.story);
    // eslint-disable-next-line no-param-reassign
    vnode.state.href = href;
    m.redraw();
  },
  view: vnode => (
    <a
      href={vnode.state.href}
      style={{
        color: '#1474f3',
        textDecoration: 'none',
        borderBottom: '1px solid #1474f3',
        paddingBottom: '2px',
      }}
      onClick={vnode.state.onclick}
    >
      {vnode.children}
    </a>
  ),
};

const Welcome = {
  view: vnode => (
    <Main>
      <Title>Welcome to storybook</Title>
      <p>This is a UI component dev environment for your app.</p>
      <p>
        We've added some basic stories inside the <InlineCode>src/stories</InlineCode> directory.
        <br />A story is a single state of one or more UI components. You can have as many stories
        as you want.
        <br />
        (Basically a story is like a visual test case.)
      </p>
      <p>
        See these sample{' '}
        {vnode.attrs.showApp ? (
          <NavButton onclick={vnode.attrs.showApp}>stories</NavButton>
        ) : (
          <StoryLink kind={vnode.attrs.showKind} story={vnode.attrs.showStory}>
            stories
          </StoryLink>
        )}{' '}
        for a component called <InlineCode>Button</InlineCode>.
      </p>
      <p>
        Just like that, you can add your own components as stories.
        <br />
        You can also edit those components and see changes right away.
        <br />
        (Try editing the <InlineCode>Button</InlineCode> stories located at{' '}
        <InlineCode>src/stories/index.js</InlineCode>
        .)
      </p>
      <p>
        Usually we create stories with smaller UI components in the app.
        <br />
        Have a look at the{' '}
        <Link
          href="https://storybook.js.org/basics/writing-stories"
          target="_blank"
          rel="noopener noreferrer"
        >
          Writing Stories
        </Link>{' '}
        section in our documentation.
      </p>
      <Note>
        <b>NOTE:</b>
        <br />
        Have a look at the <InlineCode>.storybook/webpack.config.js</InlineCode> to add webpack
        loaders and plugins you are using in this project.
      </Note>
    </Main>
  ),
};

export default Welcome;
