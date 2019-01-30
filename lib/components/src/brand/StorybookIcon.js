import React from 'react';

export const StorybookIcon = ({ ...props }) => (
  <svg width="64px" height="64px" viewBox="0 0 64 64" {...props} title="Storybook icon">
    <defs>
      <path
        d="M2 58.6L0 6c0-1.7 1.3-3.2 3-3.3L47.6 0A3.2 3.2 0 0 1 51 3.2v57.2a3.2 3.2 0 0 1-3.3 3.2L5 61.6c-1.6 0-3-1.4-3-3z"
        id="a"
      />
    </defs>
    <g transform="translate(6.6 .2)" fill="none" fillRule="evenodd">
      <mask id="b" fill="#fff">
        <use xlinkHref="#a" />
      </mask>
      <use fill="#FF4785" fillRule="nonzero" xlinkHref="#a" />
      <path
        d="M37.7 7.8L38 .5 44 0l.3 7.6a.5.5 0 0 1-.8.4l-2.4-2-2.8 2.2a.5.5 0 0 1-.7-.4zM29.8 24c0 1.2 8.4.6 9.5-.3 0-8.4-4.5-12.9-12.8-12.9s-13 4.5-13 11.3c0 11.8 16 12 16 18.5 0 1.8-1 2.9-3 2.9-2.4 0-3.5-1.3-3.3-5.7 0-1-9.7-1.3-10 0-.8 10.6 5.9 13.7 13.5 13.7 7.4 0 13.2-4 13.2-11 0-12.7-16.2-12.3-16.2-18.6 0-2.6 1.9-2.9 3-2.9 1.2 0 3.3.2 3.1 5z"
        fill="#FFF"
        fillRule="nonzero"
        mask="url(#b)"
      />
    </g>
  </svg>
);
