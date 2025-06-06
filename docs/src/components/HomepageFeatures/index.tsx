import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Built for React Native',
    // Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: <>Built with React Native for React Native.</>,
  },
  {
    title: 'Build design systems easily',
    // Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Storybook lets you focus on your components in isolation without the need to recreate
        complex application states
      </>
    ),
  },
  {
    title: 'Works with all your favorite tools',
    // Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: <>Storybook works with all your favorite frameworks, tools, and libraries.</>,
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">{Svg && <Svg className={styles.featureSvg} role="img" />}</div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
