import {
  enableProdMode,
  NgModule,
  Component,
  NgModuleRef,
  ApplicationRef
} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app.component";
import { ErrorComponent } from "./components/error.component";
import { NoPreviewComponent } from "./components/no-preview.component";
import { STORY } from "./app.token";
let platform = null;
let lastModule = null;

const getComponentMetadata = ({ component, props = {}, propsMeta = {} }) => {
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
    componentMeta: componentMetadata,
    propsMeta: propsMetadata,
    params: paramsMetadata
  };
};

const getAnnotatedComponent = (meta, component, propsMeta, params) => {
  const NewComponent: any = function NewComponent(...args) {
    component.call(this, ...args);
  };
  NewComponent.prototype = Object.create(component.prototype);
  NewComponent.annotations = [new Component(meta)];
  NewComponent.parameters = params;
  NewComponent.propsMetadata = propsMeta;
  return NewComponent;
};

const getModule = (declarations, entryComponents, bootstrap, data) => {
  const moduleMeta = new NgModule({
    declarations: [...declarations],
    imports: [BrowserModule],
    providers: [{ provide: STORY, useValue: Object.assign({}, data) }],
    entryComponents: [...entryComponents],
    bootstrap: [...bootstrap]
  });

  const NewModule: any = function NewModule() {};
  NewModule.annotations = [moduleMeta];

  return NewModule;
};

const initModule = (currentStory, context) => {
  const {
    component,
    componentMeta,
    props,
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
    [AppComponent, AnnotatedComponent],
    [AnnotatedComponent],
    [AppComponent],
    story
  );
  return Module;
};

const draw = newModule => {
  if (!platform || !lastModule) {
    try {
      enableProdMode();
    } catch (e) {}

    platform = platformBrowserDynamic();
    lastModule = platform.bootstrapModule(newModule);
  } else {
    lastModule.then(ngModule => {
      if (!ngModule._destroyed) ngModule.destroy();

      const body = document.body;
      const app = document.createElement("my-app");
      body.appendChild(app);
      lastModule = platform.bootstrapModule(newModule);
    });
  }
};

export function renderNgError(error) {
  const errorData = {
    component: null,
    props: {
      message: error.message,
      stack: error.stack
    },
    propsMeta: {}
  };

  const Module = getModule([ErrorComponent], [], [ErrorComponent], errorData);

  draw(Module);
}

export function renderNoPreview() {
  const Module = getModule(
    [NoPreviewComponent],
    [],
    [NoPreviewComponent],
    {}
  );

  draw(Module);
}

export function renderNgApp(story, context) {
  draw(initModule(story, context));
}