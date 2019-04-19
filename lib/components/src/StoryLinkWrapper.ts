/* eslint-disable import/no-extraneous-dependencies */
// This is allows us to test whether the link works via the actions addon
import React, { Children, FunctionComponent, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { action } from '@storybook/addon-actions';

const onLinkClick = action('onLinkClick');

interface StoryLinkWrapperProps {
  href: string;
  passHref?: boolean;
}

const StoryLinkWrapper: FunctionComponent<StoryLinkWrapperProps> = ({
  href,
  passHref,
  children,
}) => {
  const child = Children.only(children) as ReactElement;

  return React.cloneElement(child, {
    href: passHref && href,
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      onLinkClick(href);
    },
  });
};

StoryLinkWrapper.defaultProps = {
  passHref: false,
};

export default StoryLinkWrapper;
