/* eslint-disable import/no-extraneous-dependencies */
import { Component, Type, NgModule } from '@angular/core';
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
const extractNgModuleMetadata = (importItem: any): NgModule => {
  const decoratorKey = '__annotations__';
  const decorators: any[] =
    Reflect && Reflect.getOwnPropertyDescriptor
      ? Reflect.getOwnPropertyDescriptor(importItem, decoratorKey).value
      : importItem[decoratorKey];

  if (!decorators || decorators.length === 0) {
    return null;
  }

  const ngModuleDecorator: NgModule | undefined = decorators.find(
    decorator => decorator instanceof NgModule
  );
  if (!ngModuleDecorator) {
    return null;
  }
  return ngModuleDecorator;
};

const getExistenceOfComponentInModules = (
  component: any,
  declarations: any[],
  imports: any[]
): boolean => {
  if (declarations && declarations.some(declaration => declaration === component)) {
    // Found component in declarations array
    return true;
  }
  if (!imports) {
    return false;
  }

  return imports.some(importItem => {
    const extractedNgModuleMetadata = extractNgModuleMetadata(importItem);
    if (!extractedNgModuleMetadata) {
      // Not an NgModule
      return false;
    }
    return getExistenceOfComponentInModules(
      component,
      extractedNgModuleMetadata.declarations,
      extractedNgModuleMetadata.imports
    );
  });
};

export const initModuleData = (storyObj: NgStory): any => {
  const { component, template, props, moduleMetadata = {} } = storyObj;

  const isCreatingComponentFromTemplate = Boolean(template);

  const AnnotatedComponent = isCreatingComponentFromTemplate
    ? createComponentFromTemplate(template)
    : component;

  const componentRequiesDeclaration =
    isCreatingComponentFromTemplate ||
    !getExistenceOfComponentInModules(
      component,
      moduleMetadata.declarations,
      moduleMetadata.imports
    );

  const componentDeclarations = componentRequiesDeclaration
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
