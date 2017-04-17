import React from 'react';
import { Flex, Box } from 'reflexbox';
const { localStorage } = window;

const styles = {
  toolbar: {
    marginBottom: 10,
    fontSize: 11,
    fontFamily: '-apple-system, ".SFNSText-Regular", "San Francisco", Roboto, "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif',
  },

  toolbarButton: {
    marginRight: 10,
    border: 0,
    backgroundColor: '#fff',
    textTransform: 'uppercase',
    cursor: 'pointer',
    outline: 0,
    letterSpacing: 0.5,
    WebkitFontSmoothing: 'antialiased',
  },

  wrapper: {
    padding: 10,
  },

  heading: {
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    fontSize: 20,
    margin: '10px 0',
    padding: '0',
  },

  container: {
    border: '1px dashed #DDD',
  },
};

export default class WithDesign extends React.Component {
  constructor(...args) {
    super(...args);
    const type = localStorage.getItem('WITH_DESIGN_TYPE') || 'COMPARE';
    this.state = { type };

    this.calculateScale = this.calculateScale.bind(this);
  }

  tryCalculateScale() {
    const calculate = () => {
      // Sometimes, this code may after this instance is unmounted.
      // Specially when navigating between stories quickly.
      // So, we need to handle it.
      if (this.unmounted) return;
      this.calculateScale();
    };

    // This is some bad code where we are trying to do the scale based on
    // some data from the actutal DOM.
    // We don't have way(or I don't know how) to determine when to detect DOM
    // complete it's rendering.
    // So, to do that, we need to run this logic in muliple times.
    // It's ugly. But safe and working.
    calculate();
    setTimeout(calculate, 0);
    setTimeout(calculate, 50);
    setTimeout(calculate, 100);
    setTimeout(calculate, 200);
    setTimeout(calculate, 500);
  }

  calculateScale() {
    const designImage = this.refs.design;
    if (!designImage) {
      this.setState({ implementationScale: 1 });
      return;
    }

    const implementationScale = designImage.width / designImage.naturalWidth;
    this.setState({ implementationScale });
  }

  componentDidMount() {
    window.addEventListener('resize', this.calculateScale);
    this.tryCalculateScale();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateScale);
    this.unmounted = true;
  }

  renderToolbar() {
    const { type: currentType } = this.state;

    const changeState = type => () => {
      localStorage.setItem('WITH_DESIGN_TYPE', type);
      this.setState({ type });
      this.tryCalculateScale();
    };

    const buttons = [
      ['Side by Side', 'COMPARE'],
      ['One After Other', 'SHOW_BOTH'],
      ['Implementation', 'SHOW_IMPLEMENTATION'],
      ['Design', 'SHOW_DESIGN'],
    ].map(([caption, typeName]) => {
      const style = {
        ...styles.toolbarButton,
        fontWeight: currentType === typeName ? 600 : 400,
      };

      return (
        <button style={style} onClick={changeState(typeName)} key={typeName}>
          {caption}
        </button>
      );
    });

    return (
      <div style={styles.toolbar}>
        {buttons}
      </div>
    );
  }

  renderDesign(options = {}) {
    const { scaleImage = true } = options;
    const { design } = this.props;
    const designStyle = {};
    if (scaleImage) {
      designStyle.width = '100%';
    }

    return (
      <div>
        <div style={styles.container}>
          <img ref="design" style={designStyle} src={design} />
        </div>
      </div>
    );
  }

  renderImplementation() {
    const { children } = this.props;
    const { implementationScale = 1 } = this.state;

    const containerStyle = {
      ...styles.container,
      zoom: implementationScale,
    };

    return (
      <div>
        <div style={containerStyle}>
          {children}
        </div>
      </div>
    );
  }

  render() {
    const { type } = this.state;

    switch (type) {
      case 'SHOW_DESIGN':
        return (
          <div style={styles.wrapper}>
            {this.renderToolbar()}
            {this.renderDesign({ scaleImage: false })}
          </div>
        );

      case 'SHOW_IMPLEMENTATION':
        return (
          <div style={styles.wrapper}>
            {this.renderToolbar()}
            {this.renderImplementation()}
          </div>
        );

      case 'COMPARE':
        return (
          <div style={styles.wrapper}>
            {this.renderToolbar()}
            <Flex>
              <Box col={6}>{this.renderDesign()}</Box>
              <Box col={6}>{this.renderImplementation()}</Box>
            </Flex>
          </div>
        );

      case 'SHOW_BOTH':
      default:
        return (
          <div style={styles.wrapper}>
            {this.renderToolbar()}
            {this.renderDesign()}
            {this.renderImplementation()}
          </div>
        );
    }
  }
}
