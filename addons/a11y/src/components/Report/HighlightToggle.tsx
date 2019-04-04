import React, { Component } from 'react';
import { connect } from 'react-redux';
import { styled, themes, convert } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { RuleType } from '../A11YPanel';
import { addElement } from '../../redux-config';
import { IFRAME } from '../../constants';

export class HighlightedElementData {
  originalOutline: string;
  isHighlighted: boolean;
}

interface ToggleProps {
  elementsToHighlight: NodeResult[];
  type: RuleType;
  addElement?: (data: any) => void;
  highlightedElementsMap?: Map<HTMLElement, HighlightedElementData>;
  isToggledOn?: boolean;
  toggleId?: string;
  indeterminate?: boolean;
}

enum CheckBoxStates {
  CHECKED,
  UNCHECKED,
  INDETERMINATE,
}

const Checkbox = styled.input(({ disabled }) => ({
  cursor: disabled ? 'not-allowed' : 'pointer',
}));

const colorsByType = [
  convert(themes.normal).color.negative, // VIOLATION,
  convert(themes.normal).color.positive, // PASS,
  convert(themes.normal).color.warning, // INCOMPLETION,
];

const getIframe = memoize(1)(() => document.getElementsByTagName(IFRAME)[0]);

function getElementBySelectorPath(elementPath: string): HTMLElement {
  const iframe = getIframe();
  if (iframe && iframe.contentDocument && elementPath) {
    return iframe.contentDocument.querySelector(elementPath);
  }
  return null;
}

function setElementOutlineStyle(targetElement: HTMLElement, outlineStyle: string): void {
  targetElement.style.outline = outlineStyle;
}

function areAllRequiredElementsHighlighted(
  elementsToHighlight: NodeResult[],
  highlightedElementsMap: Map<HTMLElement, HighlightedElementData>
): CheckBoxStates {
  const highlightedCount = elementsToHighlight.filter(item => {
    const targetElement = getElementBySelectorPath(item.target[0]);
    return (
      highlightedElementsMap.has(targetElement) &&
      highlightedElementsMap.get(targetElement).isHighlighted
    );
  }).length;

  return highlightedCount === 0
    ? CheckBoxStates.UNCHECKED
    : highlightedCount === elementsToHighlight.length
    ? CheckBoxStates.CHECKED
    : CheckBoxStates.INDETERMINATE;
}

function mapDispatchToProps(dispatch: any) {
  return {
    addElement: (data: { element: HTMLElement; data: HighlightedElementData }) =>
      dispatch(addElement(data)),
  };
}

const mapStateToProps = (state: any, ownProps: any) => {
  const checkBoxState = areAllRequiredElementsHighlighted(
    ownProps.elementsToHighlight || [],
    state.highlightedElementsMap
  );
  return {
    highlightedElementsMap: state.highlightedElementsMap,
    isToggledOn: checkBoxState === CheckBoxStates.CHECKED,
    indeterminate: checkBoxState === CheckBoxStates.INDETERMINATE,
  };
};

class HighlightToggle extends Component<ToggleProps> {
  static defaultProps: Partial<ToggleProps> = {
    elementsToHighlight: [],
  };

  private checkBoxRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.props.elementsToHighlight.forEach(element => {
      const targetElement = getElementBySelectorPath(element.target[0]);
      if (targetElement && !this.props.highlightedElementsMap.has(targetElement)) {
        this.saveElementDataToMap(targetElement, false, targetElement.style.outline);
      }
    });
  }

  componentDidUpdate(prevProps: Readonly<ToggleProps>): void {
    if (this.checkBoxRef.current) {
      this.checkBoxRef.current.indeterminate = this.props.indeterminate;
    }
  }

  highlightRuleLocation(targetElement: HTMLElement, addHighlight: boolean): void {
    if (!targetElement) {
      return;
    }

    if (addHighlight) {
      setElementOutlineStyle(targetElement, `${colorsByType[this.props.type]} dotted 1px`);
      return;
    }

    if (this.props.highlightedElementsMap.has(targetElement)) {
      setElementOutlineStyle(
        targetElement,
        this.props.highlightedElementsMap.get(targetElement).originalOutline
      );
    }
  }

  saveElementDataToMap(
    targetElement: HTMLElement,
    isHighlighted: boolean,
    originalOutline: string
  ): void {
    const data: HighlightedElementData = new HighlightedElementData();
    data.isHighlighted = isHighlighted;
    data.originalOutline = originalOutline;
    const payload = { element: targetElement, highlightedElementData: data };
    this.props.addElement(payload);
  }

  onToggle = (): void => {
    this.props.elementsToHighlight.forEach(element => {
      const targetElement = getElementBySelectorPath(element.target[0]);
      if (!this.props.highlightedElementsMap.has(targetElement)) {
        return;
      }
      const originalOutline = this.props.highlightedElementsMap.get(targetElement).originalOutline;
      const { isHighlighted } = this.props.highlightedElementsMap.get(targetElement);
      const { isToggledOn } = this.props;
      if ((isToggledOn && isHighlighted) || (!isToggledOn && !isHighlighted)) {
        const addHighlight = !isToggledOn && !isHighlighted;
        this.highlightRuleLocation(targetElement, addHighlight);
        this.saveElementDataToMap(targetElement, addHighlight, originalOutline);
      }
    });
  };

  render() {
    return (
      <Checkbox
        ref={this.checkBoxRef}
        id={this.props.toggleId}
        type="checkbox"
        aria-label="Highlight result"
        disabled={!this.props.elementsToHighlight.length}
        onChange={this.onToggle}
        checked={this.props.isToggledOn}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HighlightToggle);
