import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { styled, themes, convert } from '@storybook/theming';
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
  if (elementsToHighlight) {
    for (let element of elementsToHighlight) {
      if (element) {
        const targetElement = getElementBySelectorPath(element.target[0]);
        if (highlightedElementsMap.get(targetElement)) {
          elementsInMapExist = true;
          if (!highlightedElementsMap.get(targetElement).isHighlighted) {
            return false;
          }
        }
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
  toggleId?: string;
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
  static defaultProps: Partial<ToggleProps> = {
    elementsToHighlight: [],
  };

  componentDidMount() {
    for (let element of this.props.elementsToHighlight) {
      if (element) {
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
  }

  higlightRuleLocation(targetElement: HTMLElement, addHighlight: boolean): void {
    const OUTLINE_STYLE = `dotted`;
    const OUTLINE_WIDTH = `1px`;
    if (targetElement) {
      if (addHighlight) {
        switch (this.props.type) {
          case RuleType.PASS:
            this.setTargetElementOutlineStyle(targetElement, `${convert(themes.normal).color.positive} ${OUTLINE_STYLE} ${OUTLINE_WIDTH}`);
            break;
          case RuleType.VIOLATION:
            this.setTargetElementOutlineStyle(targetElement, `${convert(themes.normal).color.negative} ${OUTLINE_STYLE} ${OUTLINE_WIDTH}`);
            break;
          case RuleType.INCOMPLETION:
            this.setTargetElementOutlineStyle(targetElement, `${convert(themes.normal).color.warning} ${OUTLINE_STYLE} ${OUTLINE_WIDTH}`);
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
    const payload = { element: targetElement, highlightedElementData: data };
    this.props.addElement(payload);
  }

  setTargetElementOutlineStyle(targetElement: HTMLElement, outlineStyle: string): void {
    targetElement.style.outline = outlineStyle;
  }

  onToggle(): void {
    for (let element of this.props.elementsToHighlight) {
      if (element) {
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
  }

  render() {
    return (
      <Checkbox
        id={this.props.toggleId}
        type="checkbox"
        aria-label="Highlight result"
        disabled={this.props.elementsToHighlight && this.props.elementsToHighlight.length === 0 ? true : false}
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
