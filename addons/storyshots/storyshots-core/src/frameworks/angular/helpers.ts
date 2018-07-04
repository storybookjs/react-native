import { Component, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { STORY } from './app.token';
import { NgStory } from './types';

const getModuleMeta = (
  declarations: Array<Type<any> | any[]>,
  entryComponents: Array<Type<any> | any[]>,
  bootstrap: Array<Type<any> | any[]>,
  data: NgStory,
  moduleMetadata: any
) => {
  return {
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
};

const createComponentFromTemplate = (template: string): Function => {
  const componentClass = class DynamicComponent {};

  return Component({
    template: template,
  })(componentClass);
};

export const initModuleData = (storyObj: NgStory): any => {
  const { component, template, props, moduleMetadata = {} } = storyObj;

  let AnnotatedComponent;

  if (template) {
    AnnotatedComponent = createComponentFromTemplate(template);
  } else {
    AnnotatedComponent = component;
  }

  const story = {
    component: AnnotatedComponent,
    props,
  };

  const moduleMeta = getModuleMeta(
    [AppComponent, AnnotatedComponent],
    [AnnotatedComponent],
    [AppComponent],
    story,
    moduleMetadata
  );

  return {
    AppComponent,
    moduleMeta,
  };
};
