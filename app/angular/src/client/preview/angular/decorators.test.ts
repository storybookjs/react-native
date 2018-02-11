import { moduleMetadata } from './decorators';

class MockModule {}
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
        imports: [MockModule],
        providers: [MockService],
      },
    });
  });

  it('should not override individual metadata on a story', () => {
    const result = moduleMetadata({
      imports: [MockModule],
    })(() => ({
      component: MockComponent,
      moduleMetadata: {
        providers: MockService,
      },
    }));

    expect(result).toEqual({
      component: MockComponent,
      moduleMetadata: {
        providers: MockService,
      },
    });
  });
});
