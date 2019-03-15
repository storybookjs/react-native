// todo the following packages need definition files or a TS migration
declare module '@storybook/components';

// There are no types for markdown-to-jsx
declare module 'markdown-to-jsx' {
  const Markdown: any;
  export default Markdown;
}
