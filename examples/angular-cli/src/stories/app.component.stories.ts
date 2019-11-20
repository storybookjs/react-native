import { AppComponent } from '../app/app.component';

export default {
  title: 'App Component',
  component: AppComponent,
};

export const ComponentWithSeparateTemplate = () => ({
  component: AppComponent,
  props: {},
});

ComponentWithSeparateTemplate.story = {
  name: 'Component with separate template',
  parameters: { docs: { iframeHeight: 400 } },
};
