const { describe, it } = global;
import { expect } from 'chai';
import highlight from '../utils/highlight';

describe('highlight', function () {
  it('should remove quotes from keys and add correct colour', function () {
    const data = '{ "name": "react-storybook" }';
    const expected = '{ <span class="key" style="color:#800080">name:</span> <span class="string" style="color:#a31515">"react-storybook"</span> }'; // eslint-disable-line
    expect(highlight(data)).to.equal(expected);
  });

  it('should preserve new lines also', function () {
    const data = '{\n  "name": "test action",\n  "args": "things"\n}';
    const expected = '{\n  ' +
      '<span class="key" style="color:#800080">name:</span> ' +
      '<span class="string" style="color:#a31515">"test action"</span>,\n  ' +
      '<span class="key" style="color:#800080">args:</span> ' +
      '<span class="string" style="color:#a31515">"things"</span>\n}';
    expect(highlight(data)).to.equal(expected);
  });
});
