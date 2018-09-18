import styled from '@emotion/styled';

const Svg = styled.svg(
  ({ inline }) =>
    inline
      ? {
          display: 'inline-block',
        }
      : {
          display: 'block',
        }
);
Svg.displayName = 'Svg';

export { Svg as default };
