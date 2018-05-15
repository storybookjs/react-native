import React from 'react';
import PropTypes from 'prop-types';

import styled from 'react-emotion';

const gripSize = 1;
const splitSize = 10;

const Wrapper = styled('div')(({ shift, direction }) => {
  switch (direction) {
    case 'horizontal': {
      return {
        height: splitSize,
        marginTop: shift - splitSize / 2,
        marginBottom: -shift - splitSize / 2,
        position: 'relative',
      };
    }
    case 'vertical':
    default: {
      return {
        width: splitSize,
        marginLeft: shift - splitSize / 2,
        marginRight: -shift - splitSize / 2,
        position: 'relative',
      };
    }
  }
});

const Inner = styled('div')(({ direction, theme }) => {
  switch (direction) {
    case 'horizontal': {
      return {
        height: gripSize,
        width: 20,
        top: splitSize / 2 - (gripSize + 2) / 2,
        left: '50%',
        position: 'absolute',
        borderTop: theme.mainBorder,
        borderBottom: theme.mainBorder,
        borderTopWidth: 1,
        borderBottomWidth: 1,
      };
    }
    case 'vertical':
    default: {
      return {
        width: gripSize,
        height: 20,
        left: splitSize / 2 - (gripSize + 2) / 2,
        top: '50%',
        position: 'absolute',
        borderLeft: theme.mainBorder,
        borderRight: theme.mainBorder,
        borderLeftWidth: 1,
        borderRightWidth: 1,
      };
    }
  }
});

const USplit = ({ shift, split }) => (
  <Wrapper direction={split} shift={shift}>
    <Inner direction={split} />
  </Wrapper>
);

USplit.propTypes = {
  shift: PropTypes.number,
  split: PropTypes.oneOf(['vertical', 'horizontal']),
};

USplit.defaultProps = {
  shift: 0,
  split: 'vertical',
};

export default USplit;
