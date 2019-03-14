import React, { Component, Fragment, FunctionComponent } from 'react';

import { styled } from '@storybook/theming';
import memoize from 'memoizerific';

import { NodeResult } from 'axe-core';
import { Rules } from './Rules';

const Item = styled.li({
  fontWeight: 600,
});
const ItemTitle = styled.span({
  borderBottom: '1px solid rgb(130, 130, 130)',
  width: '100%',
  display: 'inline-block',
  paddingBottom: '4px',
  marginBottom: '4px',
});

interface ElementProps {
  element: NodeResult;
  passes: boolean;
  type: string;
}

const Element: FunctionComponent<ElementProps> = ({ element, passes, type }) => {
  const { any, all, none } = element;

  const rules = [...any, ...all, ...none];

  return (
    <Item>
      <ItemTitle>{element.target[0]}<HighlightToggle type={type} element={element}></HighlightToggle></ItemTitle>
      <Rules rules={rules} passes={passes} />
    </Item>
  );
};

interface ElementsProps {
  elements: NodeResult[];
  passes: boolean;
  type: string;
}

export const Elements: FunctionComponent<ElementsProps> = ({ elements, passes, type }) => (
  <ol>
    {elements.map((element, index) => (
      <Element passes={passes} element={element} key={index} type={type} />
    ))}
  </ol>
);

interface ToggleProps {
  element: any;
  type: string;
}

interface ToggleState {
  isToggleOn: boolean;
  originalOutline: string | null,
}

export class HighlightToggle extends Component<ToggleProps, ToggleState> {
  state = {
    isToggleOn: true,
    originalOutline: '',
  };

  getIframe = memoize(1)(() => document.getElementsByTagName("iframe")[0]);

  componentDidMount() {
    const targetElement = this.getIframe().contentDocument.querySelector(this.props.element.target[0]);
    this.state.originalOutline = targetElement.style.outline;
    console.log(this.props.type);
  }
 
  higlightRuleLocation: any = (element:any, addHighlight:boolean) => {
    const targetElement = this.getIframe().contentDocument.querySelector(element.target[0]);
    if (addHighlight){
      if(this.props.type==='PASSES'){
        targetElement.style.outline = '2px dotted green';
      }else if(this.props.type==='VIOLATIONS'){
        targetElement.style.outline = '2px dotted red';
      }else if(this.props.type==='INCOMPLETIONS'){
        targetElement.style.outline = '2px dotted orange';
      }
    } else {
      targetElement.style.outline = this.state.originalOutline;
    }
  }

  onToggle = () => {
    this.setState(prevState => {
      this.higlightRuleLocation(this.props.element, this.state.isToggleOn);
      return { isToggleOn: !prevState.isToggleOn };
    });
  }

  render() {
    const { isToggleOn } = this.state;

    return (
      <button onClick={this.onToggle}>
        {this.state.isToggleOn ? 'ON': 'OFF'}
      </button>
    );
  }
}
