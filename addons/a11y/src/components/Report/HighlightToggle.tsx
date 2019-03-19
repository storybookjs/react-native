import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import { addElement } from '../../redux-config';
import { IFRAME } from '../../constants';

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
    backgroundColor: checked === true ? '#66BF3C' : '#DDDDDD', // positive and medium
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

const getIframe = memoize(1)(() => document.getElementsByTagName(IFRAME)[0]);

function getElementBySelectorPath(elementPath: string): HTMLElement {
  const iframe = getIframe();
  if (iframe && iframe.contentDocument && elementPath) {
    return iframe.contentDocument.querySelector(elementPath);
  }
  return null;
}

function areAllRequiredElementsHiglighted(elementsToHighlight: NodeResult[], highlightedElementsMap: Map<HTMLElement, HighlightedElementData>): boolean {
  let elementsInMapExist = false;
  for (let element of elementsToHighlight) {
    const targetElement = getElementBySelectorPath(element.target[0]);
    if (highlightedElementsMap.get(targetElement)) {
      elementsInMapExist = true;
      if (!highlightedElementsMap.get(targetElement).isHighlighted) {
        return false;
      }
    }
  }
  return elementsInMapExist;
}

interface ToggleProps {
  elementsToHighlight: NodeResult[];
  type: RuleType;
  addElement?: any;
  highlightedElementsMap?: Map<HTMLElement, HighlightedElementData>;
  isToggledOn?: boolean;
}

function mapDispatchToProps(dispatch: any) {
  return {
    addElement: (data: any) => dispatch(addElement(data)),
  };
}

const mapStateToProps = (state: any, ownProps: any) => {
  const isToggledOn = areAllRequiredElementsHiglighted(ownProps.elementsToHighlight, state.highlightedElementsMap);
  return {
    highlightedElementsMap: state.highlightedElementsMap,
    isToggledOn: isToggledOn,
  };
};

class HighlightToggle extends Component<ToggleProps, {}> {

  componentDidMount() {
    if (this.props && this.props.elementsToHighlight) {
      for (let element of this.props.elementsToHighlight) {
        const targetElement = getElementBySelectorPath(element.target[0]);
        if (targetElement && !this.props.highlightedElementsMap.get(targetElement)) {
          this.saveElementDataToMap(targetElement, false, targetElement.style.outline, this.props.type);
        }
      }
    }
  }

  higlightRuleLocation(targetElement: HTMLElement, addHighlight: boolean): void {
    if (targetElement) {
      if (addHighlight) {
        switch (this.props.type) {
          case RuleType.PASS:
            this.setTargetElementOutlineStyle(targetElement, `2px dotted #66BF3C`);
            break;
          case RuleType.VIOLATION:
            this.setTargetElementOutlineStyle(targetElement, `2px dotted #FF4400`);
            break;
          case RuleType.INCOMPLETION:
            this.setTargetElementOutlineStyle(targetElement, `2px dotted #E69D00`);
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
    }
  }

  saveElementDataToMap(targetElement: HTMLElement, isHighlighted: boolean, originalOutline: string, ruleTypeState: RuleType): void {
    const data: HighlightedElementData = new HighlightedElementData();
    data.isHighlighted = isHighlighted;
    data.originalOutline = originalOutline;
    data.ruleTypeState = ruleTypeState;
    const payload = { element: targetElement, highlightedElementData: data };
    this.props.addElement(payload);
  }

  setTargetElementOutlineStyle(targetElement: HTMLElement, outlineStyle: string): void {
    targetElement.style.outline = outlineStyle;
  }

  onToggle(): void {
    for (let element of this.props.elementsToHighlight) {
      const targetElement = getElementBySelectorPath(element.target[0]);
      let originalOutline = this.props.highlightedElementsMap.get(targetElement).originalOutline;
      if (this.props.highlightedElementsMap.get(targetElement)) {
        if (this.props.isToggledOn && this.props.highlightedElementsMap.get(targetElement).isHighlighted) {
          this.higlightRuleLocation(targetElement, false);
          this.saveElementDataToMap(targetElement, false, originalOutline, this.props.type);
        } else if (!this.props.isToggledOn && !this.props.highlightedElementsMap.get(targetElement).isHighlighted) {
          this.higlightRuleLocation(targetElement, true);
          this.saveElementDataToMap(targetElement, true, originalOutline, this.props.type);
        }
      }
    }
  }

  render() {
    return (
      <Switch>
        <Checkbox type="checkbox" onChange={() => this.onToggle()} checked={this.props.isToggledOn}/>
        <Slider checked={this.props.isToggledOn} />
      </Switch>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightToggle);
