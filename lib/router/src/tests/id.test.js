import { toId } from '../utils';

describe('toId', () => {
  [
    // name, kind, story, output
    ['handles simple cases', 'kind', 'story', 'kind--story'],
    ['handles basic substitution', 'a b$c?d😀e', '1-2:3', 'a-b-c-d😀e--1-2-3'],
    ['handles runs of non-url chars', 'a?&*b', 'story', 'a-b--story'],
    ['removes non-url chars from start and end', '?ab-', 'story', 'ab--story'],
    ['downcases', 'KIND', 'STORY', 'kind--story'],
    ['non-latin', 'Кнопки', 'нормальный', 'кнопки--нормальный'],
    ['korean', 'kind', '바보 (babo)', 'kind--바보-babo'],
    ['all punctuation', 'kind', 'unicorns,’–—―′¿`"<>()!.!!!{}[]%^&$*#&', 'kind--unicorns'],
  ].forEach(([name, kind, story, output]) => {
    it(name, () => {
      expect(toId(kind, story)).toBe(output);
    });
  });

  it('does not allow kind with *no* url chars', () => {
    expect(() => toId('?', 'asdf')).toThrow(
      `Invalid kind '?', must include alphanumeric characters`
    );
  });

  it('does not allow empty kind', () => {
    expect(() => toId('', 'asdf')).toThrow(`Invalid kind '', must include alphanumeric characters`);
  });

  it('does not allow story with *no* url chars', () => {
    expect(() => toId('kind', '?')).toThrow(
      `Invalid name '?', must include alphanumeric characters`
    );
  });

  it('does not allow empty story', () => {
    expect(() => toId('kind', '')).toThrow(`Invalid name '', must include alphanumeric characters`);
  });
});
