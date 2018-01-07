import { Type, enableProdMode, NgModule, Component, NgModuleRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app.component';
import { ErrorComponent } from './components/error.component';
import { NoPreviewComponent } from './components/no-preview.component';
import { STORY } from './app.token';
import { getAnnotations, getParameters, getPropMetadata } from './utils';
import { NgModuleMetadata, NgStory, IGetStoryWithContext, IContext, NgProvidedData } from './types';

let platform: any = null;
let promises: Promise<NgModuleRef<any>>[] = [];

type IRenderStoryFn = (story: IGetStoryWithContext, context: IContext, reRender?: boolean) => void;
type IRenderErrorFn = (error: Error) => void;

interface IModule extends Type<any> {
  annotations: any[];
}
interface IComponent extends Type<any> {
  annotations: any[];
  parameters: any[];
  propsMetadata: any[];
}

// Taken from https://davidwalsh.name/javascript-debounce-function
// We don't want to pull underscore
const debounce = (
  func: IRenderStoryFn | IRenderErrorFn,
  wait: number = 100,
  immediate: boolean = false
): (() => void) => {
  let timeout: any;
  return function() {
    const context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
};

const getComponentMetadata = (
  { component, props = {}, propsMeta = {}, template = '', moduleMetadata = {
    imports: [],
    schemas: [],
    declarations: [],
    providers: [],
  },
}: NgStory) => {
  if (!component || typeof component !== 'function') {
    throw new Error('No valid component provided');
  }

  const componentMetadata = getAnnotations(component)[0] || {};
  const propsMetadata = getPropMetadata(component);
  const paramsMetadata = getParameters(component);

  Object.keys(propsMeta).map(key => {
    (<any>propsMetadata)[key] = (<any>propsMeta)[key];
  });

  const { imports = [], schemas = [], declarations = [], providers = [] } = moduleMetadata;

  return {
    component,
    props,
    componentMeta: componentMetadata,
    propsMeta: propsMetadata,
    params: paramsMetadata,
    template,
    moduleMeta: {
      imports,
      schemas,
      declarations,
      providers,
    },
  };
};

const getModule = (declarations: Array<Type<any> | any[]>,
entryComponents: Array<Type<any> | any[]>,
bootstrap: Array<Type<any> | any[]>,
data: NgProvidedData,
moduleMetadata: NgModuleMetadata = {
  imports: [],
  schemas: [],
  declarations: [],
  providers: []
}): IModule => {
  const moduleMeta = new NgModule({
    declarations: [...declarations, ...moduleMetadata.declarations],
    imports: [BrowserModule, FormsModule, ...moduleMetadata.imports],
    providers: [{ provide: STORY, useValue: Object.assign({}, data) }, ...moduleMetadata.providers],
    entryComponents: [...entryComponents],
    schemas: [...moduleMetadata.schemas],
    bootstrap: [...bootstrap],
  });

  const NewModule: any = function() {};
  (<IModule>NewModule).annotations = [moduleMeta];
  return NewModule;
};

const DYNAMIC_COMPONENT_SELECTOR = 'storybook-dynamic-component';
const createComponentFromTemplate = (
  template: string,
  propsMeta: object,
  params: any[],
  selector?: string,
) => {

  const metadata = new Component({
    selector: selector || DYNAMIC_COMPONENT_SELECTOR,
    template: template,
  });

  const NewComponent: any = function(...args: any[]) {};

  NewComponent.prototype = Object.create({});
  NewComponent.annotations = metadata
  NewComponent.parameters = params;
  NewComponent.propsMetadata = propsMeta;

  return NewComponent;
};

const initModule = (currentStory: IGetStoryWithContext, context: IContext, reRender: boolean): IModule => {
  const {
    component,
    componentMeta,
    props,
    propsMeta,
    params,
    moduleMeta,
    template
  } = getComponentMetadata(currentStory(context));

  if (!componentMeta) {
    throw new Error('No component metadata available');
  }

  let AnnotatedComponent;
  const declarations = [AppComponent];
  const entryComponents = [];

  if (template) {
    AnnotatedComponent = createComponentFromTemplate(template, propsMeta, params);
  } else {
    AnnotatedComponent = component;
  }

  const story = {
    component: AnnotatedComponent,
    props,
    propsMeta,
  };

  return getModule(
    [AppComponent, AnnotatedComponent, component],
    [AnnotatedComponent, component],
    [AppComponent],
    story,
    moduleMeta
  );
};

const draw = (newModule: IModule, reRender: boolean = true): void => {
  if (!platform) {
    try {
      enableProdMode();
    } catch (e) {}

    platform = platformBrowserDynamic();
    promises.push(platform.bootstrapModule(newModule));
  } else {
    Promise.all(promises).then(modules => {
      modules.forEach(mod => mod.destroy());

      const body = document.body;
      const app = document.createElement('storybook-dynamic-app-root');
      body.appendChild(app);
      promises = [];
      promises.push(platform.bootstrapModule(newModule));
    });
  }
};

export const renderNgError = debounce((error: Error) => {
  const errorData = {
    message: error.message,
    stack: error.stack,
  };

  const Module = getModule([ErrorComponent], [], [ErrorComponent], errorData);

  draw(Module);
});

export const renderNoPreview = debounce(() => {
  const Module = getModule([NoPreviewComponent], [], [NoPreviewComponent], {
    message: 'No Preview available.',
    stack: '',
  });

  draw(Module);
});

export const renderNgApp = debounce((story, context, reRender) => {
  draw(initModule(story, context, reRender), reRender);
});
