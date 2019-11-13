// import { extractProp } from '../../../lib2/extractDocgenProps';
// import { DocgenInfo } from '../../../lib2/types';
// import { enhancePropTypesProp } from './handleProp';
// import { javaScriptFactory } from '../../../lib2/createDocgenPropDef';

// const PROP_NAME = 'propName';

// function createType(typeName: string, others: Record<string, any> = {}): Record<string, any> {
//   return {
//     type: {
//       name: typeName,
//       ...others,
//     },
//   };
// }

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

// describe('enhancePropTypesProp', () => {
//   describe('custom', () => {
//     it("should render raw value when it's available", () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('custom', { raw: 'MY_TYPE' }),
//         description: undefined,
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.type).toBe('MY_TYPE');
//     });

//     it("should render 'custom' when there is no raw value", () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('custom'),
//         description: undefined,
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.type).toBe('custom');
//     });
//   });

//   it("should render 'any' when type is any", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('any'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('any');
//   });

//   it("should render 'bool' when type is bool", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('bool'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('bool');
//   });

//   it("should render 'string' when type is string", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('string'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('string');
//   });

//   it("should render 'number' when type is number", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('number'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('number');
//   });

//   it("should render 'object' when type is object", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('object'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('object');
//   });

//   it("should render 'symbol' when type is symbol", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('symbol'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('symbol');
//   });

//   it("should render 'element' when type is element", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('element'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('element');
//   });

//   it("should render 'elementType' when type is elementType", () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('elementType'),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('elementType');
//   });

//   it('should render the instance type when type is instanceOf', () => {
//     const docgenInfo = createDocgenInfo({
//       ...createType('instanceOf', { value: 'Set' }),
//       description: undefined,
//     });

//     const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//     const propDef = enhancePropTypesProp(extractedProp);

//     expect(propDef.type).toBe('Set');
//   });

//   describe('enum', () => {
//     it('should render the enumerated string values', () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('enum', {
//           value: [
//             {
//               value: "'News'",
//               computed: false,
//             },
//             {
//               value: "'Photos'",
//               computed: false,
//             },
//           ],
//         }),
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.type).toBe("'News' | 'Photos'");
//     });
//   });

//   describe('func', () => {
//     it("should have func as type when the props doesn't have a description", () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('func'),
//         description: undefined,
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.description).toBeUndefined();
//       expect(propDef.type).toBe('func');
//     });

//     it('should have func as type when the prop have a description without JSDoc', () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('func'),
//         description: 'onClick description',
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.type).toBe('func');
//       expect(propDef.description).toBe('onClick description');
//     });

//     it('should have an empty description when the description only contains JSDoc', () => {
//       const docgenInfo = createDocgenInfo({
//         ...createType('func'),
//         description: '@param event',
//       });

//       const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//       const propDef = enhancePropTypesProp(extractedProp);

//       expect(propDef.description).toBe('');
//     });

//       it('should have a func signature when there is a @param tag', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createType('func'),
//           description: 'onClick description\n@param event',
//         });

//         const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//         const propDef = enhancePropTypesProp(extractedProp);

//         expect(propDef.type).toBe('(event)');
//         expect(propDef.description).toBe('onClick description');
//       });

//       it('should have a func signature with multiple args when there is multiple @param tags', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createType('func'),
//           description:
//             'onClick description\n@param {SyntheticEvent} event\n@param {string} customData',
//         });

//         const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//         const propDef = enhancePropTypesProp(extractedProp);

//         expect(propDef.type).toBe('(event: SyntheticEvent, customData: string)');
//         expect(propDef.description).toBe('onClick description');
//       });

//       it('should have a func signature with a return type when there is a @returns tag', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createType('func'),
//           description: 'onClick description\n@returns {string}',
//         });

//         const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//         const propDef = enhancePropTypesProp(extractedProp);

//         expect(propDef.type).toBe('() => string');
//         expect(propDef.description).toBe('onClick description');
//       });

//       it('should have a full signature when there is a @param and a @returns tag', () => {
//         const docgenInfo = createDocgenInfo({
//           ...createType('func'),
//           description:
//             'onClick description\n@param {SyntheticEvent} event - Original event.\n@returns {string}',
//         });

//         const extractedProp = extractProp(PROP_NAME, docgenInfo, javaScriptFactory);
//         const propDef = enhancePropTypesProp(extractedProp);

//         expect(propDef.type).toBe('(event: SyntheticEvent) => string');
//         expect(propDef.description).toBe('onClick description');
//       });
//   });
// });
