import React from 'react';
import PropTypes from 'prop-types';

import glamorous from 'glamorous';

const gripSize = 1;
const splitSize = 10;

const Wrapper = glamorous.div(({ shift, direction }) => {
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

const Inner = glamorous.div(({ direction }) => {
  switch (direction) {
    case 'horizontal': {
      return {
        height: gripSize,
        width: 20,
        top: splitSize / 2 - (gripSize + 2) / 2,
        left: '50%',
        position: 'absolute',
        borderTop: 'solid 1px rgba(0,0,0,0.1)',
        borderBottom: 'solid 1px rgba(0,0,0,0.1)',
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
        borderLeft: 'solid 1px rgba(0,0,0,0.1)',
        borderRight: 'solid 1px rgba(0,0,0,0.1)',
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
