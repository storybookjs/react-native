// Fixes 'noImplicitAny' lint error because @storybook/addons isn't migrated to typescript yet
declare module '@storybook/addons';

// Only necessary for 0.x.x. Version 10.x.x has definition files included
declare module '@emotion/styled';
