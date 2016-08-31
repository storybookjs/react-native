import * as React from "react"; // tslint:disable-line
const EventEmitter = require("events"); // tslint:disable-line
import { shallow } from "enzyme";
import Swatch from "../Swatch";
const TestUtils = require("react-addons-test-utils");

describe("Swatch", function() {
  it("should exist", () => {
    const SpiedChannel = new EventEmitter();
    const swatch = shallow(<Swatch value="bar" name="foo" channel={SpiedChannel} />);

    expect(swatch).toBeDefined();
  });

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

  it("should emit message on click", () => {
    const SpiedChannel = new EventEmitter();
    const swatch = TestUtils.renderIntoDocument(<Swatch value="#e6e6e6" name="Gray" channel={SpiedChannel} />);

    const spy = jest.fn();
    SpiedChannel.on('background', spy);

    TestUtils.Simulate.click(
      TestUtils.scryRenderedDOMComponentsWithTag(swatch, "div")[0]
    );

    expect(spy).toBeCalledWith("#e6e6e6");
  });
});
