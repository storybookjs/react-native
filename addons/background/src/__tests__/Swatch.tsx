
import * as React from "react"; // tslint:disable-line
const EventEmitter = require("events"); // tslint:disable-line
import { shallow } from "enzyme";

import Swatch from "../Swatch";

describe("Swatch", function() {
  it("should render the name of the swatch", () => {
    const SpiedChannel = new EventEmitter();

    const markup = shallow(
      <Swatch value="bar" name="foo" channel={SpiedChannel} />
    ).html();

    expect(markup.match(/foo/gmi).length).toBe(1);
  });

  it("should render the value of the swatch and set it to be the background", () => {
    const SpiedChannel = new EventEmitter();

    const markup = shallow(
      <Swatch value="bar" name="foo" channel={SpiedChannel} />
    ).html();

    expect(markup.match(/background:bar/gmi).length).toBe(1);
    expect(markup.match(/bar/gmi).length).toBe(2);
  });

});
