import { css } from '@emotion/core';
import { baseFonts, monoFonts } from './base';
import memoize from 'memoizerific';

export const createGlobal = memoize(1)(
  ({ color, background, typography }) => css`
    body {
      font-family: ${baseFonts.fontFamily};
      font-size: ${typography.size.s3}px;
      margin: 0;
      overflow-y: auto;
      overflow-x: hidden;

      color: ${color.darkest};
      background: ${background.app};

      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-tap-highlight-color: transparent;
      -webkit-overflow-scrolling: touch;

      * {
        box-sizing: border-box;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: ${typography.weight.regular};
        margin: 0;
        padding: 0;
      }

      button,
      input,
      textarea,
      select {
        outline: none;
        font-family: inherit;
        font-size: inherit;
      }

      sub,
      sup {
        font-size: 0.8em;
      }

      sub {
        bottom: -0.2em;
      }

      sup {
        top: -0.2em;
      }

      b,
      em {
        font-weight: ${typography.weight.bold};
      }

      hr {
        border: none;
        border-top: 1px solid ${color.border};
        clear: both;
        margin-bottom: 1.25rem;
      }

      code,
      pre {
        font-family: ${monoFonts.fontFamily};
        font-size: 90%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      code {
        display: inline-block;
        padding-left: 2px;
        padding-right: 2px;
        vertical-align: baseline;

        color: ${color.secondary};
      }

      pre {
        line-height: 18px;
        padding: 11px 1rem;
        white-space: pre-wrap;

        color: ${color.darkest};
        border-radius: 3px;
        margin: 1rem 0;
      }
      margin: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `
);
