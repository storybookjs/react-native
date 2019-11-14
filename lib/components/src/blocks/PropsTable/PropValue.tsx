import React, { FC } from 'react';
import { isNil } from 'lodash';
import { PropSummaryValue } from './PropDef';

interface PropValueProps {
  value?: PropSummaryValue;
}

interface PropSummaryProps {
  value: PropSummaryValue;
}

const EmptyProp = () => {
  return <span>-</span>;
};

const PropSummary: FC<PropSummaryProps> = ({ value }) => {
  const { summary, detail } = value;

  const title = !isNil(detail) ? detail : null;
  const style = {};

  if (!isNil(title)) {
    // @ts-ignore
    style.borderBottom = '1px solid blue';
  }

  return (
    <span title={title} style={style}>
      {summary}
    </span>
  );
};

export const PropValue: FC<PropValueProps> = ({ value }) => {
  return isNil(value) ? <EmptyProp /> : <PropSummary value={value} />;
};
