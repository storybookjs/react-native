import React from 'react';
import { styled, css } from '@storybook/theming';

const Wrapper = styled.div(
  props => css`
    font-size: ${props.theme.typography.size.s2}px;
    line-height: 1.5;

    h1,
    h2,
    h3,
    h4 {
      line-height: 1em;

      & + * {
        margin-top: 0 !important;
      }
    }

    h2:not(:first-child) {
      margin-top: 2rem;
    }

    hr {
      margin: 3rem 0;
    }

    hr + * {
      margin-top: 0 !important;
    }

    h1 {
      font-size: ${props.theme.typography.size.l1}px;
      font-weight: ${props.theme.typography.weight.extrabold};

      margin-bottom: 0.5rem;
    }

    h2 {
      font-size: ${props.theme.typography.size.m1}px;
      font-weight: ${props.theme.typography.weight.extrabold};
      line-height: ${props.theme.typography.size.m3}px;
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: ${props.theme.typography.size.s3}px;
      font-weight: ${props.theme.typography.weight.bold};
      line-height: 28px;
      color: ${props.theme.color.darkest};
      margin: 1.5rem 0 0rem;
    }

    h4 {
      font-size: ${props.theme.typography.size.s3}px;
      font-weight: ${props.theme.typography.weight.bold};
      color: ${props.theme.color.dark};
      margin: 1.5rem 0 0rem;
    }

    p {
      margin: 1rem 0;
      position: relative;

      &:first-of-type:not(:only-of-type) {
        margin-top: 0;
      }
      &:only-of-type {
        margin: 0;
      }
    }

    ol,
    ul {
      list-style-position: outside;
      margin-bottom: 1rem;
      margin-top: 1rem;
      padding-left: 30px;

      li {
        margin-bottom: 0.5rem;
      }
    }

    ol {
      list-style-type: decimal;
    }
    ul {
      list-style-type: disc;
    }

    p a,
    li a,
    h1 a,
    h2 a,
    h3 a,
    h4 a,
    h5 a,
    h6 a {
      color: ${props.theme.color.secondary};
      transition: all 250ms ease-out;
      display: inline-block;
      text-decoration: none;
      transform: translate3d(0, 0, 0);

      &:hover {
        cursor: pointer;
        transform: translate3d(0, -1px, 0);
      }

      &:active {
        transform: translate3d(0, 0, 0);
      }

      &:visited {
        color: ${props.theme.color.secondary};
      }
    }

    figure {
      clear: both;
      margin: 1rem 0;

      figcaption {
        font-size: ${props.theme.typography.size.s1}px;
      }
    }

    img {
      display: block;
      padding: 0 20px;
      max-width: 100%;
      position: relative;
      vertical-align: top;
      margin: 0 auto;

      &.alignright {
        float: right;
        margin-right: 0;
      }

      &.alignleft {
        float: left;
        margin-left: 0;
      }

      &.aligncenter {
        display: block;
        margin-bottom: 1rem;
        margin-left: auto;
        margin-right: auto;
        margin-top: 1rem;
      }
    }

    pre:not(.hljs) {
      line-height: 18px;
      padding: 11px 1rem;
      white-space: pre-wrap;

      color: ${props.theme.color.darkest};
      background: ${props.theme.color.border};
      border-radius: 3px;
      margin: 1rem 0;

      code {
        color: inherit;
        font-size: inherit;
      }
    }

    code {
      color: ${props.theme.color.ancillary};
      font-size: 90%;
    }

    .aside {
      border: 1px solid ${props.theme.color.medium};
      border-radius: 4px;
      padding: 1em;
    }

    /* Tables based on GH markdown format */
    table {
      font-size: ${props.theme.typography.size.s2}px;
      padding: 0;
      border-collapse: collapse;
      width: 100%;
      margin: 2rem 0;
    }
    table tr {
      border-top: 1px solid ${props.theme.color.mediumlight};
      background-color: white;
      margin: 0;
      padding: 0;
    }
    table tr:nth-child(2n) {
      background-color: ${props.theme.color.lighter};
    }
    table tr th {
      font-weight: bold;
      border: 1px solid ${props.theme.color.medium};
      border-radius: 3px 3px 0 0;
      text-align: left;
      margin: 0;
      padding: 0.5rem 0.75rem;
    }
    table tr td {
      border: 1px solid #ddd;
      text-align: left;
      margin: 0;
      padding: 0.5rem 1rem;
    }

    table tr th :first-child,
    table tr td:first-child {
      margin-top: 0;
    }

    table tr th :last-child,
    table tr td:last-child {
      margin-bottom: 0;
    }
  `
);

const StyledMarkdown = props => <Wrapper {...props} />;

export default StyledMarkdown;
