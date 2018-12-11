// todo the following packages need definition files or a TS migration
declare module '@storybook/addons';
declare module '@storybook/components';
declare module '@storybook/core-events';

// Only necessary for 0.x.x. Version 10.x.x has definition files included
declare module '@emotion/styled';

// There are no types for markdown-to-jsx
declare module 'markdown-to-jsx' {
  const Markdown: any;
  export default Markdown;
}
