import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const Img = styled.img(
  ({ inline }) => (inline ? { display: 'inline-block' } : { display: 'block' }),
  ({ bordered }) =>
    bordered
      ? {
          padding: 5,
          border: '1px solid silver',
          borderRadius: 3,
        }
      : {}
);

const Image = ({ src, alt, ...rest }) => <Img src={src} alt={alt} {...rest} />;

Image.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
};

Image.defaultProps = {};

export default Image;
