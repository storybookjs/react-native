import { _getAggregatedWrap, getRendererFrom } from './getRendererFrom';
import { OPT_OUT } from '../../shared/constants';

// mocks
const h = jest.fn();
const spiedAggregator = _getAggregatedWrap(h);

beforeEach(() => {
  h.mockReset();
});

// tests
describe('Test on aggregation of a single context', () => {
  const fakeTag = 'fakeTag';
  const fakeComponent = () => '';

  it('should skip wrapping when being set to disable', () => {
    // given
    const testedProps = {};
    const testedOption = { disable: true };

    // when
    spiedAggregator([fakeTag, fakeComponent], testedProps, testedOption)();

    // then
    expect(h).toHaveBeenCalledTimes(0);
  });

  it('should skip wrapping when props is marked as "OPT_OUT"', () => {
    // given
    const testedProps = OPT_OUT;
    const testedOption = { cancelable: true };

    // when
    spiedAggregator([fakeTag, fakeComponent], testedProps, testedOption)();

    // then
    expect(h).toHaveBeenCalledTimes(0);
  });

  it('should wrap components in the stacking order', () => {
    // given
    const testedProps = {};
    const testedOption = {};

    // when
    spiedAggregator([fakeTag, fakeComponent], testedProps, testedOption)();

    // then
    expect(h).toHaveBeenCalledTimes(2);
    expect(h.mock.calls[0][0]).toBe(fakeComponent);
    expect(h.mock.calls[1][0]).toBe(fakeTag);
  });

  it('should NOT pass props deeply by default', () => {
    // given
    const testedProps = {};
    const testedOption = {};

    // when
    spiedAggregator([fakeTag, fakeComponent], testedProps, testedOption)();

    // then
    expect(h.mock.calls[0][1]).toBe(null);
    expect(h.mock.calls[1][1]).toBe(testedProps);
  });

  it('should pass props deeply', () => {
    const testedProps = {};
    const testedOption = { deep: true };
    spiedAggregator([fakeTag, fakeComponent], testedProps, testedOption)();
    expect(h.mock.calls[0][1]).toBe(testedProps);
    expect(h.mock.calls[1][1]).toBe(testedProps);
  });
});

describe('Test on aggregation of contexts', () => {
  it('should aggregate contexts in the stacking order', () => {
    // given
    const someContextNodes = [
      {
        components: ['div'],
        icon: 'box' as const,
        nodeId: 'Some Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'A', props: {} }],
        title: 'Some Context',
      },
      {
        components: ['span'],
        icon: 'box' as const,
        nodeId: 'Another Context',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: 'B', props: {} }],
        title: 'Another Context',
      },
    ];
    const propsMap = {
      'Some Context': {},
      'Another Context': {},
    };

    // when
    getRendererFrom(h)(someContextNodes, propsMap, () => {});

    // then
    expect(h.mock.calls[0][0]).toBe(someContextNodes[1].components[0]);
    expect(h.mock.calls[1][0]).toBe(someContextNodes[0].components[0]);
  });
});
