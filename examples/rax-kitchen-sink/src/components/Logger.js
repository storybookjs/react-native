import { createElement, Component, PropTypes } from 'rax';
import EventEmitter from 'event-emitter';
import allOff from 'event-emitter/all-off';
import View from 'rax-view';
import Text from 'rax-text';
import Button from 'rax-button';

export const EVENTS = {
  TEST_EVENT_1: 'TEST_EVENT_1',
  TEST_EVENT_2: 'TEST_EVENT_2',
  TEST_EVENT_3: 'TEST_EVENT_3',
};

const styles = {
  button: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: '#000',
    padding: 5,
    border: 'none',
    boxShadow: 'none',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
  },
  container: {
    minHeight: '500px',
    width: '100%',
  },
  item: {
    backgroundColor: '#d2d2d2',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 5,
  },
};

class Logger extends Component {
  state = {
    events: [],
  };

  static propTypes = {
    emitter: PropTypes.instanceOf(EventEmitter).isRequired,
  };

  componentDidMount() {
    const { emitter } = this.props;

    Object.values(EVENTS).forEach(eventName => {
      emitter.on(eventName, this.onEvent.bind(this, eventName));
    });
  }

  componentWillUnmount() {
    const { emitter } = this.props;

    allOff(emitter);
  }

  onEvent = (name, payload) => {
    const { events } = this.state;
    this.setState({
      events: [...events, { name, payload }],
    });
  };

  clearEvents = () => {
    this.setState({
      events: [],
    });
  };

  renderEvent({ name, payload }) {
    return createElement(
      View,
      { style: styles.item },
      createElement(Text, null, '----------------------------------'),
      createElement(Text, null, `Name: ${name}`),
      createElement(Text, null, `Payload: ${JSON.stringify(payload)}`),
      createElement(Text, null, '----------------------------------')
    );
  }

  render() {
    const { events } = this.state;

    return (
      <View style={styles.container}>
        {events.map(this.renderEvent)}
        {events.length ? (
          <Button style={styles.button}>
            <Text style={styles.buttonText} onPress={this.clearEvents}>
              Clear logs
            </Text>
          </Button>
        ) : null}
      </View>
    );
  }
}

export default Logger;
