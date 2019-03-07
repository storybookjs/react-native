import React from 'react';
import { shallow } from 'enzyme';
import { SyntaxHighlighter as SyntaxHighlighterBase } from '@storybook/components';
import { SyntaxHighlighter } from './Panel.tsx';

describe('NotesPanel', () => {
  describe('SyntaxHighlighter component', () => {
    it('should return code if className is undefined', () => {
      const wrapper = shallow(<SyntaxHighlighter>some text</SyntaxHighlighter>);
      const code = wrapper.find('code');
      expect(code.exists()).toBeTruthy();
      expect(code.text()).toBe('some text');
    });
    it('should return SyntaxHighlighterBase if there is a className prop', () => {
      const wrapper = shallow(
        <SyntaxHighlighter className="lang-jsx">some text</SyntaxHighlighter>
      );
      const syntaxHighlighterBase = wrapper.find(SyntaxHighlighterBase);
      expect(syntaxHighlighterBase.exists()).toBeTruthy();
      expect(syntaxHighlighterBase.prop('language')).toBe('jsx');
    });
  });
});
