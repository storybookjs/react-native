import React from 'react';
import { shallow } from 'enzyme';
import { ToolBar } from './ToolBar';

describe('Tests on addon-contexts component: ToolBar', () => {
  it('should render nothing if receive an empty contextNodes', () => {
    // when
    const result = shallow(<ToolBar nodes={[]} state={{}} setSelected={jest.fn} />);

    // then
    expect(result).toMatchInlineSnapshot(`""`);
  });

  it('should spawn ToolBarControl based on the given contextNodes', () => {
    // given
    const someContextNodes = [
      {
        components: ['span'],
        icon: 'box' as const,
        nodeId: 'Some Context A',
        options: { cancelable: false, deep: false, disable: false },
        params: [{ name: '', props: {} }],
        title: 'Some Context A',
      },
      {
        components: ['div'],
        icon: 'box' as const,
        nodeId: 'Some Context B',
        options: { cancelable: true, deep: false, disable: false },
        params: [{ name: 'Some Param X', props: {} }, { name: 'Some Param Y', props: {} }],
        title: 'Some Context B',
      },
    ];
    const someSelectionState = {
      'Some Context B': 'Some Param Y',
    };

    // when
    const result = shallow(
      <ToolBar nodes={someContextNodes} state={someSelectionState} setSelected={jest.fn} />
    );

    // then
    expect(result).toMatchInlineSnapshot(`
      <Fragment>
        <Separator />
        <ToolBarControl
          icon="box"
          key="Some Context A"
          nodeId="Some Context A"
          options={
            Object {
              "cancelable": false,
              "deep": false,
              "disable": false,
            }
          }
          params={
            Array [
              Object {
                "name": "",
                "props": Object {},
              },
            ]
          }
          selected=""
          setSelected={[Function]}
          title="Some Context A"
        />
        <ToolBarControl
          icon="box"
          key="Some Context B"
          nodeId="Some Context B"
          options={
            Object {
              "cancelable": true,
              "deep": false,
              "disable": false,
            }
          }
          params={
            Array [
              Object {
                "name": "Some Param X",
                "props": Object {},
              },
              Object {
                "name": "Some Param Y",
                "props": Object {},
              },
            ]
          }
          selected="Some Param Y"
          setSelected={[Function]}
          title="Some Context B"
        />
      </Fragment>
    `);
  });
});
