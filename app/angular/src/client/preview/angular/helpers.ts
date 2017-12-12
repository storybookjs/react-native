import {
  enableProdMode,
  NgModule,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModuleRef,
  ApplicationRef
} from "@angular/core";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app.component";
import { ErrorComponent } from "./components/error.component";
import { NoPreviewComponent } from "./components/no-preview.component";
import { STORY } from "./app.token";
import { getAnnotations, getParameters, getPropMetadata } from './utils';
import { NgModuleMetadata, NgStory } from "./types";

let platform = null;
let promises = [];

// Taken from https://davidwalsh.name/javascript-debounce-function
// We don't want to pull underscore

const debounce = (func, wait = 100, immediate = false) => {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const getComponentMetadata = (
  { component, props = {}, propsMeta = {}, moduleMetadata }: NgStory
) => {
  if (!component || typeof component !== "function")
    throw new Error("No valid component provided");

  const componentMetadata = getAnnotations(component)[0] || {};
  const propsMetadata = getPropMetadata(component);
  const paramsMetadata = getParameters(component);

  Object.keys(propsMeta).map(key => {
    propsMetadata[key] = propsMeta[key];
  });

  const {
    imports = [],
    schemas = [],
    declarations = [],
    providers = []
  } = moduleMetadata || {};

  return {
    component,
    props,
    componentMeta: componentMetadata,
    propsMeta: propsMetadata,
    params: paramsMetadata,
    moduleMeta: {
      imports,
      schemas,
      declarations,
      providers
    }
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

const getModule = (declarations, entryComponents, bootstrap, data, moduleMetadata: NgModuleMetadata = {
  imports: [],
  schemas: [],
  declarations: [],
  providers: []
}) => {
  const moduleMeta = new NgModule({
    declarations: [...declarations, ...moduleMetadata.declarations],
    imports: [BrowserModule, ...moduleMetadata.imports],
    providers: [{ provide: STORY, useValue: Object.assign({}, data) }, ...moduleMetadata.providers],
    entryComponents: [...entryComponents],
    schemas: [...moduleMetadata.schemas],
    bootstrap: [...bootstrap]
  });

  const NewModule: any = function NewModule() {};

  NewModule.annotations = [moduleMeta];

  return NewModule;
};

const initModule = (currentStory, context, reRender) => {
  const {
    component,
    componentMeta,
    props,
    propsMeta,
    params,
    moduleMeta
  } = getComponentMetadata(currentStory(context));

  if (!componentMeta) throw new Error("No component metadata available");

  const AnnotatedComponent = getAnnotatedComponent(
    componentMeta,
    component,
    propsMeta,
    [...params, ...moduleMeta.providers.map(provider => [provider])]
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
    story,
    moduleMeta
  );
  
  return Module;
};

const draw = (newModule, reRender = true) => {
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

export const renderNgError = debounce((error) => {
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
});

export const renderNoPreview = debounce(() => {
  const Module = getModule(
    [NoPreviewComponent],
    [],
    [NoPreviewComponent],
    {}
  );

  draw(Module);
});

export const renderNgApp = debounce((story, context, reRender) => {
  draw(initModule(story, context, reRender), reRender);
});