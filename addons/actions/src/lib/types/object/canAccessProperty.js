export default function canAccessProperty(key, value) {
  let prop;

  try {
    prop = value[key];
  } catch (error) {
    console.error(error); // eslint-disable-line no-console
  }

  return !!prop;
}
