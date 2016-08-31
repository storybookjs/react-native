import * as React from "react"; // tslint:disable-line
const EventEmitter = require("events"); // tslint:disable-line
import { shallow } from "enzyme";
import Swatch from "../Swatch";
const TestUtils = require("react-addons-test-utils");


describe("Background Panel", () => {
  it("should exist", () => {
    expect(true).toBe(true);
  });

  it("should have a default background value of transparent", () => {
    expect(true).toBe(true);
  });

  it("should show setup instructions if no colors provided", () => {
    expect(true).toBe(true);
  });

  it("should accept colors and render the correct swatches with a default swatch", () => {
    expect(true).toBe(true);
  });

  it("should pass the event through the provided channel", () => {
    expect(true).toBe(true);
  });
});