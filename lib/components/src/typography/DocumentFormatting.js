import React from 'react';
import { styled, css } from '@storybook/theming';

const Wrapper = styled.div(
  props => css`
    /* Custom styles atop GitHub base theme (see below) */
    font-size: ${props.theme.typography.size.s2}px;
    line-height: 1.6;

    h1 {
      font-size: ${props.theme.typography.size.l1}px;
      font-weight: ${props.theme.typography.weight.black};
    }

    h2 {
      font-size: ${props.theme.typography.size.m2}px;
      border-bottom: 1px solid ${props.theme.appBorderColor};
    }

    h3 {
      font-size: ${props.theme.typography.size.m1}px;
    }

    h4 {
      font-size: ${props.theme.typography.size.s3}px;
    }

    h5 {
      font-size: ${props.theme.typography.size.s2}px;
    }

    h6 {
      font-size: ${props.theme.typography.size.s2}px;
      color: ${props.theme.color.dark};
    }

    /* Custom for SB SyntaxHighlighter */

    pre:not(.hljs) {
      background: transparent;
      border: none;
      border-radius: 0;
      padding: 0;
      margin: 0;
    }

    pre pre,
    pre.hljs {
      padding: 15px;
      margin: 0;

      white-space: pre-wrap;
      color: ${props.theme.color.darkest};

      font-size: 13px;
      line-height: 19px;

      code {
        color: inherit;
        font-size: inherit;
      }
    }

    pre code {
      margin: 0;
      padding: 0;
      white-space: pre;
      border: none;
      background: transparent;
    }

    pre code,
    pre tt {
      background-color: transparent;
      border: none;
    }

    /* GitHub inspired Markdown styles loosely from https://gist.github.com/tuzz/3331384 */

    body > *:first-of-type {
      margin-top: 0 !important;
    }

    body > *:last-child {
      margin-bottom: 0 !important;
    }

    a {
      color: ${props.theme.color.secondary};
      text-decoration: none;
    }

    a.absent {
      color: #cc0000;
    }

    a.anchor {
      display: block;
      padding-left: 30px;
      margin-left: -30px;
      cursor: pointer;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 20px 0 10px;
      padding: 0;
      cursor: text;
      position: relative;
    }

    h2:first-of-type,
    h1:first-of-type,
    h1:first-of-type + h2,
    h3:first-of-type,
    h4:first-of-type,
    h5:first-of-type,
    h6:first-of-type {
      margin-top: 0;
      padding-top: 0;
    }

    h1:hover a.anchor,
    h2:hover a.anchor,
    h3:hover a.anchor,
    h4:hover a.anchor,
    h5:hover a.anchor,
    h6:hover a.anchor {
      text-decoration: none;
    }

    h1 tt,
    h1 code {
      font-size: inherit;
    }

    h2 tt,
    h2 code {
      font-size: inherit;
    }

    h3 tt,
    h3 code {
      font-size: inherit;
    }

    h4 tt,
    h4 code {
      font-size: inherit;
    }

    h5 tt,
    h5 code {
      font-size: inherit;
    }

    h6 tt,
    h6 code {
      font-size: inherit;
    }

    p,
    blockquote,
    ul,
    ol,
    dl,
    li,
    table,
    pre {
      margin: 15px 0;
    }

    hr {
      border: 0 none;
      color: ${props.theme.appBorderColor};
      height: 4px;
      padding: 0;
    }

    body > h2:first-of-type {
      margin-top: 0;
      padding-top: 0;
    }

    body > h1:first-of-type {
      margin-top: 0;
      padding-top: 0;
    }

    body > h1:first-of-type + h2 {
      margin-top: 0;
      padding-top: 0;
    }

    body > h3:first-of-type,
    body > h4:first-of-type,
    body > h5:first-of-type,
    body > h6:first-of-type {
      margin-top: 0;
      padding-top: 0;
    }

    a:first-of-type h1,
    a:first-of-type h2,
    a:first-of-type h3,
    a:first-of-type h4,
    a:first-of-type h5,
    a:first-of-type h6 {
      margin-top: 0;
      padding-top: 0;
    }

    h1 p,
    h2 p,
    h3 p,
    h4 p,
    h5 p,
    h6 p {
      margin-top: 0;
    }

    li p.first {
      display: inline-block;
    }

    ul,
    ol {
      padding-left: 30px;
    }

    ul :first-of-type,
    ol :first-of-type {
      margin-top: 0;
    }

    ul :last-child,
    ol :last-child {
      margin-bottom: 0;
    }

    dl {
      padding: 0;
    }

    dl dt {
      font-size: 14px;
      font-weight: bold;
      font-style: italic;
      padding: 0;
      margin: 15px 0 5px;
    }

    dl dt:first-of-type {
      padding: 0;
    }

    dl dt > :first-of-type {
      margin-top: 0;
    }

    dl dt > :last-child {
      margin-bottom: 0;
    }

    dl dd {
      margin: 0 0 15px;
      padding: 0 15px;
    }

    dl dd > :first-of-type {
      margin-top: 0;
    }

    dl dd > :last-child {
      margin-bottom: 0;
    }

    blockquote {
      border-left: 4px solid ${props.theme.color.medium};
      padding: 0 15px;
      color: ${props.theme.color.dark};
    }

    blockquote > :first-of-type {
      margin-top: 0;
    }

    blockquote > :last-child {
      margin-bottom: 0;
    }

    table {
      padding: 0;
      border-collapse: collapse;
    }
    table tr {
      border-top: 1px solid ${props.theme.appBorderColor};
      background-color: white;
      margin: 0;
      padding: 0;
    }

    table tr:nth-of-type(2n) {
      background-color: ${props.theme.color.lighter};
    }

    table tr th {
      font-weight: bold;
      border: 1px solid ${props.theme.appBorderColor};
      text-align: left;
      margin: 0;
      padding: 6px 13px;
    }

    table tr td {
      border: 1px solid ${props.theme.appBorderColor};
      text-align: left;
      margin: 0;
      padding: 6px 13px;
    }

    table tr th :first-of-type,
    table tr td :first-of-type {
      margin-top: 0;
    }

    table tr th :last-child,
    table tr td :last-child {
      margin-bottom: 0;
    }

    img {
      max-width: 100%;
    }

    span.frame {
      display: block;
      overflow: hidden;
    }

    span.frame > span {
      border: 1px solid ${props.theme.color.medium};
      display: block;
      float: left;
      overflow: hidden;
      margin: 13px 0 0;
      padding: 7px;
      width: auto;
    }

    span.frame span img {
      display: block;
      float: left;
    }

    span.frame span span {
      clear: both;
      color: ${props.theme.color.darkest};
      display: block;
      padding: 5px 0 0;
    }

    span.align-center {
      display: block;
      overflow: hidden;
      clear: both;
    }

    span.align-center > span {
      display: block;
      overflow: hidden;
      margin: 13px auto 0;
      text-align: center;
    }

    span.align-center span img {
      margin: 0 auto;
      text-align: center;
    }

    span.align-right {
      display: block;
      overflow: hidden;
      clear: both;
    }

    span.align-right > span {
      display: block;
      overflow: hidden;
      margin: 13px 0 0;
      text-align: right;
    }

    span.align-right span img {
      margin: 0;
      text-align: right;
    }

    span.float-left {
      display: block;
      margin-right: 13px;
      overflow: hidden;
      float: left;
    }

    span.float-left span {
      margin: 13px 0 0;
    }

    span.float-right {
      display: block;
      margin-left: 13px;
      overflow: hidden;
      float: right;
    }

    span.float-right > span {
      display: block;
      overflow: hidden;
      margin: 13px auto 0;
      text-align: right;
    }

    code,
    tt {
      margin: 0 2px;
      padding: 0 5px;
      white-space: nowrap;
      border: 1px solid ${props.theme.color.mediumlight};
      background-color: ${props.theme.color.lighter};
      border-radius: 3px;
    }
  `
);

const StyledMarkdown = props => <Wrapper {...props} />;

export default StyledMarkdown;
