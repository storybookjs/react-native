export function envVariableToBoolean(
  value: string | undefined,
  defaultValue: any = false
): boolean {
  switch (value) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return !!defaultValue;
  }
}

export function envVariableToString(
  value: string | undefined,
  defaultValue: string | undefined
): string | undefined {
  return value ?? defaultValue;
}

export function envVariableToNumber(value: string | undefined, defaultValue: number): number {
  const parsed = parseInt(value ?? '', 10);
  if (!isNaN(parsed)) {
    return parsed;
  }
  return defaultValue;
}
