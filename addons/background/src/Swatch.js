
import * as React from "react";
const assign = require("object-assign");

const style = {
  swatches: {
    textAlign: "center",
    padding: "0",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "4px",
    cursor: "pointer",
    display: "inline-block",
    width: "175px",
    verticalAlign: "top",
    wordWrap: "break-word",
  },
  swatch: {
    height: "80px",
    borderRadius: "4px 4px 0 0",
    transition: "opacity 0.25s ease-in-out",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
  },
  listStyle: { listStyle: "none" },
  pushBottom: { marginBottom: "10px" },
  pushLeft: { marginLeft: "10px" },
  soft: { paddingLeft: "10px", paddingRight: "10px" },
  hard: { padding: "0" },
  flush: { margin: "0" },
  font: {
    fontFamily: "-apple-system, '.SFNSText-Regular', 'San Francisco', Roboto, 'Segoe UI', 'Helvetica Neue', 'Lucida Grande', sans-serif",
    fontSize: "14px",
    wordBreak: "break-word",
  },
};

export default ({ name, value, setBackground }) => (
  <div
    style={assign({}, style.swatches, style.listStyle, style.hard)}
    onClick={() => setBackground(value)}
  >
    <div
      style={assign({}, style.swatch, {
        background: value,
        "backgroundSize": "cover",
        "backgroundPosition": "center",
      })}
    >
    </div>
    <div style={assign({}, style.listStyle, style.soft)}>
      <h4 style={assign({ float: "left", fontWeight: "bold" }, style.font)}>
        {name}:
      </h4>
      <h4 style={assign({ float: "right", fontWeight: "normal" }, style.font)}>
        <em>{value}</em>
      </h4>
    </div>
  </div>
);
