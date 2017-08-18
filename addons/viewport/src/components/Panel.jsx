import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { viewports, resetViewport } from './viewportInfo';

const storybookIframe = 'storybook-preview-iframe';
const defaultViewport = 'default';

export class Panel extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            viewport: defaultViewport,
            isLandscape: false,
        };

        this.props.channel.on('addon:viewport:update', this.changeViewport);
    }

    componentDidMount() {
        this.iframe = document.getElementById(storybookIframe);
    }

    iframe = undefined;

    changeViewport = viewport => {
        const { viewport: previousViewport, isLandscape } = this.state;

        if (previousViewport !== viewport) {
            this.setState({
                viewport,
                isLandscape: false,
            }, this.updateIframe);
        } else {
            this.updateIframe();
        }
    };

    toggleLandscape = () => {
        const { isLandscape } = this.state;

        // TODO simplify the state management
        // ideally we simply dispatch an action to the iframe
        this.setState({
            isLandscape: !isLandscape,
        }, () => {
            this.changeViewport(this.state.viewport);
        });
    }

    updateIframe() {
        const { viewport: viewportKey, isLandscape } = this.state;
        const viewport = viewports[viewportKey] || resetViewport;

        if (!this.iframe) {
            throw new Error('Cannot find Storybook iframe');
        }

        Object.keys(viewport.styles).forEach(prop => {
            this.iframe.style[prop] = viewport.styles[prop];
        });

        if (isLandscape) {
            this.iframe.style.height = viewport.styles.width;
            this.iframe.style.width = viewport.styles.height;
        }
    }

    render() {
        const { isLandscape, viewport } = this.state;

        return (
            <div style={{padding: 15}}>
                <div style={{ display: 'flex' }}>
                    <select value={viewport} onChange={e => this.changeViewport(e.target.value)}>
                        <option value={defaultViewport}>
                            Default
                        </option>

                        { Object.keys(viewports).map(key => (
                            <option value={key} key={key}>
                                {viewports[key].name}
                            </option>
                        ))}
                    </select>

                    <button onClick={() => this.changeViewport(defaultViewport)}>
                        Reset
                    </button>
                </div>

                <div>
                    <button onClick={this.toggleLandscape} disabled={viewport === defaultViewport}>
                        Switch to {isLandscape ? 'Vertical' : 'Landscape'}
                    </button>
                </div>

                <div>
                    <h3>Responsive</h3>
                    <div>
                        <input type="text" placeholder="height" />
                        <span>px</span>
                    </div>
                    <div>
                        <input type="text" placeholder="width" />
                        <span>px</span>
                    </div>
                </div>
            </div>
        );
    }
}
