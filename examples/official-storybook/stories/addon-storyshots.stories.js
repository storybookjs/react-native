import React, { useState } from 'react';
import { styled } from '@storybook/theming';

const Block = styled.div({
  display: 'inline-block',
  height: 400,
  width: 400,
  background: 'hotpink',
});

export default {
  title: 'Addons/Storyshots',
};

export const block = () => {
  const [hover, setHover] = useState(false);

  return (
    <Block data-test-block onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {hover && 'I am hovered'}
    </Block>
  );
};
block.story = {
  name: 'Block story',
  parameters: {
    async puppeteerTest(page) {
      const element = await page.$('[data-test-block]');
      await element.hover();
      const textContent = await element.getProperty('textContent');
      const text = await textContent.jsonValue();
      // eslint-disable-next-line jest/no-standalone-expect
      expect(text).toBe('I am hovered');
    },
  },
};
