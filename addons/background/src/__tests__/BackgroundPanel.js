import React from "react";
const EventEmitter = require("events");
import { shallow } from "enzyme";
import BackgroundPanel from "../BackgroundPanel";
const TestUtils = require("react-dom/test-utils");

const backgrounds = [
  { name: "black", value: "#000000" },
  { name: "secondary", value: "rgb(123,123,123)" },
  { name: "tertiary", value: "rgba(123,123,123,.5)" },
  { name: "An image", value: "url(http://placehold.it/350x150)" },
];

const mockedApi = {
  getQueryParam: jest.fn(),
  setQueryParams: jest.fn(),
}

describe("Background Panel", () => {
  it("should exist", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = shallow(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);

    expect(backgroundPanel).toBeDefined;
  });

  it("should have a default background value of transparent", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = shallow(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);

    expect(backgroundPanel.state().backgrounds.length).toBe(0);
  });

  it("should show setup instructions if no colors provided", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = shallow(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);

    expect(backgroundPanel.html().match(/Setup Instructions/gmi).length).toBeGreaterThan(0);
  });

  it("should set the query string", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit("background-set", backgrounds);

    expect(mockedApi.getQueryParam).toBeCalledWith("background");

  });

  it("should unset the query string", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit("background-unset", backgrounds);

    expect(mockedApi.setQueryParams).toBeCalledWith({ background: null });

  });

  it("should accept colors through channel and render the correct swatches with a default swatch", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit("background-set", backgrounds);

    expect(backgroundPanel.state.backgrounds[0].name).toBe(backgrounds[0].name);
    expect(backgroundPanel.state.backgrounds[2].value).toBe(backgrounds[2].value);

    //check to make sure the default bg was added
    const headings = TestUtils.scryRenderedDOMComponentsWithTag(backgroundPanel, "h4");
    expect(headings.length).toBe(10);
  });

  it("should allow setting a default swatch", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    const localBgs = [...backgrounds];
    (localBgs[0]).default = true;
    SpiedChannel.emit("background-set", localBgs);

    expect(backgroundPanel.state.backgrounds[0].name).toBe(localBgs[0].name);
    expect(backgroundPanel.state.backgrounds[2].value).toBe(localBgs[2].value);

    //check to make sure the default bg was added
    const headings = TestUtils.scryRenderedDOMComponentsWithTag(backgroundPanel, "h4");
    expect(headings.length).toBe(8);
    delete (backgrounds[0]).default;
  });

  it("should allow the default swatch become the background color", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    const localBgs = [...backgrounds];
    (localBgs[1]).default = true;
    SpiedChannel.on("background", bg => {
      expect(bg).toBe(localBgs[1].value);
    })
    SpiedChannel.emit("background-set", localBgs);

    expect(backgroundPanel.state.backgrounds[0].name).toBe(localBgs[0].name);
    expect(backgroundPanel.state.backgrounds[2].value).toBe(localBgs[2].value);

    //check to make sure the default bg was added
    const headings = TestUtils.scryRenderedDOMComponentsWithTag(backgroundPanel, "h4");
    expect(headings.length).toBe(8);
    delete (backgrounds[1]).default;
  });

  it("should unset all swatches on receiving the background-unset message", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit("background-set", backgrounds);

    expect(backgroundPanel.state.backgrounds[0].name).toBe(backgrounds[0].name);
    expect(backgroundPanel.state.backgrounds[2].value).toBe(backgrounds[2].value);

    SpiedChannel.emit("background-unset");
    expect(backgroundPanel.state.backgrounds.length).toBe(0);
  });

  it("should pass the event from swatch clicks through the provided channel", () => {
    const SpiedChannel = new EventEmitter();
    const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
    SpiedChannel.emit("background-set", backgrounds);

    const spy = jest.fn();
    SpiedChannel.on("background", spy);

    TestUtils.Simulate.click(
      TestUtils.scryRenderedDOMComponentsWithTag(backgroundPanel, "h4")[0] //an h4 is in the swatches
    );

    expect(spy).toBeCalledWith(backgrounds[0].value);
  });
});
