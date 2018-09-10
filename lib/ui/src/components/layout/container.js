import React from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/core';

export const Root = styled.div({
  position: 'fixed',
  left: 0,
  top: 0,
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
});

export const GlobalStyles = () => (
  <Global
    styles={css`
      .Resizer {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .Resizer.horizontal {
        height: 10px;
        margin: -5px 0;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        cursor: row-resize;
        width: 100%;
      }
      .Resizer.horizontal::after {
        content: '';
        display: block;
        height: 2px;
        width: 20px;
        border-top: 1px solid rgba(0, 0, 0, 0.2);
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }

      .Resizer.vertical {
        width: 10px;
        margin: 0 -5px;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        cursor: col-resize;
      }
      .Resizer.vertical::after {
        content: '';
        display: block;
        width: 2px;
        height: 20px;
        border-left: 1px solid rgba(0, 0, 0, 0.2);
        border-right: 1px solid rgba(0, 0, 0, 0.2);
      }

      .Resizer.disabled {
        visibility: hidden;
      }
    `}
  />
);
