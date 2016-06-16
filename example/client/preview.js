import React from 'react';

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
        })
      } else {
        this.state = {
          ...this.state,
          kind,
          story,
        };
      }
    });
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  fireAction() {
    const { kind, story } = this.state;
    const message = `This is an action from ${kind}:${story}`;
    this.globalState.emit('action', message);
  }

  jump() {
    const { kind, story } = this.state;
    this.globalState.emit('jump', 'Component 2', 'State b');
  }

  toggleFullscreen() {
    this.globalState.emit('toggleFullscreen');
  }

  render() {
    const { kind, story } = this.state;
    return (
      <div style={{padding: 10}}>
        <h3>Rendering the Preview</h3>
        {kind} => {story}
        <br/>
        <button onClick={this.fireAction.bind(this)}>Fire an Action</button>
        <br/>
        <button onClick={this.jump.bind(this)}>Jump to Component2:State b</button>
        <br/>
        <button onClick={this.toggleFullscreen.bind(this)}>Go FullScreen</button>
      </div>
    );
  }
}
