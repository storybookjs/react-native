import * as React from "react"; // tslint:disable-line
import { storiesOf } from "@kadira/storybook";
import centered from "@kadira/react-storybook-decorator-centered";

import backgrounds from "./index.tsx";

storiesOf("First Component", module)
  .addDecorator(centered)
  .add("First Button", () => <button>Click me</button>)
  ;


storiesOf("Second Component", module)
  .addDecorator(centered)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("Second Button", () => <button>Click me</button>)
  ;
