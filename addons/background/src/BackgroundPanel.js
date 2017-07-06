import React from "react";
import addons from "@storybook/addons";

import Swatch from "./Swatch";

const style = {
  font: {
    fontFamily: "-apple-system,'.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: "14px",
  },
};

const defaultBackground = {
  name: "default",
  value: "transparent",
};

const __html = `
import { storiesOf } from "@storybook/react";
import backgrounds from "@storybook/addon-backgrounds";

storiesOf("First Component", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("First Button", () => &lt;button&gt;Click me&lt;/button&gt;);
`.trim();

const Instructions = () => (
  <div style={Object.assign({ padding: "20px" }, style.font)}>
    <h5 style={{ fontSize: "16px" }}>Setup Instructions</h5>
    <p>Please add the background decorator definition to your story.
    The background decorate accepts an array of items, which should include a
    name for your color (preferably the css class name) and the corresponding color / image value.</p>
    <p>Below is an example of how to add the background decorator to your story definition.</p>
    <pre style={{
      padding: "30px",
      display: "block",
      background: "rgba(19,19,19,0.9)",
      color: "rgba(255,255,255,0.95)",
      marginTop: "15px",
      lineHeight: "1.75em",
    }}><code dangerouslySetInnerHTML={{ __html }} /></pre>
  </div>
);

export default class BackgroundPanel extends React.Component {
  constructor(props) {
    super(props);

    // A channel is explicitly passed in for testing
    if (this.props.channel) {
      this.channel = this.props.channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.state = { backgrounds: [] }

    this.channel.on("background-set", backgrounds => {
      this.setState({ backgrounds });
      const currentBackground = this.props.api.getQueryParam("background");

      if (currentBackground) {
        this.setBackgroundInPreview(currentBackground);
      } else if (backgrounds.filter(x => x.default).length) {
        const defaultBgs = backgrounds.filter(x => x.default);
        this.setBackgroundInPreview(defaultBgs[0].value);
      }
    });

    this.channel.on("background-unset", backgrounds => {
      this.setState({ backgrounds: [] });
      this.props.api.setQueryParams({ background: null });
    });
  }

  setBackgroundInPreview = (background) => this.channel.emit("background", background);

  setBackgroundFromSwatch = (background) => {
    this.setBackgroundInPreview(background);
    this.props.api.setQueryParams({ background });
  }

  render () {
    const backgrounds = [...this.state.backgrounds];

    if (!backgrounds.length) return <Instructions />;

    const hasDefault = backgrounds.filter(x => x.default).length;
    if (!hasDefault) backgrounds.push(defaultBackground);

    return (
      <div style={{display: "inline-block", padding: "15px"}}>
        {backgrounds.map(({ value, name }, key) => (
          <div key={key} style={{display: "inline-block", padding: "5px"}}>
            <Swatch value={value} name={name} setBackground={this.setBackgroundFromSwatch} />
          </div>
        ))}
      </div>
    );
  }
};
