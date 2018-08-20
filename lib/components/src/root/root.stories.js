// import React from 'react';
// import styled from 'react-emotion';
// import { storiesOf } from '@storybook/react';

// import { Root } from './root';
// import { Clock } from './clock';

// const FullColor = styled('div')(({ color, full }) => ({
//   background: color,
//   position: full ? 'fixed' : 'absolute',
//   zIndex: full ? 2 : 1,
//   left: 0,
//   top: 0,
//   bottom: 0,
//   right: 0,
//   width: '100%',
//   height: '100%',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
// }));

// const Pane1 = () => (
//   <FullColor color="deepskyblue">
//     PANE 1_
//     <Clock />
//   </FullColor>
// );
// const Pane2 = ({ full }) => (
//   <FullColor color="deeppink" full={full}>
//     PANE 2_
//     <Clock />
//   </FullColor>
// );
// const Pane3 = () => (
//   <FullColor color="orangered">
//     PANE 3_
//     <Clock />
//   </FullColor>
// );
// storiesOf('Components|Root', module)
//   .add('default options', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//       }}
//     />
//   ))
//   .add('full', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: true,
//           nav: true,
//           active: 1,
//           panel: 'bottom',
//         },
//       }}
//     />
//   ))
//   .add('nav', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: false,
//           active: 1,
//           panel: 'bottom',
//         },
//       }}
//     />
//   ))
//   .add('panel', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: true,
//           active: 1,
//           panel: 'right',
//         },
//       }}
//     />
//   ))
//   .add('panel gone', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: true,
//           active: 1,
//           panel: false,
//         },
//       }}
//     />
//   ))
//   .add('active 0 (mobile)', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: true,
//           active: 0,
//           panel: 'bottom',
//         },
//       }}
//     />
//   ))
//   .add('active 1 (mobile)', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: true,
//           active: 1,
//           panel: 'bottom',
//         },
//       }}
//     />
//   ))
//   .add('active 2 (mobile)', () => (
//     <Root
//       {...{
//         Nav: Pane1,
//         Preview: Pane2,
//         Panel: Pane3,
//         options: {
//           full: false,
//           nav: true,
//           active: 2,
//           panel: 'bottom',
//         },
//       }}
//     />
//   ));
