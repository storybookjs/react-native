import * as React from "react"; // tslint:disable-line
const EventEmitter = require("events"); // tslint:disable-line
import { shallow } from "enzyme";
import BackgroundPanel from "../BackgroundPanel";
const TestUtils = require("react-addons-test-utils"); // tslint:disable-line

const backgrounds = [
  { name: "black", value: "#000000" },
  { name: "secondary", value: "rgb(123,123,123)" },
  { name: "tertiary", value: "rgba(123,123,123,.5)" },
  { name: "An image", value: "url(http://placehold.it/350x150)" },
];

const mockedApi = {
  getQueryParam(value: string) { return; },
  setQueryParams(obj) { return; },
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

  // it("should accept colors through channel and render the correct swatches with a default swatch", () => {
  //   const SpiedChannel = new EventEmitter();
  //   const backgroundPanel = TestUtils.renderIntoDocument(<BackgroundPanel channel={SpiedChannel} api={mockedApi} />);
  //   SpiedChannel.emit("background-set", backgrounds);

  //   expect(backgroundPanel.state.backgrounds[0].name).toBe(backgrounds[0].name);
  //   expect(backgroundPanel.state.backgrounds[2].value).toBe(backgrounds[2].value);

  //   //check to make sure the default bg was added
  //   expect(backgroundPanel.state.backgrounds[4].value).toBe("transparent");
  // });

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
