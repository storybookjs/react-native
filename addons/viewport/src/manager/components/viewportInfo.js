export const configuredStyles = {
  display: 'flex',
  boxShadow: 'rgba(0,0,0,0.2) 0px 0px 60px 12px',
  border: '20px solid black',
  borderRadius: '10px',
  margin: '10px',
};

export const resetViewport = {
  name: 'Reset',
  styles: {
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    boxShadow: 'none',
    borderRadius: '0px',
    margin: '0px',
  },
};

export function applyStyles(viewport, styles) {
  const mixedStyles = {
    ...styles,
    ...viewport.styles,
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
