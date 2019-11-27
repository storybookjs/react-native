import { DocDirective } from './doc-directive.directive';

export default {
  title: 'DocDirective',
  component: DocDirective,
  parameters: { docs: { iframeHeight: 120 } },
};

const modules = {
  declarations: [DocDirective],
};

export const Basic = () => ({
  moduleMetadata: modules,
  template: '<div docDirective [hasGrayBackground]="true"><h1>DocDirective</h1></div>',
});
