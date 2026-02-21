import { describe, it, beforeEach, type TestContext } from 'node:test';
import assert from 'node:assert';
import { parseWithReactDocgen, invalidateCache } from '@storybook/react-native/node';

function parse(code: string, name = 'Component.tsx') {
  return parseWithReactDocgen(code, `/virtual/${name}`);
}

/**
 * Export name coverage tests — mirrors core Storybook's reactDocgen.test.ts
 */
describe('parseWithReactDocgen exportName coverage', () => {
  beforeEach(() => {
    invalidateCache();
  });

  it('inline default export function declaration', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';
      export default function Foo() { return <View /> }
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'default');
  });

  it('inline anonymous default export (arrow function)', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      export default () => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, '');
    assert.strictEqual(result[0].exportName, 'default');
  });

  it('separate default export identifier', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      const Foo = () => <View />;
      export default Foo;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'default');
  });

  it('named export: export const Foo = ...', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      export const Foo = () => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'Foo');
  });

  it('named export: export function Foo() {}', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      export function Foo() { return <View /> }
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'Foo');
  });

  it('export list: export { Foo }', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      const Foo = () => <View />;
      export { Foo };
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'Foo');
  });

  it('aliased named export: export { Foo as Bar }', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      const Foo = () => <View />;
      export { Foo as Bar };
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'Bar');
  });

  it('aliased to default: export { Foo as default }', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      const Foo = () => <View />;
      export { Foo as default };
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].actualName, 'Foo');
    assert.strictEqual(result[0].exportName, 'default');
  });

  it('multiple components with different export styles', (t: TestContext) => {
    const result = parse(`
      import { View } from 'react-native';
      export function A(){ return <View /> }
      const B = () => <View />;
      export { B as Beta };
      const C = () => <View />;
      export default C;
    `);

    t.assert.snapshot(result);
  });
});

/**
 * Prop type extraction tests — mirrors core Storybook's extractReactDocgenInfo.test.ts
 */
