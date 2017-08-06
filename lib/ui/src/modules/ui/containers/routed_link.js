import RoutedLink from '../components/routed_link';
import genPoddaLoader from '../libs/gen_podda_loader';
import { getUrlState } from '../configs/handle_routing';
import compose from '../../../compose';

export function mapper(state, props) {
  const { url } = getUrlState({ ...state, ...props.overrideParams });

  return {
    href: url,
  };
}

export default compose(genPoddaLoader(mapper))(RoutedLink);
