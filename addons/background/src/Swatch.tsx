
import * as React from "react";
import assign = require("object-assign");

const style = {
  swatches: {
    textAlign: "center",
    padding: "0",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-block",
    width: "175px",
    verticalAlign: "top",
    wordWrap: "break-word",
  },
  swatch: {
    height: "80px",
    borderRadius: "4px 4px 0 0",
    transition: "opacity 0.25s ease-in-out",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  listStyle: { listStyle: "none" },
  pushBottom: { marginBottom: "10px" },
  pushLeft: { marginLeft: "10px" },
  soft: { paddingLeft: "10px", paddingRight: "10px" },
  hard: { padding: "0" },
  flush: { margin: "0" },
};

export interface BackgroundItemProps {
  value: string;
  name?: string;
  channel: NodeJS.EventEmitter;
}

export default class Swatch extends React.Component<BackgroundItemProps, any> {

  state = { selected: null };

  componentWillMount() {
    this.setState({ selected: this.props.value });
  }

  public onBackgroundChange = () => {
    const { value, channel } = this.props;
    channel.emit("background", value);
  }

  render () {
    return (
      <div
        style={assign({}, style.swatches, style.listStyle, style.hard)}
        onClick={this.onBackgroundChange}
      >
        <div
          style={assign({}, style.swatch, {
            background: this.props.value,
            "backgroundSize": "cover",
            "backgroundPosition": "center",
          })}
        >
        </div>
        <div style={assign({}, style.listStyle, style.soft)}>
          <h4 style={{ float: "left" }}>
            {this.props.name}:
          </h4>
          <h4 style={{ float: "right" }}>
            <em>{this.props.value}</em>
          </h4>
        </div>
      </div>
    );
  }
}
