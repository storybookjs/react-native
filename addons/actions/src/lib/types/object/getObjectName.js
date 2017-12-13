import canAccessProperty from './canAccessProperty';

export default function getObjectName(value) {
  if (canAccessProperty('toString', value)) {
    const stringValue = value.toString();

    if (stringValue.slice(0, 5) === 'class') {
      return stringValue.slice(6, -3);
    }

    const type = stringValue.slice(8, -1);

    if (stringValue.slice(1, 7) === 'object' && type !== 'Object') {
      return type;
    }

    const parts = stringValue.match(/function (\w+).*/);

    if (parts && parts.length === 2) {
      return parts[1];
    }
  }

  return value.constructor ? value.constructor.name : 'Object';
}
