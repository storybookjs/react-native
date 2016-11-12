import pick from 'lodash.pick';
import Layout from '../components/layout';
import genReduxLoader from '../libs/gen_redux_loader';
import compose from '../../../compose';

export const mapper = ({ shortcuts }) => {
  return pick(
    shortcuts,
    'showLeftPanel',
    'showDownPanel',
    'goFullScreen',
    'downPanelInRight'
  );
};

export default compose(genReduxLoader(mapper))(Layout);
