import * as React from "react"; // tslint:disable-line
const EventEmitter = require("events"); // tslint:disable-line
import { shallow } from "enzyme";
import { BackgroundDecorator } from "../index";
const TestUtils = require("react-addons-test-utils"); // tslint:disable-line

const testStory = () => () => <p>Hello World!</p>;

describe("Background Decorator", () => {
  it("should exist", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);
    expect(backgroundDecorator).toBeDefined();
  });

  it("should initially have a transparent background state", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    expect(backgroundDecorator.state().background).toBe("transparent");
  });

  it("should have a background matching its state", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    expect(backgroundDecorator.html().match(/background-color:transparent/gmi).length).toBe(1);
  });

  it("should set internal state when background event called", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    SpiedChannel.emit("background", "#123456");
    expect(backgroundDecorator.state().background).toBe("#123456");
  });

  it("should send background-unset event when the component unmounts", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    const spy = jest.fn();
    SpiedChannel.on('background-unset', spy);

    backgroundDecorator.unmount();

    expect(spy).toBeCalled();
  });

  it("should send background-set event when the component mounts", () => {
    const SpiedChannel = new EventEmitter();
    const spy = jest.fn();
    SpiedChannel.on('background-set', spy);

    const backgroundDecorator = shallow(<BackgroundDecorator story={testStory} channel={SpiedChannel} />);

    expect(spy).toBeCalled();
  });
});
