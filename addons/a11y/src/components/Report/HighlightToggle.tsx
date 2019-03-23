import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';
import { RuleType } from '../A11YPanel';
import { addElement } from '../../redux-config';
import { IFRAME } from '../../constants';

const Checkbox = styled.input({
  cursor: 'pointer',
});

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

function areAllRequiredElementsHiglighted(
  elementsToHighlight: NodeResult[],
  highlightedElementsMap: Map<HTMLElement, HighlightedElementData>
): boolean {
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
  addElement?: (data: any) => void;
  highlightedElementsMap?: Map<HTMLElement, HighlightedElementData>;
  isToggledOn?: boolean;
  toggleID?: string;
}

function mapDispatchToProps(dispatch: any) {
  return {
    addElement: (data: any) => dispatch(addElement(data)),
  };
}

const mapStateToProps = (state: any, ownProps: any) => {
  const isToggledOn = areAllRequiredElementsHiglighted(
    ownProps.elementsToHighlight,
    state.highlightedElementsMap
  );
  return {
    highlightedElementsMap: state.highlightedElementsMap,
    isToggledOn,
  };
};

class HighlightToggle extends Component<ToggleProps, {}> {
  static defaultProps = {
    elementsToHighlight: [],
  };

  componentDidMount() {
    for (let element of this.props.elementsToHighlight) {
      const targetElement = getElementBySelectorPath(element.target[0]);
      if (targetElement && !this.props.highlightedElementsMap.get(targetElement)) {
        this.saveElementDataToMap(
          targetElement,
          false,
          targetElement.style.outline,
          this.props.type
        );
      }
    }
  }

  higlightRuleLocation(targetElement: HTMLElement, addHighlight: boolean): void {
    if (targetElement) {
      if (addHighlight) {
        switch (this.props.type) {
          case RuleType.PASS:
            this.setTargetElementOutlineStyle(targetElement, `1px dotted #66BF3C`);
            break;
          case RuleType.VIOLATION:
            this.setTargetElementOutlineStyle(targetElement, `1px dotted #FF4400`);
            break;
          case RuleType.INCOMPLETION:
            this.setTargetElementOutlineStyle(targetElement, `1px dotted #E69D00`);
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

  saveElementDataToMap(
    targetElement: HTMLElement,
    isHighlighted: boolean,
    originalOutline: string,
    ruleTypeState: RuleType
  ): void {
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
      if (this.props.highlightedElementsMap.get(targetElement)) {
        let originalOutline = this.props.highlightedElementsMap.get(targetElement).originalOutline;
        if (
          this.props.isToggledOn &&
          this.props.highlightedElementsMap.get(targetElement).isHighlighted
        ) {
          this.higlightRuleLocation(targetElement, false);
          this.saveElementDataToMap(targetElement, false, originalOutline, this.props.type);
        } else if (
          !this.props.isToggledOn &&
          !this.props.highlightedElementsMap.get(targetElement).isHighlighted
        ) {
          this.higlightRuleLocation(targetElement, true);
          this.saveElementDataToMap(targetElement, true, originalOutline, this.props.type);
        }
      }
    }
  }

  render() {
    return (
      <Checkbox
        type="checkbox"
        id={this.props.toggleID}
        disabled={this.props.elementsToHighlight.length === 0}
        onChange={() => this.onToggle()}
        checked={this.props.isToggledOn}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightToggle);
