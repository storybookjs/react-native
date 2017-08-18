import React from 'react';

const mainStyle = {
  padding: 10,
  fontFamily: 'arial',
};

export default class Preview extends React.Component {
  constructor(globalState) {
    super();
    this.state = {};
    this.globalState = globalState;

    this.globalState.on('change', (kind, story) => {
      if (this.mounted) {
        this.setState({
          kind,
          story,
        });
      } else {
        this.state = {
          ...this.state,
          kind,
          story,
        };
      }
    });

    this.jump = this.jump.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  jump() {
    this.globalState.emit('jump', 'some/name/Component 2', 'State b');
  }

  toggleFullscreen() {
    this.globalState.emit('toggleFullscreen');
  }

  render() {
    const { kind, story } = this.state;
    return (
      <div style={mainStyle}>
        <h3>Rendering the Preview</h3>
        {kind} =&gt; {story}
        <ul>
          <li>
            <button onClick={this.jump}>Jump to some/name/Component2:State b</button>
          </li>
          <li>
            <button onClick={this.toggleFullscreen}>Go FullScreen</button>
          </li>
        </ul>
      </div>
    );
  }
}
