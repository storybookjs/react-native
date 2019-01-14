import React from 'react';
import { shallow } from 'enzyme';
import {
  A,
  Aside,
  Balloon,
  Button,
  ColWrapper,
  Container,
  Footer,
  FullChangeLogLink,
  GridHeaderRow,
  GridWrapper,
  Header,
  HeaderItem,
  Heading,
  Main,
  Pre,
  Row,
  SuccessIcon,
  TextInput,
  Title,
  TitleIcon,
  TitleText,
  Upgrade,
  Wrapper,
} from './components';

const renderTest = (Component, props) => {
  describe(`${Component}`, () => {
    it('renders correctly', () => {
      const comp = shallow(<Component {...props} />);
      expect(comp).toExist();
    });
  });
};
describe('components', () => {
  renderTest(Container);
  renderTest(Title);
  renderTest(TitleText);
  renderTest(Wrapper);
  renderTest(Aside);
  renderTest(Main);
  renderTest(TitleIcon);
  renderTest(FullChangeLogLink, { href: 'www.google.com' });
  renderTest(Heading);
  renderTest(Header);
  renderTest(A);
  renderTest(Footer);
  renderTest(Upgrade);
  renderTest(Pre);
  renderTest(ColWrapper);
  renderTest(GridWrapper);
  renderTest(GridHeaderRow);
  renderTest(Row);
  renderTest(HeaderItem);
  renderTest(Button);

  describe('TextInput', () => {
    it('renders correctly', () => {
      const comp = shallow(<TextInput colorTheme="error" />);
      expect(comp).toExist();
    });
  });

  describe('Balloon', () => {
    it('renders correctly', () => {
      const comp = shallow(<Balloon />);
      expect(comp).toExist();
    });
  });
  describe('SuccessIcon', () => {
    it('renders correctly', () => {
      const comp = shallow(<SuccessIcon colorTheme="success" />);
      expect(comp).toExist();
    });
  });
});
