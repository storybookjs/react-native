import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import memoize from 'memoizee';

const modifiers = {
  underline: {},
};

const types = {
  page: ({ theme }) => ({
    color: theme.mainTextColor,
    lineHeight: '1em',
    '& > sub': {
      color: theme.dimmedTextColor,
    },
  }),
};

const getElement = memoize((el, type, ...mods) =>
  styled(el)(
    ({ theme }) => ({
      color: 'currentColor',
      fontWeight: 'normal',
      fontFamily: theme.mainTextFace,
      margin: 0,
      padding: 0,
      lineHeight: '1.2em',
      display: 'block',

      '& > sub': {
        display: 'block',
        paddingTop: 5,
        lineHeight: '1.2em',
        fontSize: 14,
      },
    }),
    p => types[type](p) || {},
    p => mods.reduce((acc, item) => ({ ...acc, ...(modifiers[item](p) || {}) }), {})
  )
);

const Container = styled.header({});

const Heading = ({ type = 'page', el = 'h1', sub, mods = [], children }) => {
  const Element = getElement(el, type, ...mods);

  return (
    <Container>
      <Element>
        {typeof children === 'string' ? <span>{children}</span> : children}
        {sub ? <sub>{sub}</sub> : null}
      </Element>
    </Container>
  );
};
Heading.propTypes = {
  sub: PropTypes.node,
  type: PropTypes.oneOf(Object.keys(types)),
  mods: PropTypes.arrayOf(Object.keys(modifiers)),
  el: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'span', 'div']),
  children: PropTypes.node.isRequired,
};
Heading.defaultProps = {
  sub: undefined,
  type: undefined,
  mods: undefined,
  el: undefined,
};

export { Heading as default };
