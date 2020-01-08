import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Props,
  Stories,
} from '@storybook/addon-docs/blocks';
import { DocgenButton } from '../../components/DocgenButton';
import BaseButton from '../../components/BaseButton';
import { ButtonGroup } from '../../components/ButtonGroup';

export default {
  title: 'Addons/Docs/stories docs blocks',
  component: DocgenButton,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Props />
          <Stories />
        </>
      ),
    },
  },
};

export const defDocsPage = () => <div>Default docs page</div>;

export const smallDocsPage = () => <div>Just primary story, </div>;
smallDocsPage.story = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Primary />
        </>
      ),
    },
  },
};

export const checkBoxProps = () => <div>Primary props displayed with a check box </div>;
checkBoxProps.story = {
  parameters: {
    docs: {
      page: () => {
        const [showProps, setShowProps] = React.useState(false);
        return (
          <>
            <Title />
            <Subtitle />
            <Description />
            <Primary />
            <label>
              <input
                type="checkbox"
                checked={showProps}
                onChange={() => setShowProps(!showProps)}
              />
              <span>display props</span>
            </label>
            {showProps && <Props />}
          </>
        );
      },
    },
  },
};

export const customLabels = () => <div>Display custom title, Subtitle, Description</div>;
customLabels.story = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Custom title</Title>
          <Subtitle>Custom sub title</Subtitle>
          <Description>Custom description</Description>
          <Primary />
          <Props />
          <Stories title="Custom stories title" />
        </>
      ),
    },
  },
};

export const customStoriesFilter = () => <div>Displays ALL stories (not excluding first one)</div>;
customStoriesFilter.story = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Stories slot={stories => stories} />
        </>
      ),
    },
  },
};

export const descriptionSlot = () => <div>Adds markdown to the description</div>;
descriptionSlot.story = {
  parameters: {
    docs: {
      page: () => (
        <>
          <Description slot={description => `<b>${description}</b>`} />
        </>
      ),
    },
  },
};

export const multipleComponents = () => (
  <ButtonGroup>
    <DocgenButton label="one" />
    <DocgenButton label="two" />
    <DocgenButton label="three" />
  </ButtonGroup>
);

multipleComponents.story = {
  name: 'Many Components',
  parameters: {
    component: ButtonGroup,
    subcomponents: {
      'Docgen Button': DocgenButton,
      'Base Button': BaseButton,
    },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary slot={stories => stories.find(story => story.story === 'Many Components')} />
          <Props />
        </>
      ),
    },
  },
};

export const componentsProps = () => <div>Display multiple prop tables in tabs</div>;
componentsProps.story = {
  subcomponents: {
    'Docgen Button': DocgenButton,
    'Base Button': BaseButton,
  },
  parameters: {
    docs: {
      page: () => (
        <>
          <Title>Multiple prop tables</Title>
          <Description>
            Here's what happens when your component has some related components
          </Description>
          <Props
            components={{
              'ButtonGroup Custom': ButtonGroup,
              'Docgen Button': DocgenButton,
              'Base Button': BaseButton,
            }}
          />
        </>
      ),
    },
  },
};
