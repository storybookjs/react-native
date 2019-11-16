import { makeDecorator, StoryFn } from '@storybook/addons';
import { IStory } from '../angular.d';
import parameters from './parameters';
import styles from './styles';

function getComponentSelector(component: any) {
  // eslint-disable-next-line no-underscore-dangle
  return component.__annotations__[0].selector;
}

function getTemplate(metadata: any) {
  let tpl = '';
  if (metadata.component) {
    const selector = getComponentSelector(metadata.component);
    tpl = `<${selector}></${selector}>`;
  }

  if (metadata.template) {
    tpl = metadata.template;
  }

  return `      
      <div [ngStyle]="styles.style">
        <div [ngStyle]="styles.innerStyle">
          ${tpl}
        </div>
      </div>`;
}

function getModuleMetadata(metadata: any) {
  const { moduleMetadata, component } = metadata;

  if (component && !moduleMetadata) {
    return {
      declarations: [metadata.component],
    };
  }

  if (component && moduleMetadata) {
    return {
      ...moduleMetadata,
      declarations: [...moduleMetadata.declarations, metadata.component],
    };
  }

  return moduleMetadata;
}

function centered(metadataFn: StoryFn<IStory>) {
  const metadata = metadataFn();

  return {
    ...metadata,
    template: getTemplate(metadata),
    moduleMetadata: getModuleMetadata(metadata),
    props: {
      ...metadata.props,
      styles,
    },
  };
}

export default makeDecorator({
  ...parameters,
  wrapper: getStory => centered(getStory as StoryFn),
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
