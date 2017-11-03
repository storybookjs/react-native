import colorPairsPicker from 'color-pairs-picker';
import chroma from 'chroma-js';

import { siteMetadata } from '../../gatsby-config';

export const colors = colorPairsPicker(siteMetadata.baseColor, {
  contrast: 5.5,
});

const darker = chroma(siteMetadata.baseColor)
  .darken(10)
  .hex();
export const activeColors = colorPairsPicker(darker, {
  contrast: 7,
});
