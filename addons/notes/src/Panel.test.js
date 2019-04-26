import React from 'react';
import { shallow, mount } from 'enzyme';
import { Link } from '@reach/router';
import { SyntaxHighlighter as SyntaxHighlighterBase } from '@storybook/components';
import { SyntaxHighlighter, NotesLink } from './Panel';

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

  describe('NotesLink component', () => {
    it('should render storybook links with @storybook/router Link', () => {
      const component = mount(
        <NotesLink href="/story/addon-notes" title="title">
          Storybook Link
        </NotesLink>
      );
      expect(component.find(Link).prop('to')).toBe('/?path=/story/addon-notes');
      expect(component.find(Link).prop('title')).toBe('title');
    });
    it('should render absolute links as <a>', () => {
      const component = mount(
        <NotesLink href="https://example.com" title="title">
          Storybook Link
        </NotesLink>
      );
      expect(component.find('a').prop('href')).toBe('https://example.com');
      expect(component.find('a').prop('title')).toBe('title');
    });
  });
});
