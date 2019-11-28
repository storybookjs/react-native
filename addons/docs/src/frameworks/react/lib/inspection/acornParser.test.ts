import { parse } from './acornParser';
import {
  InspectionType,
  InspectionElement,
  InspectionObject,
  InspectionArray,
  InspectionIdentifier,
  InspectionLiteral,
  InspectionFunction,
  InspectionUnknown,
} from './types';

describe('parse', () => {
  describe('expression', () => {
    it('support HTML element', () => {
      const result = parse('<div>Hello!</div>');
      const inferedType = result.inferedType as InspectionElement;

      expect(inferedType.type).toBe(InspectionType.ELEMENT);
      expect(inferedType.identifier).toBe('div');
      expect(result.ast).toBeDefined();
    });

    it('support React declaration', () => {
      const result = parse('<FunctionalComponent />');
      const inferedType = result.inferedType as InspectionElement;

      expect(inferedType.type).toBe(InspectionType.ELEMENT);
      expect(inferedType.identifier).toBe('FunctionalComponent');
      expect(result.ast).toBeDefined();
    });

    it('support anonymous functional React component', () => {
      const result = parse('() => { return <div>Hey!</div>; }');
      const inferedType = result.inferedType as InspectionElement;

      expect(inferedType.type).toBe(InspectionType.ELEMENT);
      expect(inferedType.identifier).toBeUndefined();
      expect(result.ast).toBeDefined();
    });

    it('support named functional React component', () => {
      const result = parse('function NamedFunctionalComponent() { return <div>Hey!</div>; }');
      const inferedType = result.inferedType as InspectionElement;

      expect(inferedType.type).toBe(InspectionType.ELEMENT);
      expect(inferedType.identifier).toBe('NamedFunctionalComponent');
      expect(result.ast).toBeDefined();
    });

    it('support class React component', () => {
      const result = parse(`
        class ClassComponent extends React.PureComponent {
          render() {
            return <div>Hey!</div>;
          }
      }`);
      const inferedType = result.inferedType as InspectionElement;

      expect(inferedType.type).toBe(InspectionType.ELEMENT);
      expect(inferedType.identifier).toBe('ClassComponent');
      expect(result.ast).toBeDefined();
    });

    it('support PropTypes.shape', () => {
      const result = parse('PropTypes.shape({ foo: PropTypes.string })');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support deep PropTypes.shape', () => {
      const result = parse('PropTypes.shape({ foo: PropTypes.shape({ bar: PropTypes.string }) })');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(2);
      expect(result.ast).toBeDefined();
    });

    it('support shape', () => {
      const result = parse('shape({ foo: string })');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support deep shape', () => {
      const result = parse('shape({ foo: shape({ bar: string }) })');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(2);
      expect(result.ast).toBeDefined();
    });

    it('support single prop object literal', () => {
      const result = parse('{ foo: PropTypes.string }');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support multi prop object literal', () => {
      const result = parse(`
      {
          foo: PropTypes.string,
          bar: PropTypes.string
      }`);
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support deep object literal', () => {
      const result = parse(`
      {
          foo: {
            hey: PropTypes.string
          },
          bar: PropTypes.string,
          hey: {
            ho: PropTypes.string
          }
      }`);
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(2);
      expect(result.ast).toBeDefined();
    });

    it('support required prop', () => {
      const result = parse('{ foo: PropTypes.string.isRequired }');
      const inferedType = result.inferedType as InspectionObject;

      expect(inferedType.type).toBe(InspectionType.OBJECT);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support array', () => {
      const result = parse("['bottom-left', 'botton-center', 'bottom-right']");
      const inferedType = result.inferedType as InspectionArray;

      expect(inferedType.type).toBe(InspectionType.ARRAY);
      expect(inferedType.depth).toBe(1);
      expect(result.ast).toBeDefined();
    });

    it('support deep array', () => {
      const result = parse("['bottom-left', { foo: string }, [['hey', 'ho']]]");
      const inferedType = result.inferedType as InspectionArray;

      expect(inferedType.type).toBe(InspectionType.ARRAY);
      expect(inferedType.depth).toBe(3);
      expect(result.ast).toBeDefined();
    });

    it('support object identifier', () => {
      const result = parse('NAMED_OBJECT');
      const inferedType = result.inferedType as InspectionIdentifier;

      expect(inferedType.type).toBe(InspectionType.IDENTIFIER);
      expect(inferedType.identifier).toBe('NAMED_OBJECT');
      expect(result.ast).toBeDefined();
    });

    it('support anonymous function', () => {
      const result = parse('() => {}');
      const inferedType = result.inferedType as InspectionFunction;

      expect(inferedType.type).toBe(InspectionType.FUNCTION);
      expect(inferedType.identifier).toBeUndefined();
      expect(inferedType.hasParams).toBeFalsy();
      expect(inferedType.params.length).toBe(0);
      expect(result.ast).toBeDefined();
    });

    it('support anonymous function with arguments', () => {
      const result = parse('(a, b) => {}');
      const inferedType = result.inferedType as InspectionFunction;

      expect(inferedType.type).toBe(InspectionType.FUNCTION);
      expect(inferedType.identifier).toBeUndefined();
      expect(inferedType.hasParams).toBeTruthy();
      expect(inferedType.params.length).toBe(2);
      expect(result.ast).toBeDefined();
    });

    it('support named function', () => {
      const result = parse('function concat() {}');
      const inferedType = result.inferedType as InspectionFunction;

      expect(inferedType.type).toBe(InspectionType.FUNCTION);
      expect(inferedType.identifier).toBe('concat');
      expect(inferedType.hasParams).toBeFalsy();
      expect(inferedType.params.length).toBe(0);
      expect(result.ast).toBeDefined();
    });

    it('support named function with arguments', () => {
      const result = parse('function concat(a, b) {}');
      const inferedType = result.inferedType as InspectionFunction;

      expect(inferedType.type).toBe(InspectionType.FUNCTION);
      expect(inferedType.identifier).toBe('concat');
      expect(inferedType.hasParams).toBeTruthy();
      expect(inferedType.params.length).toBe(2);
      expect(result.ast).toBeDefined();
    });

    it('support class', () => {
      const result = parse('class Foo {}');
      const inferedType = result.inferedType as InspectionFunction;

      expect(inferedType.type).toBe(InspectionType.CLASS);
      expect(inferedType.identifier).toBe('Foo');
      expect(result.ast).toBeDefined();
    });

    [
      { name: 'string', value: "'string value'" },
      { name: 'numeric', value: '1' },
      { name: 'boolean (true)', value: 'true' },
      { name: 'boolean (false)', value: 'false' },
      { name: 'null', value: 'null' },
    ].forEach(x => {
      it(`support ${x.name}`, () => {
        const result = parse(x.value);
        const inferedType = result.inferedType as InspectionLiteral;

        expect(inferedType.type).toBe(InspectionType.LITERAL);
        expect(result.ast).toBeDefined();
      });
    });

    it("returns Unknown when it's not supported", () => {
      const result = parse("Symbol('foo')");
      const inferedType = result.inferedType as InspectionUnknown;

      expect(inferedType.type).toBe(InspectionType.UNKNOWN);
      expect(result.ast).toBeDefined();
    });
  });
});
