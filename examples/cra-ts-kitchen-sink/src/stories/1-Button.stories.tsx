import React from "react";
import { action } from "@storybook/addon-actions";
import { config, withDesign } from "storybook-addon-designs";
import { Button } from "./Button";

export default {
  title: "Button",
  component: Button,
  decorators: [withDesign]
};

export const text = () => (
  <Button onClick={action("clicked")}>Hello Button</Button>
);
text.story = {
  parameters: {
    design: config({
      type: "iframe",
      url: "https://www.google.com/"
    })
  }
};

export const emoji = () => (
  <Button onClick={action("clicked")}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
emoji.story = {
  parameters: {
    design: config({
      type: "iframe",
      url: "https://www.wikipedia.org/"
    })
  }
};
