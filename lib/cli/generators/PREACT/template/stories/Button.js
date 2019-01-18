/** @jsx h */
/* eslint-disable react/no-unknown-property, react/prop-types */
import { h } from 'preact';

const Button = ({ children, ...props }) => (
  <button class="button" type="button" {...props}>
    {children}
  </button>
);

export default Button;
