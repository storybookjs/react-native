import React from 'react';
import { ToolBarMenu } from './ToolBarMenu';
import { OPT_OUT } from '../../shared/constants';
import { ContextNode, FCNoChildren, Omit } from '../../shared/types.d';

type ToolbarControl = FCNoChildren<
  Omit<
    ContextNode & {
      selected: string;
      setSelected: (nodeId: string, name: string) => void;
    },
    'components'
  >
>;

export const ToolbarControl: ToolbarControl = ({
  nodeId,
  icon,
  title,
  params,
  options,
  selected,
  setSelected,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const paramNames = params.map(({ name }) => name);
  const activeName =
    // validate the integrity of the selected name
    (paramNames.concat(options.cancelable && OPT_OUT).includes(selected) && selected) ||
    // fallback to default
    (params.find(param => !!param.default) || { name: null }).name ||
    // fallback to the first
    params[0].name;
  const list = options.cancelable === false ? paramNames : [OPT_OUT, ...paramNames];
  const props = {
    icon,
    title,
    active: activeName !== OPT_OUT,
    expanded,
    setExpanded,
    optionsProps: {
      activeName,
      list,
      onSelectOption: (name: string) => () => {
        setExpanded(false);
        setSelected(nodeId, name);
      },
    },
  };

  return options.disable || list.length < 2 ? null : <ToolBarMenu {...props} />;
};
