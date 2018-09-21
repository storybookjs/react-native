import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import memoize from 'memoizerific';

const modifiers = {
  underline: {
    textDecoration: 'underline',
  },
  uppercase: {
    textTransform: 'uppercase',
  },
};

const types = {
  page: ({ theme }) => ({
    color: theme.mainTextColor,
    lineHeight: '1em',
    '& > sub': {
      color: theme.dimmedTextColor,
    },
  }),
  section: ({ theme }) => ({
    color: theme.dimmedTextColor,
    letterSpacing: 4.3,
    fontWeight: 400,
    fontSize: 10,
  }),
};

const getElement = memoize(50)((el, type, mods) =>
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
    mods.split(',').reduce((acc, item) => ({ ...acc, ...(modifiers[item] || {}) }), {})
  )
);

const Container = styled.header({});

const Heading = ({ type, el, sub, mods, children, ...rest }) => {
  const Element = getElement(el, type, mods.join(','));
  return (
    <Container {...rest}>
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
  mods: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(modifiers))),
  el: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'span', 'div']),
  children: PropTypes.node.isRequired,
};
Heading.defaultProps = {
  sub: false,
  type: 'page',
  mods: [],
  el: 'h1',
};

export { Heading as default };
