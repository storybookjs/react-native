import React from 'react';
import PropTypes from 'prop-types';

const Main = (props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) => (
  <article
    {...props}
    style={{
      padding: 15,
      lineHeight: 1.4,
      fontFamily: '"Helvetica Neue", Helvetica, "Segoe UI", Arial, freesans, sans-serif',
      backgroundColor: '#fff',
    }}
  />
);

const Title = ({
  children,
  ...props
}: {
  children: string;
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>;
}) => <h1 {...props}>{children}</h1>;
Title.propTypes = {
  children: PropTypes.node,
};
Title.defaultProps = {
  children: undefined,
};

const Note = (
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
) => (
  <p
    {...props}
    style={{
      opacity: 0.5,
    }}
  />
);

const InlineCode = (
  props?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
) => (
  <code
    {...props}
    style={{
      fontSize: 15,
      fontWeight: 600,
      padding: '2px 5px',
      border: '1px solid #eae9e9',
      borderRadius: 4,
      backgroundColor: '#f3f2f2',
      color: '#3a3a3a',
    }}
  />
);

const Link = ({
  children,
  href,
  target,
  rel,
  ...props
}: {
  children: string;
  href: string;
  target: string;
  rel: string;
  props?: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
}) => (
  <a
    href={href}
    {...props}
    target={target}
    rel={rel}
    style={{
      color: '#1474f3',
      textDecoration: 'none',
      borderBottom: '1px solid #1474f3',
      paddingBottom: 2,
    }}
  >
    {children}
  </a>
);
Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
};
Link.defaultProps = {
  href: undefined,
  children: undefined,
};

const NavButton = ({
  children,
  onClick,
  ...props
}: {
  children: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  props?: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
}) => (
  <button
    {...props}
    type="button"
    onClick={onClick}
    style={{
      color: '#1474f3',
      textDecoration: 'none',
      borderBottom: '1px solid #1474f3',
      paddingBottom: 2,
      borderTop: 'none',
      borderRight: 'none',
      borderLeft: 'none',
      backgroundColor: 'transparent',
      padding: 0,
      cursor: 'pointer',
      font: 'inherit',
    }}
  >
    {children}
  </button>
);

NavButton.propTypes = {
  children: PropTypes.node,
};
NavButton.defaultProps = {
  children: undefined,
};

const Welcome = ({ showApp }: { showApp: () => void }) => (
  <Main>
    <Title>Welcome to storybook</Title>
    <p>This is a UI component dev environment for your app.</p>
    <p>
      We've added some basic stories inside the <InlineCode>src/stories</InlineCode> directory.
      <br />A story is a single state of one or more UI components. You can have as many stories as
      you want.
      <br />
      (Basically a story is like a visual test case.)
    </p>
    <p>
      See these sample <NavButton onClick={showApp}>stories</NavButton> for a component called{' '}
      <InlineCode>Button</InlineCode>.
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
);

Welcome.displayName = 'Welcome';
Welcome.propTypes = {
  showApp: PropTypes.func,
};
Welcome.defaultProps = {
  showApp: null,
};

export { Welcome as default };
