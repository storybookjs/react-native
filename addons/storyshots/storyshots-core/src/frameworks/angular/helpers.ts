/* eslint-disable import/no-extraneous-dependencies */
import { Component, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { STORY } from './app.token';
import { NgStory } from './types';

const getModuleMeta = (
  declarations: (Type<any> | any[])[],
  entryComponents: (Type<any> | any[])[],
  bootstrap: (Type<any> | any[])[],
  data: NgStory,
  moduleMetadata: any
) => {
  return {
    declarations: [...declarations, ...(moduleMetadata.declarations || [])],
    imports: [BrowserModule, FormsModule, ...(moduleMetadata.imports || [])],
    providers: [{ provide: STORY, useValue: { ...data } }, ...(moduleMetadata.providers || [])],
    entryComponents: [...entryComponents, ...(moduleMetadata.entryComponents || [])],
    schemas: [...(moduleMetadata.schemas || [])],
    bootstrap: [...bootstrap],
  };
};

const createComponentFromTemplate = (template: string) => {
  const componentClass = class DynamicComponent {};

  return Component({
    template,
  })(componentClass);
};

export const initModuleData = (storyObj: NgStory): any => {
  const {
    component,
    template,
    props,
    moduleMetadata = {},
    requiresComponentDeclaration = true,
  } = storyObj;

  const isCreatingComponentFromTemplate = Boolean(template);

  const AnnotatedComponent = isCreatingComponentFromTemplate
    ? createComponentFromTemplate(template)
    : component;

  const componentDeclarations =
    isCreatingComponentFromTemplate || requiresComponentDeclaration
      ? [AppComponent, AnnotatedComponent]
      : [AppComponent];

  const story = {
    component: AnnotatedComponent,
    props,
  };

  const moduleMeta = getModuleMeta(
    componentDeclarations,
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
