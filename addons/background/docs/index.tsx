import * as React from "react";
import addons from "@storybook/addons";
import assign = require("object-assign"); // tslint:disable-line

const style = {
  wrapper: {
    position: "fixed",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    transition: "background 0.25s ease-in-out",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor: "transparent",
  },
};

export class BackgroundDecorator extends React.Component<any, any> {

  private channel: NodeJS.EventEmitter;
  private story: any;

  public state = { background: "transparent" };

  constructor(props) {
    super(props);

    // A channel is explicitly passed in for testing
    if (this.props.channel) {
      this.channel = this.props.channel;
    } else {
      this.channel = addons.getChannel();
    }

    this.story = this.props.story();
  }

  componentWillMount() {
    this.channel.on("background", this.setBackground);
    this.channel.emit("background-set", this.props.backgrounds);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.story !== this.props.story) {
      this.story = nextProps.story();
    }
  }

  componentWillUnmount() {
    this.channel.removeListener("background", this.setBackground);
    this.channel.emit("background-unset");
  }

  private setBackground = background => this.setState({ background })

  render() {
    const styles = style.wrapper;
    styles.backgroundColor = this.state.background;
    return <div style={assign({}, styles)}>{this.story}</div>;
  }
}

export default backgrounds => story => (
  <BackgroundDecorator story={story} backgrounds={backgrounds} />
);
