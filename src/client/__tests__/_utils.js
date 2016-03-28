export function setWindow(search) {
  global.window = {
    location: { search },
    addEventListener: () => {},
  };
}
