import * as React from "react";

import Swatch from "./Swatch";

export interface BackgroundDetail {
  name?: string;
  value: string;
}

export interface BackgroundPanelProps {
  channel: NodeJS.EventEmitter;
}

const defaultBackground: BackgroundDetail = {
  name: "default",
  value: "transparent",
};

export default class BackgroundPanel extends React.Component<BackgroundPanelProps, any> {

  state = { backgrounds: [] };

  constructor(props) {
    super(props);
    this.props.channel.on("background-set", backgrounds => this.setState({ backgrounds }));
    this.props.channel.on("background-unset", backgrounds => this.setState({ backgrounds: [] }));
  }

  render () {

    const { channel } = this.props;
    const backgrounds: BackgroundDetail[] = [...this.state.backgrounds];

    if (!backgrounds.length) {
      return (
        <div style={{padding: "20px"}}>
          <h5>Setup Instructions</h5>
        </div>
      );
    }

    // add reset as last option
    backgrounds.push(defaultBackground);
    return (
      <div style={{display: "inline-block", padding: "15px"}}>
        {backgrounds.map((background, key) => (
          <div key={key} style={{display: "inline-block", padding: "5px"}}>
            <Swatch value={background.value} name={background.name} channel={channel} />
          </div>
        ))}
      </div>
    );
  }
};
