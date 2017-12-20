import reservedKeywords from './reservedKeywords';

export default function isReserved(name) {
  return reservedKeywords.indexOf(name) >= 0;
}
