import { AppComponent } from '../app/app.component';

export default {
  title: 'App Component',
};

export const componentWithSeparateTemplate = () => ({
  component: AppComponent,
  props: {},
});

componentWithSeparateTemplate.story = {
  name: 'Component with separate template',
};
