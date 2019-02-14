import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@storybook/theming';

const Wrapper = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  margin: '12px 0',
});

const Item = styled.div(({ theme }) => ({
  margin: '0 6px',
  padding: '5px',
  border: `1px solid ${theme.appBorderColor}`,
  borderRadius: theme.appBorderRadius,
}));

function Tags({ tags }) {
  return (
    <Wrapper>
      {tags.map(tag => (
        <Item key={tag}>{tag}</Item>
      ))}
    </Wrapper>
  );
}
Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.node).isRequired,
};

export default Tags;
