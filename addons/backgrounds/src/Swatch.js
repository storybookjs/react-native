import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const Button = styled('button')({
  listStyle: 'none',
  backgroundColor: '#fff',
  textAlign: 'center',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: 4,
  cursor: 'pointer',
  display: 'inline-block',
  width: 175,
  verticalAlign: 'top',
  wordWrap: 'break-word',
  padding: 0,
});
const Block = styled('div')(({ bg }) => ({
  height: 80,
  borderRadius: '4px 4px 0 0',
  transition: 'opacity 0.25s ease-in-out',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
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
