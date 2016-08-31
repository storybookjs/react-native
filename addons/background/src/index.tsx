import * as React from "react";
import addons from "@kadira/storybook-addons";

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

    this.channel = addons.getChannel();
    this.story = this.props.story();

    this.channel.on("background", background => this.setState({ background }));
  }

  componentWillUnmount() {
    this.channel.emit("background-unset");
  }

  componentWillMount() {
    this.channel.emit("background-set", this.props.backgrounds);
  }

  public render() {
    const styles = style.wrapper;
    styles.backgroundColor = this.state.background;
    return <div style={styles}>{this.story}</div>;
  }
}

export default backgrounds => story => (
  <BackgroundDecorator story={story} backgrounds={backgrounds} />
);
