import React from 'react';
//https://github.com/tomchentw/react-prism
import {PrismCode} from "react-prism";
//prism library should be included in index.html file (but in this example index.html doesn't exist)
import Prism from './prism/prism';
//library for jsx syntax: https://github.com/PrismJS/prism/blob/gh-pages/components/prism-jsx.js
import PrismJSX from './prism/prism-jsx';
//library for less syntax: https://github.com/PrismJS/prism/blob/gh-pages/components/prism-less.js
import PrismLESS from './prism/prism-less';
//prism style
import './prism/prism.css';


export class Code extends React.Component {
  render() {
	var lang = `language-${this.props.language}`;
    return (
      <pre>
		<PrismCode className={lang}>
			{this.props.code}
		</PrismCode>
	  </pre>
    );
  }
}