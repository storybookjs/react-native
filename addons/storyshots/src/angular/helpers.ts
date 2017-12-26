import {
  Type,
  NgModule,
  Component,
} from '@angular/core';

import { STORY } from './app.token';
import { getAnnotations, getParameters, getPropMetadata } from './utils';
import { NgModuleMetadata, NgStory, NgProvidedData } from './types';

interface IComponent extends Type<any> {
  annotations: any[];
  parameters: any[];
  propsMetadata: any[]
}

const getComponentMetadata = (
  { component, props = {}, propsMeta = {}, moduleMetadata = {
    imports: [],
    schemas: [],
    declarations: [],
    providers: []
  } }: NgStory
) => {
  if (!component || typeof component !== 'function') {
    throw new Error('No valid component provided');
  }

  const componentMetadata = getAnnotations(component)[0] || {};
  const propsMetadata = getPropMetadata(component);
  const paramsMetadata = getParameters(component);

  Object.keys(propsMeta).map(key => {
      (<any>propsMetadata)[key] = (<any>propsMeta)[key];
  });

  const {
    imports = [],
    schemas = [],
    declarations = [],
    providers = []
  } = moduleMetadata;

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

const getAnnotatedComponent = (meta: NgModule,
                               component: any,
                               propsMeta: { [p: string]: any },
                               params: any[]): IComponent => {
  const NewComponent: any = function NewComponent(...args: any[]) {
    component.call(this, ...args);
  };

  NewComponent.prototype = Object.create(component.prototype);
  NewComponent.annotations = [new Component(meta)];
  NewComponent.parameters = params;
  NewComponent.propsMetadata = propsMeta;

  return NewComponent;
};

const getModule = (
    declarations: Array<Type<any> | any[]>,
    entryComponents: Array<Type<any> | any[]>,
    bootstrap: Array<Type<any> | any[]>,
    data: NgProvidedData,
    moduleMetadata: NgModuleMetadata = {
      imports: [],
      schemas: [],
      declarations: [],
      providers: []
  }
): any => {
  return {
    declarations: [...declarations, ...moduleMetadata.declarations],
    imports: [...moduleMetadata.imports],
    providers: [{ provide: STORY, useValue: Object.assign({}, data) }, ...moduleMetadata.providers],
    entryComponents: [...entryComponents],
    schemas: [...moduleMetadata.schemas],
    bootstrap: [...bootstrap]
  };
};

export const initModuleData = (currentStory: NgStory): any => {
  const {
    component,
    componentMeta,
    props,
    propsMeta,
    params,
    moduleMeta
  } = getComponentMetadata(currentStory);

  if (!componentMeta) {
    throw new Error('No component metadata available');
  }

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

  return {
    AnnotatedComponent,
    moduleMeta: getModule(
      [AnnotatedComponent],
      [AnnotatedComponent],
      [],
      story,
      moduleMeta
    ),
  };
};
