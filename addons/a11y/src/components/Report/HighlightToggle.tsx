import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import { addElement } from '../../redux-config';

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

export class HighlightedElementData {
  ruleTypeState: RuleType;
  originalOutline: string;
  isHighlighted: boolean;
}

interface ToggleProps {
  elementsToHighlight: any[];
  type: RuleType;
  addElement?: any;
  highlightedElementsMap?: Map<Element, HighlightedElementData>;
}

interface ToggleState {
  isToggleOn: boolean;
}

function mapDispatchToProps(dispatch: any) {
  return {
    addElement: (data: any) => dispatch(addElement(data)),
  };
}

const mapStateToProps = (state: any) => {
  return { highlightedElementsMap: state.highlightedElementsMap };
};

class HighlightToggle extends Component<ToggleProps, ToggleState> {
  state = {
    isToggleOn: false,
  };

  getIframe = memoize(1)(() => document.getElementsByTagName('iframe')[0]);

  componentDidMount() {
    if (this.props && this.props.elementsToHighlight) {
      for (let element of this.props.elementsToHighlight) {
        const targetElement = this.getTargetElement(element.target[0]);
        if (targetElement && !this.props.highlightedElementsMap.get(targetElement)) {
          this.saveElementDataToMap(targetElement, false, targetElement.style.outline, this.props.type);
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.props && this.props.elementsToHighlight) {
      for (let element of this.props.elementsToHighlight) {
        const targetElement = this.getTargetElement(element.target[0]);
        if (targetElement && this.props.highlightedElementsMap.get(targetElement)) {
          this.setTargetElementOutlineStyle(
            targetElement,
            this.props.highlightedElementsMap.get(targetElement).originalOutline
          );
        }
      }
    }
  }

  higlightRuleLocations(elements: any[], addHighlight: boolean): void {
    for (let element of elements) {
      const targetElement = this.getTargetElement(element.target[0]);
      if (targetElement) {
        if (addHighlight) {
          switch (this.props.type) {
            case RuleType.PASS:
              this.setTargetElementOutlineStyle(targetElement, '2px dotted green');
              break;
            case RuleType.VIOLATION:
              this.setTargetElementOutlineStyle(targetElement, '2px dotted red');
              break;
            case RuleType.INCOMPLETION:
              this.setTargetElementOutlineStyle(targetElement, '2px dotted orange');
              break;
          }
        } else {
          if (this.props.highlightedElementsMap.get(targetElement)) {
            this.setTargetElementOutlineStyle(
              targetElement,
              this.props.highlightedElementsMap.get(targetElement).originalOutline
            );
          }
        }
        if (this.props.highlightedElementsMap.get(targetElement)) {
          this.saveElementDataToMap(targetElement, !this.state.isToggleOn, this.props.highlightedElementsMap.get(targetElement).originalOutline, this.props.type)
        }
      }
    }
  }

  saveElementDataToMap(targetElement: any, isHighlighted: boolean, originalOutline: string, ruleTypeState: RuleType): void {
    const data: HighlightedElementData = new HighlightedElementData();
    data.isHighlighted = isHighlighted;
    data.originalOutline = originalOutline;
    data.ruleTypeState = ruleTypeState;
    const payload = {
      element: targetElement,
      highlightedElementData: data,
    };
    this.props.addElement(payload);
  }

  setTargetElementOutlineStyle(targetElement: any, outlineStyle: string): void {
    targetElement.style.outline = outlineStyle;
  }

  getTargetElement(elementPath: string): any {
    const iframe = this.getIframe();
    if (iframe && elementPath) {
      return iframe.contentDocument.querySelector(elementPath);
    }
    return null;
  }

  onToggle(): any {
    this.setState(() => {
      this.higlightRuleLocations(this.props.elementsToHighlight, !this.state.isToggleOn);
      return { isToggleOn: !this.state.isToggleOn, highlightedElementsMap: this.props.highlightedElementsMap};
    });
  };


  render() {
    return (
      <Switch>
        <Checkbox type='checkbox' onChange={() => this.onToggle()} checked={this.state.isToggleOn} />
        <Slider checked={this.state.isToggleOn} />
      </Switch>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightToggle);
