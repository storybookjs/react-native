// todo the following packages need definition files or a TS migration
declare module '@storybook/addons';
declare module '@storybook/components';
declare module '@storybook/core-events';

// There are no types for markdown-to-jsx
declare module 'markdown-to-jsx' {
  const Markdown: any;
  export default Markdown;
}
