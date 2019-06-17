import React from 'react';
import { shallow } from 'enzyme';
import { ToolBarControl } from './ToolBarControl';
import { OPT_OUT } from '../../shared/constants';

describe('Tests on addon-contexts component: ToolBarControl', () => {
  // given
  const someBasicProps = {
    icon: 'box' as const,
    nodeId: 'Some Context',
    options: { cancelable: true, deep: false, disable: false },
    params: [{ name: 'A', props: {} }, { name: 'B', props: {} }],
    title: 'Some Context',
    selected: '',
    setSelected: jest.fn,
  };

  it('should control menu: set as inactive if being out-out (if cancelable)', () => {
    // when
    const result = shallow(<ToolBarControl {...someBasicProps} selected={OPT_OUT} />);

    // then
    expect(result.props().active).toBe(false);
  });

  it('should control menu: valid "selected" to give "activeName"', () => {
    // given
    const selected = 'C';
    const anotherSelected = 'B';

    // when
    const result = shallow(<ToolBarControl {...someBasicProps} selected={selected} />);
    const anotherResult = shallow(
      <ToolBarControl {...someBasicProps} selected={anotherSelected} />
    );

    // then
    expect(result.props().optionsProps.activeName).not.toBe(selected);
    expect(anotherResult.props().optionsProps.activeName).toBe(anotherSelected);
  });

  it('should control menu: fallback "activeName" to the default param', () => {
    // given
    const name = 'C';
    const params = [...someBasicProps.params, { name, props: {}, default: true }];

    // when
    const result = shallow(<ToolBarControl {...someBasicProps} params={params} />);

    // then
    expect(result.props().optionsProps.activeName).toBe(name);
  });

  it('should control menu: fallback "activeName" to the first (if default not found)', () => {
    // when
    const result = shallow(<ToolBarControl {...someBasicProps} />);

    // then
    expect(result.props().optionsProps.activeName).toBe(someBasicProps.params[0].name);
  });

  it('should render nothing if being disabled', () => {
    // given
    const options = { ...someBasicProps.options, disable: true };

    // when
    const result = shallow(<ToolBarControl {...someBasicProps} options={options} />);

    // then
    expect(result).toMatchInlineSnapshot(`""`);
  });

  it('should document the shallowly rendered result', () => {
    // when
    const result = shallow(<ToolBarControl {...someBasicProps} />);

    // then
    expect(result).toMatchInlineSnapshot(`
      <ToolBarMenu
        active={true}
        expanded={false}
        icon="box"
        optionsProps={
          Object {
            "activeName": "A",
            "list": Array [
              "__OPT_OUT__",
              "A",
              "B",
            ],
            "onSelectOption": [Function],
          }
        }
        setExpanded={[Function]}
        title="Some Context"
      />
    `);
  });
});
