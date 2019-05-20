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

export default function(metadataFn: any) {
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

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
