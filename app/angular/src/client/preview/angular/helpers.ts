// @ts-ignore
import { document } from 'global';
import { enableProdMode, NgModule, Component, NgModuleRef, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { AppComponent } from './components/app.component';
import { STORY } from './app.token';
import { NgModuleMetadata, IStoryFn, NgStory } from './types';

let platform: any = null;
let promises: Promise<NgModuleRef<any>>[] = [];

const moduleClass = class DynamicModule {};
const componentClass = class DynamicComponent {};

type DynamicComponentType = typeof componentClass;

const storyData = new ReplaySubject(1);

const getModule = (
  declarations: (Type<any> | any[])[],
  entryComponents: (Type<any> | any[])[],
  bootstrap: (Type<any> | any[])[],
  data: NgStory,
  moduleMetadata: NgModuleMetadata
) => {
  storyData.next(data);

  const moduleMeta = {
    declarations: [...declarations, ...(moduleMetadata.declarations || [])],
    imports: [BrowserModule, FormsModule, ...(moduleMetadata.imports || [])],
    providers: [{ provide: STORY, useValue: storyData }, ...(moduleMetadata.providers || [])],
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
  const {
    component,
    template,
    props,
    styles,
    moduleMetadata = {},
    requiresComponentDeclaration = true,
  } = storyObj;

  const isCreatingComponentFromTemplate = Boolean(template);

  const AnnotatedComponent = isCreatingComponentFromTemplate
    ? createComponentFromTemplate(template, styles)
    : component;

  const componentDeclarations =
    isCreatingComponentFromTemplate || requiresComponentDeclaration
      ? [AppComponent, AnnotatedComponent]
      : [AppComponent];

  const story = {
    component: AnnotatedComponent,
    props,
  };

  return getModule(
    componentDeclarations,
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
    } catch (e) {
      //
    }

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

export const renderNgApp = (storyFn: IStoryFn, forced: boolean) => {
  if (!forced) {
    draw(initModule(storyFn));
  } else {
    storyData.next(storyFn());
  }
};
