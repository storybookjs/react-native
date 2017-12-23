export default function muteProperty(key, value) {
  return Object.defineProperty(value, key, { enumerable: false });
}
