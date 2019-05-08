/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { Consumer, Combo, API } from '@storybook/api';
import { ADDON_ID, EVENTS } from './constants';

const mapper = ({ api }: Combo): SubState => {
  return {
    state: api.getAddonState(ADDON_ID) || [],
    setState: (...args) => api.setAddonState(ADDON_ID, ...args),
    api,
  };
};

interface SubState {
  state: string[];
  setState: (args: any[]) => void;
  api: API;
}

interface Props {
  active: boolean;
}


class Inner extends Component<SubState & Props> {
  listener: () => void;

  constructor(props: SubState & Props) {
    super(props);

    this.listener = () => {};

    setInterval(() => props.setState((s = []) => [...s, Math.random()]), 1000);
  }

  componentDidMount() {
    const { api } = this.props;
    api.on(EVENTS.RESULT, this.listener);
  }

  shouldComponentUpdate() {
    const { active } = this.props;
    console.log({ active });
    return !!active;
  }

  componentWillUnmount() {
    const { api } = this.props;
    api.off(EVENTS.RESULT, this.listener);
  }

  render() {
    const { state } = this.props;
    return (
      <ol>
        {state.map(i => (
          <li key={i.toString()}>{i}</li>
        ))}
      </ol>
    );
  }
  
export const Panel = ({ active }: Props) => (
  <Consumer filter={mapper}>{(props: SubState) => <Inner active={active} {...props} />}</Consumer>
);