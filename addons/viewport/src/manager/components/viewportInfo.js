export const configuredStyles = {
  border: '1px solid #728099',
  display: 'flex',
  margin: '0 auto',
  boxShadow: 'rgba(0,0,0,0.2) 0px 0px 60px 12px',
};

export const resetViewport = {
  name: 'Reset',
  styles: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    margin: '0',
    boxShadow: 'none',
  },
};

export function applyStyles(viewport, styles) {
  const mixedStyles = {
    ...viewport.styles,
    ...styles,
  };

  return {
    ...viewport,
    styles: mixedStyles,
  };
}

export function applyDefaultStyles(viewport) {
  return applyStyles(viewport, configuredStyles);
}

export const transformViewports = transformer => viewports =>
  Object.keys(viewports).reduce(
    (all, key) => ({
      ...all,
      [key]: transformer(viewports[key]),
    }),
    {}
  );

export const viewportsTransformer = transformViewports(applyDefaultStyles);
