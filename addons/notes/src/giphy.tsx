import React from 'react';
import * as PropTypes from 'prop-types';

interface Props {
  gif: String;
}
interface GiphyState {
  src?: string;
}
export default class Giphy extends React.Component<Props, GiphyState> {
  static propTypes = {
    gif: PropTypes.string.isRequired,
  };
  constructor(props: any) {
    super(props);
    this.state = {
      src: null,
    };
    fetch(`http://api.giphy.com/v1/gifs/search?limit=1&api_key=dc6zaTOxFJmzC&q=${props.gif}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        this.setState({ src: data.data[0].images.original.url });
      });
  }
  render() {
    return <img src={this.state.src} />;
  }
}