describe('parseWithReactDocgen prop extraction', () => {
  beforeEach(() => {
    invalidateCache();
  });

  it('basic typed props: string, number, boolean', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface Props {
        label: string;
        count: number;
        visible: boolean;
      }

      export const MyComponent = ({ label, count, visible }: Props) => <View />;
    `);

    t.assert.snapshot(result);

    const props = result[0].props;
    assert.strictEqual(props.label.tsType.name, 'string');
    assert.strictEqual(props.count.tsType.name, 'number');
    assert.strictEqual(props.visible.tsType.name, 'boolean');
    assert.strictEqual(props.label.required, true);
  });

  it('optional props', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface Props {
        title: string;
        subtitle?: string;
      }

      export const MyComponent = ({ title, subtitle }: Props) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].props.title.required, true);
    assert.strictEqual(result[0].props.subtitle.required, false);
  });

  it('union types', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface Props {
        variant: 'primary' | 'secondary' | 'danger';
        size?: 'small' | 'large';
      }

      export const Tag = ({ variant, size }: Props) => <View />;
    `);

    t.assert.snapshot(result);

    const variantType = result[0].props.variant.tsType;
    assert.strictEqual(variantType.name, 'union');
    assert.strictEqual(variantType.elements!.length, 3);
  });

  it('default values', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface Props {
        message: string;
        severity?: string;
      }

      export const Alert = ({ message, severity = 'info' }: Props) => <View />;
    `);

    t.assert.snapshot(result);

    assert.strictEqual(result[0].props.severity.defaultValue.value, "'info'");
    assert.strictEqual(result[0].props.severity.defaultValue.computed, false);
    assert.strictEqual(result[0].props.message.required, true);
  });

  it('function props', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface Props {
        onSubmit: () => boolean;
        onClick?: (id: string) => void;
      }

      export const Callback = ({ onSubmit, onClick }: Props) => <View />;
    `);

    t.assert.snapshot(result);

    const onSubmit = result[0].props.onSubmit.tsType;
    assert.strictEqual(onSubmit.type, 'function');
    assert.strictEqual(onSubmit.signature.arguments.length, 0);

    const onClick = result[0].props.onClick.tsType;
    assert.strictEqual(onClick.type, 'function');
    assert.strictEqual(onClick.signature.arguments.length, 1);
    assert.strictEqual(onClick.signature.arguments[0].name, 'id');
  });

  it('JSDoc descriptions', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface TooltipProps {
        /** The content to display */
        content: string;
      }

      /**
       * A tooltip component
       */
      export const Tooltip = ({ content }: TooltipProps) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].props.content.description, 'The content to display');
    assert.ok(result[0].description.includes('tooltip component'));
  });

  it('interface props', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface ButtonProps {
        label: string;
        disabled?: boolean;
      }

      export const Button = ({ label, disabled }: ButtonProps) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].displayName, 'Button');
  });

  it('type alias props', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      type CardProps = {
        title: string;
        elevation?: number;
      };

      export const Card = ({ title, elevation }: CardProps) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].displayName, 'Card');
  });

  it('inline props in function signature', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      export const Badge = ({ count, color }: { count: number; color: string }) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].props.count.tsType.name, 'number');
    assert.strictEqual(result[0].props.color.tsType.name, 'string');
  });

  it('React.FC pattern', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      interface ButtonProps {
        children: React.ReactNode;
        variant?: 'primary' | 'secondary';
      }

      export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary' }) => {
        return <View />;
      };
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].displayName, 'Button');
    assert.strictEqual(result[0].props.variant.defaultValue.value, "'primary'");
  });

  it('forwardRef', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View, TextInput } from 'react-native';

      interface InputProps {
        placeholder?: string;
        editable?: boolean;
      }

      export const Input = React.forwardRef<TextInput, InputProps>(
        ({ placeholder, editable }, ref) => <View />
      );
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result[0].displayName, 'Input');
    assert.strictEqual(result[0].props.placeholder.required, false);
    assert.strictEqual(result[0].props.editable.required, false);
  });

  it('multiple named exports', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View } from 'react-native';

      export const Input: React.FC<{ placeholder?: string }> = ({ placeholder }) => <View />;
      export const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => <View />;
    `);

    t.assert.snapshot(result);
    assert.strictEqual(result.length, 2);

    const names = result.map((r) => r.displayName).sort();
    assert.deepStrictEqual(names, ['Input', 'Label']);
  });

  it('comprehensive prop types', (t: TestContext) => {
    const result = parse(`
      import React from 'react';
      import { View, GestureResponderEvent } from 'react-native';

      interface DetailedButtonProps {
        // React node
        children: React.ReactNode;

        // Literal union
        variant?: 'primary' | 'secondary' | 'danger';

        // Primitive booleans, numbers, strings
        disabled?: boolean;
        label?: string;
        priority?: number;

        // Array
        tags?: string[];
        steps?: Array<{ id: string; done: boolean }>;

        // Tuple
        coordinates?: [number, number];

        // Object
        metadata?: {
          id: string;
          description?: string;
          flags?: Record<string, boolean>;
        };

        // Record/map-like object
        styleOverrides?: Record<string, string | number>;

        // Nullable/undefined union
        note?: string | null;

        // Function with parameters and return value
        onPress?: (event: GestureResponderEvent) => void;
        onClose?: () => Promise<void>;

        // Discriminated union
        mode?:
          | { type: 'static'; value: string }
          | { type: 'dynamic'; compute: () => string };

        // Enum-like field
        size?: 'small' | 'medium' | 'large';

        // Arbitrary JSON-like struct
        config?: unknown;

        // Async data
        fetchData?: () => Promise<{ result: string[] }>;

        // Optional callback list
        lifecycleHooks?: Array<() => void>;

        // Optional custom renderer
        renderPrefix?: () => React.ReactNode;
      }

      /**
       * A detailed button component with comprehensive documentation
       */
      export const DetailedButton: React.FC<DetailedButtonProps> = ({
        children,
        variant = 'primary',
        disabled = false,
        onPress,
      }) => {
        return <View />;
      };
    `);

    t.assert.snapshot(result);

    assert.strictEqual(result[0].displayName, 'DetailedButton');
    assert.ok(result[0].description.includes('detailed button component'));

    const props = result[0].props;

    // Verify key prop types are extracted correctly
    assert.strictEqual(props.children.tsType.name, 'ReactReactNode');
    assert.strictEqual(props.disabled.defaultValue.value, 'false');
    assert.strictEqual(props.variant.defaultValue.value, "'primary'");
    assert.strictEqual(props.label.tsType.name, 'string');
    assert.strictEqual(props.priority.tsType.name, 'number');
    assert.strictEqual(props.tags.tsType.name, 'Array');
    assert.strictEqual(props.coordinates.tsType.name, 'tuple');
    assert.strictEqual(props.metadata.tsType.type, 'object');
    assert.strictEqual(props.note.tsType.name, 'union');
    assert.strictEqual(props.config.tsType.name, 'unknown');
    assert.strictEqual(props.onClose.tsType.type, 'function');
    assert.strictEqual(props.fetchData.tsType.type, 'function');
    assert.strictEqual(props.lifecycleHooks.tsType.name, 'Array');
    assert.strictEqual(props.renderPrefix.tsType.type, 'function');
    assert.strictEqual(props.mode.tsType.name, 'union');
    assert.strictEqual(props.size.tsType.name, 'union');
    assert.strictEqual(props.styleOverrides.tsType.name, 'Record');
    assert.strictEqual(props.steps.tsType.name, 'Array');
  });

  it('no component definition throws', () => {
    assert.throws(() => {
      parse(`
        export const helper = (x: number) => x * 2;
      `);
    });
  });
});
