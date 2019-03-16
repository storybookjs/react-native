import React, { Component, Fragment } from 'react';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleTypes } from '../A11YPanel';

const Switch = styled.label({
  position: 'relative',
  display: 'inline-block',
  width: '40px',
  height: '20px',
  marginLeft: '10px',
  marginBottom: '-5px',
});

const Checkbox = styled.input({
  display: 'none',
});

const Slider = styled.span(
  {
    position: 'absolute',
    cursor: 'pointer',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    webkitTransition: '0.4s',
    transition: '0.4s',
    borderRadius: '34px',
    '&:before': {
      position: 'absolute',
      content: '""',
      height: '15px',
      width: '15px',
      left: '4px',
      bottom: '3px',
      backgroundColor: '#fff',
      webkitTransition: '0.4s',
      transition: '0.4s',
      borderRadius: '50%',
    },
  },
  ({ checked }: { checked: boolean | null }) => ({
    backgroundColor: checked === true ? 'green' : '#d0d0d0',
  }),
  ({ checked }: { checked: boolean | null }) => ({
    '&:before': {
      transform: checked === true ? 'translateX(17px)' : '',
    },
  })
);

interface ToggleProps {
  elements: any[];
  type: RuleTypes;
}

interface ToggleState {
  isToggleOn: boolean;
  originalOutlineElementMap: Map<any, string> | null;
}

export class HighlightToggle extends Component<ToggleProps, ToggleState> {
  state = {
    isToggleOn: false,
    originalOutlineElementMap: new Map(),
  };

  getIframe = memoize(1)(() => document.getElementsByTagName('iframe')[0]);

  componentDidMount() {
    if (this.props && this.props.elements) {
      for (let element of this.props.elements) {
        if (element.target[0]) {
          const targetElement = this.getIframe().contentDocument.querySelector(element.target[0]);
          if (targetElement && !this.state.originalOutlineElementMap.get(targetElement)) {
            this.state.originalOutlineElementMap.set(targetElement, targetElement.style.outline);
          }
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props && this.props.elements) {
      for (let element of this.props.elements) {
        if (element.target[0]) {
          const targetElement = this.getIframe().contentDocument.querySelector(element.target[0]);
          if (targetElement) {
            targetElement.style.outline = this.state.originalOutlineElementMap.get(targetElement);
          }
        }
      }
    }
  }

  higlightRuleLocations: any = (elements: any[], addHighlight: boolean) => {
    for (let element of elements) {
      const targetElement = this.getIframe().contentDocument.querySelector(element.target[0]);
      if (addHighlight) {
        switch (this.props.type) {
          case RuleTypes.PASSES:
            targetElement.style.outline = '2px dotted green';
            break;
          case RuleTypes.VIOLATIONS:
            targetElement.style.outline = '2px dotted red';
            break;
          case RuleTypes.INCOMPLETIONS:
            targetElement.style.outline = '2px dotted orange';
            break;
        }
      } else {
        targetElement.style.outline = this.state.originalOutlineElementMap.get(targetElement);
    }
    }
  };

  onToggle = () => {
    this.setState(() => {
      this.higlightRuleLocations(this.props.elements, !this.state.isToggleOn);
      return { isToggleOn: !this.state.isToggleOn, originalOutlineElementMap: this.state.originalOutlineElementMap };
    });
  };

  render() {
    return (
      <Switch>
        <Checkbox type="checkbox" onChange={this.onToggle} checked={this.state.isToggleOn} />
        <Slider checked={this.state.isToggleOn} />
      </Switch>
    );
  }
}
