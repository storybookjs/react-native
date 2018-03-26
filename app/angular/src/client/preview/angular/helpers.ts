import { enableProdMode, NgModule, Component, NgModuleRef, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app.component';
import { ErrorComponent } from './components/error.component';
import { NoPreviewComponent } from './components/no-preview.component';
import { STORY } from './app.token';
import {
  NgModuleMetadata,
  IGetStory,
  NgProvidedData,
  IRenderErrorFn,
  IRenderStoryFn,
} from './types';

let platform: any = null;
let promises: Promise<NgModuleRef<any>>[] = [];

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

const getModule = (
  declarations: Array<Type<any> | any[]>,
  entryComponents: Array<Type<any> | any[]>,
  bootstrap: Array<Type<any> | any[]>,
  data: NgProvidedData,
  moduleMetadata: NgModuleMetadata
) => {
  const moduleMeta = {
    declarations: [...declarations, ...(moduleMetadata.declarations || [])],
    imports: [BrowserModule, FormsModule, ...(moduleMetadata.imports || [])],
    providers: [
      { provide: STORY, useValue: Object.assign({}, data) },
      ...(moduleMetadata.providers || []),
    ],
    entryComponents: [...entryComponents, ...(moduleMetadata.entryComponents || [])],
    schemas: [...(moduleMetadata.schemas || [])],
    bootstrap: [...bootstrap],
  };

  const moduleClass = class DynamicModule {};

  return NgModule(moduleMeta)(moduleClass);
};

const createComponentFromTemplate = (template: string, styles: string[]): Function => {
  const componentClass = class DynamicComponent {};

  return Component({
    template,
    styles,
  })(componentClass);
};

const initModule = (currentStory: IGetStory, reRender: boolean = false): Function => {
  const storyObj = currentStory();
  const { component, template, props, styles, moduleMetadata = {} } = storyObj;

  let AnnotatedComponent;

  if (template) {
    AnnotatedComponent = createComponentFromTemplate(template, styles);
  } else {
    AnnotatedComponent = component;
  }

  const story = {
    component: AnnotatedComponent,
    props,
  };

  return getModule(
    [AppComponent, AnnotatedComponent],
    [AnnotatedComponent],
    [AppComponent],
    story,
    moduleMetadata
  );
};

const draw = (newModule: Function, reRender: boolean = true): void => {
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
  } as NgProvidedData;

  const Module = getModule([ErrorComponent], [], [ErrorComponent], errorData, {});

  draw(Module);
});

export const renderNoPreview = debounce(() => {
  const Module = getModule(
    [NoPreviewComponent],
    [],
    [NoPreviewComponent],
    {
      message: 'No Preview available.',
      stack: '',
    },
    {}
  );

  draw(Module);
});

export const renderNgApp = debounce((story, reRender) => {
  draw(initModule(story, reRender), reRender);
});
