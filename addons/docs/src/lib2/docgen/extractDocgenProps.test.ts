// import { extractProp } from './extractDocgenProps';
// import {
//   javaScriptFactory,
//   tsFactory,
//   flowFactory,
//   unknownFactory,
//   PropDefFactory,
// } from './createDocgenPropDef';
// import { DocgenInfo } from './types';

// const PROP_NAME = 'propName';

// function createDocgenInfo(overrides: Record<string, any> = {}): DocgenInfo {
//   return {
//     type: null,
//     required: true,
//     description: 'description',
//     defaultValue: {
//       value: 'default string',
//     },
//     ...overrides,
//   };
// }

// interface TypeSystemDef {
//   name: string;
//   typeProperty?: string;
//   propFactory: PropDefFactory;
// }

// const TypeSystems: TypeSystemDef[] = [
//   { name: 'javascript', typeProperty: 'type', propFactory: javaScriptFactory },
//   { name: 'typescript', typeProperty: 'tsType', propFactory: tsFactory },
//   { name: 'flow', typeProperty: 'flowType', propFactory: flowFactory },
//   { name: 'unknown', typeProperty: undefined, propFactory: unknownFactory },
// ];

// function isUnknownTypeSystem(typeSystemDef: TypeSystemDef): boolean {
//   return typeSystemDef.name === 'unknown';
// }

// function createType(typeName: string, others: Record<string, any> = {}): Record<string, string> {
//   return {
//     name: typeName,
//     ...others,
//   };
// }

// function createStringType(typeSystemDef: TypeSystemDef, others: Record<string, any> = {}): any {
//   if (isUnknownTypeSystem(typeSystemDef)) {
//     return {};
//   }

//   return {
//     [typeSystemDef.typeProperty]: createType('string', others),
//   };
// }

// function createFuncType(typeSystemDef: TypeSystemDef, others: Record<string, any> = {}): any {
//   if (isUnknownTypeSystem(typeSystemDef)) {
//     return {};
//   }

//   const typeName = typeSystemDef.name === 'javascript' ? 'func' : '() => {}';

//   return {
//     [typeSystemDef.typeProperty]: createType(typeName, others),
//   };
// }

// describe('extractProp', () => {
//   TypeSystems.forEach(x => {
//     describe(`${x.name}`, () => {
//       it('should map defaults docgen info properly', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.name).toBe(PROP_NAME);
//         expect(propDef.type).toBe(
//           // @ts-ignore
//           isUnknownTypeSystem(x) ? 'unknown' : docgenInfo[x.typeProperty].name
//         );
//         expect(propDef.description).toBe(docgenInfo.description);
//         expect(propDef.required).toBe(docgenInfo.required);
//         expect(propDef.defaultValue).toBe(docgenInfo.defaultValue.value);
//       });

//       it('should handle prop without a description', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: undefined,
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBeUndefined();
//       });

//       it('should remove JSDoc tags from the description', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick description\n@param {SyntheticEvent} event',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description');
//       });

//       it('should have an empty description when the description only contains JSDoc', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: '@param event',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('');
//       });

//       it('should not remove newline characters of multilines description without JSDoc tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick description\nis a\nmulti-lines\ndescription',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
//       });

//       it('should not remove newline characters of multilines description with JSDoc tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick description\nis a\nmulti-lines\ndescription\n@param event',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description\nis a\nmulti-lines\ndescription');
//       });

//       it('should not remove markdown from description without JSDoc tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick *emphasis*, **strong**, `formatted` description.',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe(
//           'onClick *emphasis*, **strong**, `formatted` description.'
//         );
//       });

//       it('should not remove markdown from description with JSDoc tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick *emphasis*, **strong**, `formatted` description.\n@param event',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe(
//           'onClick *emphasis*, **strong**, `formatted` description.'
//         );
//       });

//       it('should not remove @ characters that does not match JSDoc tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick @description@',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick @description@');
//       });

//       it('should return null when the property is marked with @ignore', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createStringType(x),
//           description: 'onClick description\n@ignore',
//         });

//         const prop = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(prop).toBeNull();
//       });

//       it('should provide raw @param tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createFuncType(x),
//           description:
//             'onClick description\n@param {SyntheticEvent} event - Original event.\n@param {string} value',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description');
//         expect(propDef.jsDocTags).toBeDefined();
//         expect(propDef.jsDocTags.params).toBeDefined();
//         expect(propDef.jsDocTags.params[0].name).toBe('event');
//         expect(propDef.jsDocTags.params[0].description).toBe('Original event.');
//         expect(propDef.jsDocTags.params[1].name).toBe('value');
//         expect(propDef.jsDocTags.params[1].description).toBeNull();
//       });

//       it('should provide raw @returns tags when a description is defined', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createFuncType(x),
//           description:
//             'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string} - An awesome string.',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description');
//         expect(propDef.jsDocTags).toBeDefined();
//         expect(propDef.jsDocTags.returns).toBeDefined();
//         expect(propDef.jsDocTags.returns.description).toBe('An awesome string.');
//       });

//       it('should provide raw @returns tags when there is no description', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createFuncType(x),
//           description:
//             'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
//         });

//         const { propDef } = extractProp(PROP_NAME, docgenInfo, x.propFactory);

//         expect(propDef.description).toBe('onClick description');
//         expect(propDef.jsDocTags).toBeDefined();
//         expect(propDef.jsDocTags.returns).toBeDefined();
//         expect(propDef.jsDocTags.returns.description).toBeNull();
//       });
//     });
//   });
// });
