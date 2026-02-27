import { Basic } from './BackgroundCsf.factories.stories';

test('Background colour defaults to hotpink', () => {
  const backgroundName = Basic.composed.globals?.backgrounds?.value;
  const backgroundOptions = Basic.composed.parameters?.backgrounds?.options;

  expect(backgroundName).toBe('warm');
  expect(backgroundOptions?.[backgroundName]?.value).toBe('hotpink');
});
