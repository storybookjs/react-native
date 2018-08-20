// import React, { Component, Children } from 'react';
// import styled from 'react-emotion';

// import { Container } from './container';

// const Pane = styled('div')(
//   {
//     transition: 'transform .2s ease',
//     position: 'absolute',
//     top: 0,
//     height: '100%',
//   },
//   ({ index }) => {
//     switch (index) {
//       case 0: {
//         return {
//           width: '80vw',
//           transform: 'translateX(-80vw)',
//           left: 0,
//         };
//       }
//       case 1: {
//         return {
//           width: '100%',
//           transform: 'translateX(0) scale(1)',
//           left: 0,
//         };
//       }
//       case 2: {
//         return {
//           width: '80vw',
//           transform: 'translateX(80vw)',
//           right: 0,
//         };
//       }
//       default: {
//         return {};
//       }
//     }
//   },
//   ({ active, index }) => {
//     switch (true) {
//       case index === 0 && active === 0: {
//         return {
//           transform: 'translateX(-0px)',
//         };
//       }
//       case index === 1 && active === 0: {
//         return {
//           transform: 'translateX(40vw) translateY(-43.5vh) translateY(50px) scale(0.2)',
//         };
//       }
//       case index === 1 && active === 2: {
//         return {
//           transform: 'translateX(-40vw) translateY(-43.5vh) translateY(50px) scale(0.2)',
//         };
//       }
//       case index === 2 && active === 2: {
//         return {
//           transform: 'translateX(0px)',
//         };
//       }
//       default: {
//         return {};
//       }
//     }
//   }
// );

// const Panels = ({ children, active }) => (
//   <Panels.Container>
//     {Children.toArray(children).map((item, index) => (
//       <Pane key={index} index={index} active={active}>
//         {item}
//       </Pane>
//     ))}
//   </Panels.Container>
// );

// Panels.Container = styled('div')({
//   position: 'fixed',
//   top: 0,
//   left: 0,
//   width: '100vw',
//   height: 'calc(100% - 50px)',
// });

// const Bar = styled('nav')({
//   position: 'fixed',
//   bottom: 0,
//   left: 0,
//   width: '100vw',
//   height: 50,
//   background: 'silver',
//   display: 'flex',

//   '& > *': {
//     flex: 1,
//   },
// });

// const Mobile = ({ Nav, Preview, Panel, options: { active } }) => (
//   <Container>
//     <Panels active={active}>
//       <Nav />
//       <Preview />
//       <Panel />
//     </Panels>
//     <Bar active={active}>
//       <button onClick={() => console.log('TODO', 'set active=0')}>pane 1</button>
//       <button onClick={() => console.log('TODO', 'set active=1')}>pane 2</button>
//       <button onClick={() => console.log('TODO', 'set active=2')}>pane 3</button>
//     </Bar>
//   </Container>
// );

// export { Mobile };
