/** @jsx h */
/* eslint-disable react/no-unknown-property */
import { h } from 'preact';

const Button = ({ children, ...props }) => (
  <button class="button" type="button" {...props}>
    {children}
  </button>
);

export default Button;
