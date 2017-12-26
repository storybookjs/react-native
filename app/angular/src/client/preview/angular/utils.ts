import {Type} from '@angular/core';

function getMeta(component: any, [name1, name2]: any, defaultValue: any) {
  if (!name2) {
    name2 = name1;
    name1 = `__${name1}__`;
  }

  if (component[name1]) {
    return component[name1];
  }

  if (component[name2]) {
    return component[name2];
  }

  return (<any>window)['Reflect'].getMetadata(name2, component) || defaultValue;
}

export function getAnnotations(component: any) {
  return getMeta(component, ['annotations'], []);
}

export function getPropMetadata(component: any) {
  return getMeta(component, ['__prop__metadata__', 'propMetadata'], {});
}

export function getParameters(component: any) {
  return parameters(component);
}

/**
 * @TODO refactor that
 * That code is copied from: angular/core/src/reflection/reflection_capabilities.ts
 */
const PARAMETERS = '__paramaters__';
function convertTsickleDecoratorIntoMetadata(decoratorInvocations: any[]): any[] {
  if (!decoratorInvocations) {
    return [];
  }
  return decoratorInvocations.map(decoratorInvocation => {
    const decoratorType = decoratorInvocation.type;
    const annotationCls = decoratorType.annotationCls;
    const annotationArgs = decoratorInvocation.args ? decoratorInvocation.args : [];
    return new (Function.prototype.bind.apply(annotationCls, [null].concat(annotationArgs)))();
  });
}

function getParentCtor(ctor: Function): Type<any> {
  const parentProto = Object.getPrototypeOf(ctor.prototype);
  const parentCtor = parentProto ? parentProto.constructor : null;
  // Note: We always use `Object` as the null value
  // to simplify checking later on.
  return parentCtor || Object;
}

function parameters(type: Type<any>): any {
  // Note: only report metadata if we have at least one class decorator
  // to stay in sync with the static reflector.
  if (typeof type !== 'function') {
    return [];
  }


  const parentCtor = getParentCtor(type);
  let _parameters = getOwnParameters(type, parentCtor);
  if (!_parameters && parentCtor !== Object && _parameters !== null) {
    _parameters = (<any>_parameters)(parentCtor);
  }
  return _parameters || [];
}

function _zipTypesAndAnnotations(paramTypes: any[], paramAnnotations: any[]): any[][] {
  let result: any[][];

  if (typeof paramTypes === 'undefined') {
    result = new Array(paramAnnotations.length);
  } else {
    result = new Array(paramTypes.length);
  }

  for (let i = 0; i < result.length; i++) {
    // TS outputs Object for parameters without types, while Traceur omits
    // the annotations. For now we preserve the Traceur behavior to aid
    // migration, but this can be revisited.
    if (typeof paramTypes === 'undefined') {
      result[i] = [];
    } else if (paramTypes[i] !== Object) {
      result[i] = [paramTypes[i]];
    } else {
      result[i] = [];
    }
    if (paramAnnotations && paramAnnotations[i] != null) {
      result[i] = result[i].concat(paramAnnotations[i]);
    }
  }
  return result;
}

const DELEGATE_CTOR = /^function\s+\S+\(\)\s*{[\s\S]+\.apply\(this,\s*arguments\)/;
function getOwnParameters(type: Type<any>, parentCtor: any): any[][] {
  // If we have no decorators, we only have function.length as metadata.
  // In that case, to detect whether a child class declared an own constructor or not,
  // we need to look inside of that constructor to check whether it is
  // just calling the parent.
  // This also helps to work around for https://github.com/Microsoft/TypeScript/issues/12439
  // that sets 'design:paramtypes' to []
  // if a class inherits from another class but has no ctor declared itself.
  if (DELEGATE_CTOR.exec(type.toString())) {
    return null;
  }

  // Prefer the direct API.
  if ((<any>type).parameters && (<any>type).parameters !== parentCtor.parameters) {
    return (<any>type).parameters;
  }

  if ((<any>type)['__parameters__']) {
    return getMeta(type, ['__parameters__'], {});
  }

  // API of tsickle for lowering decorators to properties on the class.
  const tsickleCtorParams = (<any>type).ctorParameters;
  if (tsickleCtorParams && tsickleCtorParams !== parentCtor.ctorParameters) {
    // Newer tsickle uses a function closure
    // Retain the non-function case for compatibility with older tsickle
    const ctorParameters =
      typeof tsickleCtorParams === 'function' ? tsickleCtorParams() : tsickleCtorParams;
    const paramTypes = ctorParameters.map((ctorParam: any) => ctorParam && ctorParam.type);
    const paramAnnotations = ctorParameters.map(
      (ctorParam: any) =>
        ctorParam && convertTsickleDecoratorIntoMetadata(ctorParam.decorators));
    return _zipTypesAndAnnotations(paramTypes, paramAnnotations);
  }

  // API for metadata created by invoking the decorators.
  const _paramAnnotations = type.hasOwnProperty(PARAMETERS) && (type as any)[PARAMETERS];
  const _paramTypes = (<any>window)['Reflect'] && (<any>window)['Reflect'].getOwnMetadata &&
    (<any>window)['Reflect'].getOwnMetadata('design:paramtypes', type);
  if (_paramTypes || _paramAnnotations) {
    return _zipTypesAndAnnotations(_paramTypes, _paramAnnotations);
  }

  // If a class has no decorators, at least create metadata
  // based on function.length.
  // Note: We know that this is a real constructor as we checked
  // the content of the constructor above.
  return new Array((<any>type.length)).fill(undefined);
}
