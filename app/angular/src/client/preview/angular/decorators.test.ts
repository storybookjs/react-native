import addons, { mockChannel } from '@storybook/addons';

import { moduleMetadata } from './decorators';
import { addDecorator, storiesOf, clearDecorators, getStorybook } from '..';

class MockModule {}
class MockModuleTwo {}
class MockService {}
class MockComponent {}

describe('moduleMetadata', () => {
  it('should add metadata to a story without it', () => {
    const result = moduleMetadata({
      imports: [MockModule],
      providers: [MockService],
    })(() => ({
      component: MockComponent,
    }));

    expect(result).toEqual({
      component: MockComponent,
      moduleMetadata: {
        declarations: [],
        entryComponents: [],
        imports: [MockModule],
        schemas: [],
        providers: [MockService],
      },
    });
  });

  it('should combine with individual metadata on a story', () => {
    const result = moduleMetadata({
      imports: [MockModule],
    })(() => ({
      component: MockComponent,
      moduleMetadata: {
        imports: [MockModuleTwo],
        providers: [MockService],
      },
    }));

    expect(result).toEqual({
      component: MockComponent,
      moduleMetadata: {
        declarations: [],
        entryComponents: [],
        imports: [MockModule, MockModuleTwo],
        schemas: [],
        providers: [MockService],
      },
    });
  });

  it('should return the original metadata if passed null', () => {
    const result = moduleMetadata(null)(() => ({
      component: MockComponent,
      moduleMetadata: {
        providers: [MockService],
      },
    }));

    expect(result).toEqual({
      component: MockComponent,
      moduleMetadata: {
        declarations: [],
        entryComponents: [],
        imports: [],
        schemas: [],
        providers: [MockService],
      },
    });
  });

  it('should work when added globally', () => {
    const metadata = {
      declarations: [MockComponent],
      providers: [MockService],
      entryComponents: [MockComponent],
      imports: [MockModule],
    };

    addons.setChannel(mockChannel());
    addDecorator(moduleMetadata(metadata));

    storiesOf('Test', module).add('Default', () => ({
      component: MockComponent,
    }));

    const [storybook] = getStorybook();

    expect(storybook.stories[0].render().moduleMetadata).toEqual({
      declarations: [MockComponent],
      providers: [MockService],
      entryComponents: [MockComponent],
      imports: [MockModule],
      schemas: [],
    });

    clearDecorators();
  });
});
