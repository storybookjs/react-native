import styles from './styles';

function getComponentSelector(component) {
  // eslint-disable-next-line no-underscore-dangle
  return component.__annotations__[0].selector;
}

function getTemplate(metadata) {
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

function getModuleMetadata(metadata) {
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

export default function(metadataFn) {
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
