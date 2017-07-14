import { enableProdMode, NgModule, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ErrorComponent } from './error.component';
import { NoPreviewComponent } from './no-preview.component';
import { STORY } from './app.token';

const getComponent = ({ component, props = {} }) => {
  if (!component || typeof component !== 'function')
    throw new Error('No valid component provided');

  const componentMeta = (<any>Reflect).getMetadata('annotations', component)[0];
  const propsMeta = (<any>Reflect).getMetadata('propMetadata', component);
  return {
    component,
    props,
    componentMeta,
    propsMeta
  }
}

const getAnnotatedComponent = (meta, component) => {
  @Component(meta)
  class NewComponent extends component {}

  return NewComponent;
}

const getModule = (declarations, entryComponents, bootstrap, data) => {
  @NgModule({
    declarations,
    imports: [
      BrowserModule,
    ],
    providers: [
       { provide: STORY, useValue: data }
    ],
    entryComponents,
    bootstrap,
  })
  class NewModule {}

  return NewModule;
}

export function renderNgError(error) {
  const errorData = {
    component: null,
    props: {
      message: error.message,
      stack: error.stack
    },
    propsMeta: {}
  }

  const Module = getModule(
    [ErrorComponent],
    [],
    [ErrorComponent],
    errorData
  );

  try {
    enableProdMode();
  } catch(e) {}

  platformBrowserDynamic().bootstrapModule(Module);
}

export function renderNoPreviewComponent() {
  const Module = getModule(
    [NoPreviewComponent],
    [],
    [NoPreviewComponent],
    {}
  );

  try {
    enableProdMode();
  } catch(e) {}

  platformBrowserDynamic().bootstrapModule(Module);
}

export function renderNgApp(element) {
  const { component, componentMeta, props, propsMeta } = getComponent(element);

  if (!componentMeta)
    throw new Error('No component metadata available');

  const AnnotatedComponent = getAnnotatedComponent(componentMeta, component); 
  const story = {
    component: AnnotatedComponent,
    props,
    propsMeta
  }
  const Module = getModule(
    [AppComponent, AnnotatedComponent],
    [AnnotatedComponent],
    [AppComponent],
    story
  );

  try {
    enableProdMode();
  } catch(e) {}

  platformBrowserDynamic().bootstrapModule(Module);
}