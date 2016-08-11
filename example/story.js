import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import {Code as myCode} from './myCode';

storiesOf('Syntax highlighter examples')
  .addWithInfo(
    'HTML',
    `
      example text. example text. example text. example text. 
      example text. vLinkcolorexample text. 
      example text. 

      ~~~html
      //js
      var a = 5;
      var b = 'test test test';
      
      //JSX + ES6
      <div>
         <Button label='The Button' onClick={action('onClick')}/>
         <br/> 
      </div>
      () => (
         <LookupCombo rowToString={ (row) => row.name } rows={dataObjects} />
      )
      //HTML
      <h1>React JSX</h1>
      <p>To use this language, use the class "language-jsx".</p>
      <h2>Full example</h2>
      ~~~
      example text. 
      example text. 
      example text. 
      example text. 
    `,
    () => (<div/>),
    { inline: true, propTables: [], source: false},
	{code: myCode}
  );

  storiesOf('Syntax highlighter examples')
  .addWithInfo(
    'JS',
    `
      example text. example text. example text. example text. 
      example text. vLinkcolorexample text. 
      example text. 

      ~~~js
      //js
      var a = 5;
      var b = 'test test test';
      
      //JSX + ES6
      <div>
         <Button label='The Button' onClick={action('onClick')}/>
         <br/> 
      </div>
      () => (
         <LookupCombo rowToString={ (row) => row.name } rows={dataObjects} />
      )
      //HTML
      <h1>React JSX</h1>
      <p>To use this language, use the class "language-jsx".</p>
      <h2>Full example</h2>
      ~~~
      example text. 
      example text. 
      example text. 
      example text. 
    `,
    () => (<div/>),
    { inline: true, propTables: [], source: false},
	{code: myCode}
  );
  
  storiesOf('Syntax highlighter examples')
  .addWithInfo(
    'JSX',
    `
      example text. example text. example text. example text. 
      example text. vLinkcolorexample text. 
      example text. 

      ~~~jsx
      //js
      var a = 5;
      var b = 'test test test';
      
      //JSX + ES6
      <div>
         <Button label='The Button' onClick={action('onClick')}/>
         <br/> 
      </div>
      () => (
         <LookupCombo rowToString={ (row) => row.name } rows={dataObjects} />
      )
      //HTML
      <h1>React JSX</h1>
      <p>To use this language, use the class "language-jsx".</p>
      <h2>Full example</h2>
      ~~~
      example text. 
      example text. 
      example text. 
      example text. 
    `,
    () => (<div/>),
    { inline: true, propTables: [], source: false},
	{code: myCode}
  );
  
  storiesOf('Syntax highlighter examples')
  .addWithInfo(
    'CSS',
    `
      example text. example text. example text. example text. 
      example text. vLinkcolorexample text. 
      example text. 

      ~~~css
      /*CSS*/
      #somediv {
         -webkit-border-radius: 20px;
         -moz-border-radius: 20px;
         border-radius: 20px;
      }
      
      .someClass {
         -webkit-transition: all 0.5s ease-in;
         -moz-transition: all 0.5s ease-in;
         -o-transition: all 0.5s ease-in;
         -ms-transition: all 0.5s ease-in;
         transition: all 0.5s ease-in;
      }
	  
      #somediv:hover {
         opacity: 0;
      }

      /*LESS*/
      .border-radius (@radius: 5px) {
         -webkit-border-radius: @radius;
         -moz-border-radius: @radius;
         border-radius: @radius;
      }
      #somediv {
         .border-radius(20px);
      }
      ~~~
      example text. 
      example text. 
      example text. 
      example text.
    `,
    () => (<div/>),
    { inline: true, propTables: [], source: false},
	{code: myCode}
  );
  
storiesOf('Syntax highlighter examples')
  .addWithInfo(
    'LESS',
    `
      example text. example text. example text. example text. 
      example text. vLinkcolorexample text. 
      example text. 

      ~~~less
      /*CSS*/
      #somediv {
         -webkit-border-radius: 20px;
         -moz-border-radius: 20px;
         border-radius: 20px;
      }
      
      .someClass {
         -webkit-transition: all 0.5s ease-in;
         -moz-transition: all 0.5s ease-in;
         -o-transition: all 0.5s ease-in;
         -ms-transition: all 0.5s ease-in;
         transition: all 0.5s ease-in;
      }
	  
      #somediv:hover {
         opacity: 0;
      }

      /*LESS*/
      .border-radius (@radius: 5px) {
         -webkit-border-radius: @radius;
         -moz-border-radius: @radius;
         border-radius: @radius;
      }
      #somediv {
         .border-radius(20px);
      }
      ~~~
      example text. 
      example text. 
      example text. 
      example text.
    `,
    () => (<div/>),
    { inline: true, propTables: [], source: false},
	{code: myCode}
  );