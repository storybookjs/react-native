import React, { Component } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';

const Context = React.createContext();

class Provider extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {
    grid: false,
    value: 'transparent',
  };

  setValue = value => this.setState({ value });

  setGrid = grid => this.setState({ grid });

  render() {
    const { setValue, setGrid } = this;
    const { children } = this.props;
    const { value, grid } = this.state;

    return (
      <Context.Provider value={{ value, setValue, grid, setGrid }}>{children}</Context.Provider>
    );
  }
}

const { Consumer } = Context;

function createGridStyles(cellSize) {
  const cellSizeDoubled = cellSize * 2;
  const cellSizeSquared = cellSize ** 2;

  const gridSVGEncoded = encodeURIComponent(
    renderToStaticMarkup(
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
            <path
              d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`}
              fill="none"
              stroke="gray"
              strokeWidth="0.5"
            />
          </pattern>
          <pattern
            id="grid"
            width={cellSizeSquared}
            height={cellSizeSquared}
            patternUnits="userSpaceOnUse"
          >
            <rect width={cellSizeSquared} height={cellSizeSquared} fill="url(#smallGrid)" />
            <path
              d={`M ${cellSizeSquared} 0 L 0 0 0 ${cellSizeSquared}`}
              fill="none"
              stroke="gray"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    )
  );

  return {
    backgroundImage: `url("data:image/svg+xml,${gridSVGEncoded}")`,
    backgroundSize: `${cellSizeSquared}px ${cellSizeSquared}px, ${cellSizeSquared}px ${cellSizeSquared}px, ${cellSizeDoubled}px ${cellSizeDoubled}px, ${cellSizeDoubled}px ${cellSizeDoubled}px`,
    backgroundPosition: '-2px -2px',
    mixBlendMode: 'difference',
  };
}

const Grid = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  ({ theme }) => createGridStyles(theme.background.gridCellSize)
);

const Background = styled.div(
  {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    transition: 'background .1s linear',
    iframe: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      border: '0 none',
    },
  },
  ({ theme }) => ({ background: theme.background.content })
);

export { Grid, Background, Consumer as BackgroundConsumer, Provider as BackgroundProvider };
