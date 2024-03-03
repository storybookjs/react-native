### Portable stories

Portable stories are Storybook stories which can be used in external environments, such as [Jest](https://jestjs.io).

You can make your stories portable by using Storybook's `composeStory` and `composeStories` utilities, which come from the `@storybook/react` package. This way, in your unit tests, you can just select which story you want to render, and all the necessary setup (args, decoratos, etc.) will be already done for you. This is the missing piece that allows for better shareability and maintenance between writing tests and writing Storybook stories.

You can find example tests using portable stories in this repository [here](https://github.com/storybookjs/react-native/blob/next/examples/expo-example/components/ActionExample/Actions.test.tsx).

## composeStories

`composeStories` will process the component's stories you specify, compose each of them with the necessary [annotations](#annotations), and return an object containing the composed stories.

By default, the composed story will render the component with the [args](https://storybook.js.org/docs/writing-stories/args) that are defined in the story. You can also pass any props to the component in your test and those props will override the values passed in the story's args.

```tsx
// Button.test.tsx
import { test, expect } from '@jest/globals';
import { render, screen } from '@testing-library/react-native';
import { composeStories } from '@storybook/react';

// Import all stories and the component annotations from the stories file
import * as stories from './Button.stories';

// Every component that is returned maps 1:1 with the stories,
// but they already contain all annotations from story, meta, and project levels
const { Primary, Secondary } = composeStories(stories);

test('renders primary button with default args', () => {
  render(<Primary />);
  const buttonElement = screen.getByText('Text coming from args in stories file!');
  expect(buttonElement).not.toBeNull();
});

test('renders primary button with overriden props', () => {
  // You can override props and they will get merged with values from the story's args
  render(<Primary>Hello world</Primary>);
  const buttonElement = screen.getByText(/Hello world/i);
  expect(buttonElement).not.toBeNull();
});
```

### Type

```ts
(
  csfExports: CSF file exports,
  projectAnnotations?: ProjectAnnotations
) => Record<string, ComposedStoryFn>
```

### Parameters

#### `csfExports`

(**Required**)

Type: CSF file exports

Specifies which component's stories you want to compose. Pass the **full set of exports** from the CSF file (not the default export!). E.g. `import * as stories from './Button.stories'`

#### `projectAnnotations`

Type: `ProjectAnnotation | ProjectAnnotation[]`

Specifies the project annotations to be applied to the composed stories.

This parameter is provided for convenience. You should likely use [`setProjectAnnotations`](#setprojectannotations) instead. Details about the `ProjectAnnotation` type can be found in that function's [`projectAnnotations`](#projectannotations-2) parameter.

This parameter can be used to override the project annotations applied via `setProjectAnnotations`.

### Return

Type: `Record<string, ComposedStoryFn>`

An object where the keys are the names of the stories and the values are the composed stories.

Additionally, the composed story will have the following properties:

| Property   | Type                                      | Description                  |
| ---------- | ----------------------------------------- | ---------------------------- |
| storyName  | `string`                                  | The story's name             |
| args       | `Record<string, any>`                     | The story's args             |
| argTypes   | `ArgType`                                 | The story's argTypes         |
| id         | `string`                                  | The story's id               |
| parameters | `Record<string, any>`                     | The story's parameters       |

## composeStory

You can use `composeStory` if you wish to compose a single story for a component.

```tsx
// Button.test.tsx
import { jest, test, expect } from '@jest/globals';
import { render, screen, userEvent } from '@testing-library/react-native';
import { composeStory } from '@storybook/react';

import meta, { Primary } from './Button.stories';

test('onclick handler is called', () => {
  // Returns a story which already contains all annotations from story, meta and global levels
  const PrimaryStory = composeStory(Primary, meta);

  const onPressSpy = jest.fn();

  render(<PrimaryStory onPress={onPressSpy} />);

  const user = userEvent.setup({});

  const actionButton = screen.getByText('Press me!');

  await user.press(actionButton);

  expect(onPress).toHaveBeenCalled();
});
```

### Type

```ts
(
  story: Story export,
  componentAnnotations: Meta,
  projectAnnotations?: ProjectAnnotations,
  exportsName?: string
) => ComposedStoryFn
```

### Parameters

#### `story`

(**Required**)

Type: `Story export`

Specifies which story you want to compose.

#### `componentAnnotations`

(**Required**)

Type: `Meta`

The default export from the stories file containing the [`story`](#story).

#### `projectAnnotations`

Type: `ProjectAnnotation | ProjectAnnotation[]`

Specifies the project annotations to be applied to the composed story.

This parameter is provided for convenience. You should likely use [`setProjectAnnotations`](#setprojectannotations) instead. Details about the `ProjectAnnotation` type can be found in that function's [`projectAnnotations`](#projectannotations-2) parameter.

This parameter can be used to override the project annotations applied via `setProjectAnnotations`.

#### `exportsName`

Type: `string`

You probably don't need this. Because `composeStory` accepts a single story, it does not have access to the name of that story's export in the file (like `composeStories` does). If you must ensure unique story names in your tests and you cannot use `composeStories`, you can pass the name of the story's export here.

### Return

Type: `ComposedStoryFn`

A single [composed story](#return).

## setProjectAnnotations

This API should be called once, before the tests run, typically in a [setup file](https://jestjs.io/docs/configuration#setupfiles-array). This will make sure that whenever `composeStories` or `composeStory` are called, the project annotations are taken into account as well.

```ts
// setup-portable-stories.ts
import { setProjectAnnotations } from '@storybook/react';
import * as addonAnnotations from 'my-addon/preview';
import * as previewAnnotations from './.storybook/preview';

setProjectAnnotations([previewAnnotations, addonAnnotations]);
```


> **Note:**
> Sometimes a story can require an addon's [decorator](https://storybook.js.org/docs/writing-stories/decorators) or [loader](https://storybook.js.org/docs/writing-stories/loaders) to render properly. For example, an addon can apply a decorator that wraps your story in the necessary router context. In this case, you must include that addon's `preview` export in the project annotations set. See `addonAnnotations` in the example above.

> **Note:** If the addon doesn't automatically apply the decorator or loader itself, but instead exports them for you to apply manually in `.storybook/preview.js|ts` (e.g. using `withThemeFromJSXProvider` from [@storybook/addon-themes](https://github.com/storybookjs/storybook/blob/next/code/addons/themes/docs/api.md#withthemefromjsxprovider)), then you do not need to do anything else. They are already included in the `previewAnnotations` in the example above.

### Type

```ts
(projectAnnotations: ProjectAnnotation | ProjectAnnotation[]) => void
```

### Parameters

#### `projectAnnotations`

(**Required**)

Type: `ProjectAnnotation | ProjectAnnotation[]`

A set of project [annotations](#annotations) (those defined in `.storybook/preview.js|ts`) or an array of sets of project annotations, which will be applied to all composed stories.

## Annotations

Annotations are the metadata applied to a story, like [args](https://storybook.js.org/docs/writing-stories/args), [decorators](https://storybook.js.org/docs/writing-stories/decorators), and [loaders](https://storybook.js.org/docs/writing-stories/loaders). They can be defined for a specific story, all stories for a component, or all stories in the project.
