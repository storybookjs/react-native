import React from 'react';
import PropTypes from 'prop-types';

const Container = ({ children, title, age, isAmazing }) =>
  <div title={title}>
    {children}
    {isAmazing ? '!!!' : ''}
    {age
      ? <div>
          age = {age}
        </div>
      : null}
  </div>;

Container.propTypes = {
  children: PropTypes.node.isRequired,
  isAmazing: PropTypes.bool,
  age: PropTypes.number,
  title: PropTypes.string,
};
Container.defaultProps = {
  isAmazing: false,
  age: 0,
  title: 'the best container ever',
};

export default Container;
