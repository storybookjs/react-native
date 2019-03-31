import React from 'react';
import { ToolBarMenu } from '../components/ToolBarMenu';
import { OPT_OUT } from '../libs/constants';
import { TMenuController } from '../@types';

export const MenuController: TMenuController = ({
  nodeId,
  icon,
  title,
  params,
  options,
  setSelect,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [selected, setSelected] = React.useState('');
  const paramNames = params.map(({ name }) => name);
  const list = options.cancelable === false ? paramNames : [OPT_OUT, ...paramNames];
  const activeName =
    // validate the selected name
    (paramNames.concat(OPT_OUT).includes(selected) && selected) ||
    // fallback to default
    (params.find((param) => !!param.default) || { name: null }).name ||
    // fallback to the first
    params[0].name;
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
        setSelected(name);
        setSelect(nodeId, name);
      },
    },
  };

  return options.disable || list.length < 2 ? null : <ToolBarMenu {...props} />;
};
