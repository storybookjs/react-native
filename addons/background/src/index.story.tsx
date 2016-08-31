import * as React from "react"; // tslint:disable-line
import { storiesOf } from "@kadira/storybook";

import backgrounds from "./index.tsx";

storiesOf("First Component", module)
  .addDecorator(backgrounds([
    { name: "twitter", value: "#00aced" },
    { name: "facebook", value: "#3b5998" },
  ]))
  .add("First Button", () => <button>Click me</button>)
  ;


storiesOf("Second Component", module)
  // .addDecorator(backgrounds([
  //   { name: "light-primary", value: "#f1f1f1" },
  //   { name: "light-secondary", value: "#ddd" },
  // ]))
  .add("Second Button", () => <button>Click me</button>)
  ;
