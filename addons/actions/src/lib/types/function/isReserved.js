export default function isReserved(name) {
  return ['delete'].indexOf(name) >= 0;
}
