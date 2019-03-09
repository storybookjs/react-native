import { site } from '../basics';

const { url } = site;

export const navLinks = [
  { title: 'Docs', href: url.docs.home, isGatsby: false },
  { title: 'Addons', href: url.addons, isGatsby: false },
  { title: 'Community', href: url.community, isGatsby: false },
  { title: 'Use cases', href: url.useCases, isGatsby: false },
  { title: 'Support', href: url.support, isGatsby: false },
  { title: 'Team', href: url.team, isGatsby: false },
];
