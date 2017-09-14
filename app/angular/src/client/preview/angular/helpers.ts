import {
  enableProdMode,
  NgModule,
  Component,
  NgModuleRef,
  ApplicationRef,
  CUSTOM_ELEMENTS_SCHEMA
} from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./components/app.component";
import { ErrorComponent } from "./components/error.component";
import { NoPreviewComponent } from "./components/no-preview.component";
import { STORY } from "./app.token";
let platform = null;
let promises = [];

// Taken from https://davidwalsh.name/javascript-debounce-function
// We don't want to pull underscore

const debounce = (func, wait = 100, immediate = false) => {
	var timeout;
	return function() {
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
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
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