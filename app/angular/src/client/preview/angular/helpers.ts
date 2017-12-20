import {
  Type,
  enableProdMode,
  NgModule,
  Component,
  NgModuleRef,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app.component";
import { ErrorComponent } from "./components/error.component";
import { NoPreviewComponent } from "./components/no-preview.component";
import { STORY, Data } from "./app.token";

let platform: any = null;
let promises: Promise<NgModuleRef<any>>[] = [];

export interface IContext {
  [p: string]: any
}

export type IGetStoryWithContext = (context: IContext) => Data
type IRenderStoryFn = (story: IGetStoryWithContext, context: IContext, reRender?: boolean) => void;
type IRenderErrorFn = (error: Error) => void;

interface IModule extends Type<any> {
  annotations: any[];
}
interface IComponent extends Type<any> {
  annotations: any[];
  parameters: any[];
  propsMetadata: any[]
  
}

// Taken from https://davidwalsh.name/javascript-debounce-function
// We don't want to pull underscore
const debounce = (func: IRenderStoryFn | IRenderErrorFn,
                  wait: number = 100,
                  immediate: boolean = false): () => void => {
  var timeout: any;
  return function () {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const getComponentMetadata = ({ component, props = {}, propsMeta = {}, pipes = [] }: Data) => {
  if (!component || typeof component !== "function")
    throw new Error("No valid component provided");

  const componentMetadata =
    component.__annotations__[0] || component.annotations[0] || {};
  const propsMetadata =
    component.__prop__metadata__ || component.propMetadata || {};
  const paramsMetadata = component.__parameters__ || component.parameters || [];

  Object.keys(propsMeta).map(key => {
    propsMetadata[key] = propsMeta[key];
  });

  return {
    component,
    props,
    pipes,
    componentMeta: componentMetadata,
    propsMeta: propsMetadata,
    params: paramsMetadata
  };
};

const getAnnotatedComponent = (meta: NgModule,
                               component: any,
                               propsMeta: { [p: string]: any },
                               params: any[]): IComponent => {
  const NewComponent: any = function NewComponent(...args: any[]) {
    component.call(this, ...args);
  };
  NewComponent.prototype = Object.create(component.prototype);
  NewComponent.annotations = [new Component(meta)];
  NewComponent.parameters = params;
  NewComponent.propsMetadata = propsMeta;
  return NewComponent;
};

const getModule = (declarations: Array<Type<any> | any[]>,
                   entryComponents: Array<Type<any> | any[]>,
                   bootstrap: Array<Type<any> | any[]>,
                   data: Data): IModule => {
  const moduleMeta = new NgModule({
    declarations: [...declarations],
    imports: [BrowserModule],
    providers: [{ provide: STORY, useValue: Object.assign({}, data) }],
    entryComponents: [...entryComponents],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [...bootstrap]
  });

  const NewModule: any = function NewModule() {};
  (<IModule>NewModule).annotations = [moduleMeta];

  return NewModule;
};

const initModule = (currentStory: IGetStoryWithContext, context: IContext, reRender: boolean): IModule => {
  const {
    component,
    componentMeta,
    props,
    pipes,
    propsMeta,
    params
  } = getComponentMetadata(currentStory(context));

  if (!componentMeta) throw new Error("No component metadata available");

  const AnnotatedComponent = getAnnotatedComponent(
    componentMeta,
    component,
    propsMeta,
    params
  );

  const story = {
    component: AnnotatedComponent,
    props,
    propsMeta
  };
  const Module = getModule(
    [AppComponent, AnnotatedComponent, ...pipes],
    [AnnotatedComponent],
    [AppComponent],
    story
  );
  return Module;
};

const draw = (newModule: IModule, reRender: boolean = true): void => {
  if (!platform) {
    try {
      enableProdMode();
    } catch (e) {}

    platform = platformBrowserDynamic();
    promises.push(platform.bootstrapModule(newModule))
  } else {
    Promise.all(promises)
      .then((modules) => {
        modules.forEach(mod => mod.destroy());
        
        const body = document.body;
        const app = document.createElement("my-app");
        body.appendChild(app);
        promises = [];
        promises.push(platform.bootstrapModule(newModule));
      });
  }
};

export const renderNgError = debounce((error: Error) => {
  const errorData = {
    component: <any>null,
    props: {
      message: error.message,
      stack: error.stack
    },
    propsMeta: {}
  };

  const Module = getModule([ErrorComponent], [], [ErrorComponent], errorData);

  draw(Module);
});

export const renderNoPreview = debounce(() => {
  const Module = getModule(
    [NoPreviewComponent],
    [],
    [NoPreviewComponent],
    <Data>{}
  );

  draw(Module);
});

export const renderNgApp = debounce((story, context, reRender) => {
  draw(initModule(story, context, reRender), reRender);
});