import React from 'react';
import { styled } from '@storybook/theming';

// const FilterField = styled.input(({ theme }) => ({
//   height: 30,
//   boxSizing: 'border-box',
//   width: '100%',
//   background: 'transparent',
//   border: '0 none',
//   color: theme.mainTextColor,
//   padding: theme.layoutMargin,
//   paddingLeft: 0,
//   outline: 0,
// }));
//
// const FilterForm = styled.form(({ theme, focussed }) => ({
//   borderBottom: focussed ? `1px solid transparent` : '1px solid transparent',
//   borderBottomColor: focussed ? theme.colors.highlight : theme.mainBorderColor,
//   outline: 0,
// }));
//
// export class SidebarSearch extends Component {
//   state = {
//     focussed: false,
//   };
//
//   set = e => {
//     this.setState({
//       focussed: e.type === 'focus',
//     });
//   };
//
//   render() {
//     const { focussed } = this.state;
//     return (
//       <FilterForm autoComplete="off" focussed={focussed}>
//         <FilterField
//           autocomplete="off"
//           id="storybook-explorer-searchfield"
//           onFocus={this.set}
//           onBlur={this.set}
//           {...this.props}
//           placeholder={focussed ? 'Type to search...' : 'Press "/" to search...'}
//         />
//       </FilterForm>
//     );
//   }
// }

const Heading = styled.span``;

const SidebarSearch = props => <Heading {...props} />;

export default SidebarSearch;
