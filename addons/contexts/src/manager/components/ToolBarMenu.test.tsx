import React from 'react';
import { shallow } from 'enzyme';
import { ToolBarMenu } from './ToolBarMenu';

describe('Tests on addon-contexts component: ToolBarMenu', () => {
  it('should glue `@storybook/ui` components to produce a context menu', () => {
    // given
    const someProps = {
      icon: 'globe' as const,
      title: 'Some Context',
      active: true,
      expanded: false,
      setExpanded: jest.fn,
      optionsProps: {
        activeName: 'A',
        list: ['A', 'B'],
        onSelectOption: jest.fn,
      },
    };

    // when
    const result = shallow(<ToolBarMenu {...someProps} />);

    // then
    expect(result).toMatchInlineSnapshot(`
      <WithTooltipPure
        closeOnClick={true}
        hasChrome={true}
        modifiers={Object {}}
        onVisibilityChange={[Function]}
        placement="top"
        svg={false}
        tooltip={
          <ToolBarMenuOptions
            activeName="A"
            list={
              Array [
                "A",
                "B",
              ]
            }
            onSelectOption={[Function]}
          />
        }
        tooltipShown={false}
        trigger="click"
      >
        <IconButton
          active={true}
          title="Some Context"
        >
          <Icons
            icon="globe"
          />
        </IconButton>
      </WithTooltipPure>
    `);
  });

  it('should render TabButton with title if the icon is given', () => {
    // given
    const someProps = {
      title: 'Some Context',
      active: true,
      expanded: false,
      setExpanded: jest.fn,
      optionsProps: {
        activeName: 'A',
        list: ['A', 'B'],
        onSelectOption: jest.fn,
      },
    };

    // when
    const result = shallow(<ToolBarMenu {...someProps} />);

    // then
    expect(result).toMatchInlineSnapshot(`
      <WithTooltipPure
        closeOnClick={true}
        hasChrome={true}
        modifiers={Object {}}
        onVisibilityChange={[Function]}
        placement="top"
        svg={false}
        tooltip={
          <ToolBarMenuOptions
            activeName="A"
            list={
              Array [
                "A",
                "B",
              ]
            }
            onSelectOption={[Function]}
          />
        }
        tooltipShown={false}
        trigger="click"
      >
        <TabButton
          active={true}
        >
          Some Context
        </TabButton>
      </WithTooltipPure>
    `);
  });
});
