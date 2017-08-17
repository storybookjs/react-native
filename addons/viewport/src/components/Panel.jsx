import React, { Component } from 'react';
import { viewports } from './viewportInfo';

const storybookIframe = 'storybook-preview-iframe';
const configuredStyles = {
    border: '1px solid #728099',
    display: 'flex',
    margin: '0 auto',
    boxShadow: 'rgba(0,0,0,0.2) 0px 0px 60px 12px',
};


export class Panel extends Component {
    static propTypes = {
        channel: PropTypes.object.isRequired,
    }

    iframe = undefined;

    constructor(props, context) {
        super(props, context);
        this.state = { viewport: null };

        this.props.channel.on(
            'addon:viewport:update',
            this.changeViewport
        );
    }

    componentDidMount() {
        this.iframe = document.getElementById(storybookIframe);
    }

    setIframeStyles(styles) {
        this.iframe.style = styles;
    }

    changeViewport = (viewport) => {
        const size = viewports[viewport] || viewports.reset;
        this.setIframeStyles(viewport.styles);
    }

    render() {
        return (
            <div>
                { viewportSizes.map((viewport) => {
                    <button onClick={() => this.changeViewport(viewport)}>
                        {viewport.name}
                    </button>
                })}
            </div>
        );
    }
}
