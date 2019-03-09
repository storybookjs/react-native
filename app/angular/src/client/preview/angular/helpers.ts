import { enableProdMode, NgModule, Component, NgModuleRef, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/app.component';
import { STORY } from './app.token';
import { NgModuleMetadata, IStoryFn, NgStory } from './types';

let platform: any = null;
let promises: Array<Promise<NgModuleRef<any>>> = [];

const moduleClass = class DynamicModule {};
const componentClass = class DynamicComponent {};

type DynamicComponentType = typeof componentClass;

const getModule = (
  declarations: Array<Type<any> | any[]>,
  entryComponents: Array<Type<any> | any[]>,
  bootstrap: Array<Type<any> | any[]>,
  data: NgStory,
  moduleMetadata: NgModuleMetadata
) => {
  const moduleMeta = {
    declarations: [...declarations, ...(moduleMetadata.declarations || [])],
    imports: [BrowserModule, FormsModule, ...(moduleMetadata.imports || [])],
    providers: [{ provide: STORY, useValue: { ...data } }, ...(moduleMetadata.providers || [])],
    entryComponents: [...entryComponents, ...(moduleMetadata.entryComponents || [])],
    schemas: [...(moduleMetadata.schemas || [])],
    bootstrap: [...bootstrap],
  };

  return NgModule(moduleMeta)(moduleClass);
};

const createComponentFromTemplate = (template: string, styles: string[]) => {
  return Component({
    template,
    styles,
  })(componentClass);
};

const initModule = (storyFn: IStoryFn) => {
  const storyObj = storyFn();
  const { component, template, props, styles, moduleMetadata = {} } = storyObj;

  let AnnotatedComponent = template ? createComponentFromTemplate(template, styles) : component;

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

const staticRoot = document.getElementById('root');
const insertDynamicRoot = () => {
  const app = document.createElement('storybook-dynamic-app-root');
  staticRoot.appendChild(app);
};

const draw = (newModule: DynamicComponentType): void => {
  if (!platform) {
    insertDynamicRoot();
    try {
      enableProdMode();
    } catch (e) {}

    platform = platformBrowserDynamic();
    promises.push(platform.bootstrapModule(newModule));
  } else {
    Promise.all(promises).then(modules => {
      modules.forEach(mod => mod.destroy());

      insertDynamicRoot();
      promises = [];
      promises.push(platform.bootstrapModule(newModule));
    });
  }
};

export const renderNgApp = (storyFn: IStoryFn) => {
  draw(initModule(storyFn));
};
