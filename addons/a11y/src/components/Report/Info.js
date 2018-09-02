import React from 'react';
import PropTypes from 'prop-types';

import styled from '@emotion/styled';

const Wrapper = styled.div(({ theme }) => ({
  backgroundColor: theme.barFill,
  padding: '12px',
  marginBottom: '10px',
}));
const Help = styled.p({
  margin: '0 0 12px',
});
const Link = styled.a({
  marginTop: '12px',
  textDecoration: 'underline',
  color: 'inherit',
  display: 'block',
});

function Info({ item }) {
  return (
    <Wrapper>
      <Help>{item.help}</Help>
      <Link href={item.helpUrl} target="_blank">
        More info...
      </Link>
    </Wrapper>
  );
}

Info.propTypes = {
  item: PropTypes.shape({
    help: PropTypes.node,
    helpUrl: PropTypes.string,
  }).isRequired,
};

export default Info;
