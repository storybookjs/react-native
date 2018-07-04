import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Button = styled('button')(({ theme }) => ({
  listStyle: 'none',
  backgroundColor: theme.barFill,
  textAlign: 'center',
  border: theme.mainBorder,
  borderRadius: theme.mainBorderRadius,
  color: 'inherit',
  cursor: 'pointer',
  display: 'inline-block',
  width: 175,
  verticalAlign: 'top',
  wordWrap: 'break-word',
  padding: 0,
  overflow: 'hidden',
}));

const Block = styled('div')(({ bg, theme }) => ({
  height: 80,
  transition: 'opacity 0.25s ease-in-out',
  borderBottom: theme.mainBorder,
  background: bg,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const Box = styled('div')({
  listStyle: 'none',
  paddingLeft: 10,
  paddingRight: 10,
});

const Name = styled('h4')({
  float: 'left',
  fontWeight: 'bold',
});
const Value = styled('h4')({
  float: 'right',
  fontWeight: 'normal',
});

const Swatch = ({ name, value, setBackground }) => (
  <Button onClick={() => setBackground(value)} onMouseDown={event => event.preventDefault()}>
    <Block bg={value} />
    <Box>
      <Name>{name}:</Name>
      <Value>
        <em>{value}</em>
      </Value>
    </Box>
  </Button>
);
Swatch.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setBackground: PropTypes.func.isRequired,
};

export default Swatch;
