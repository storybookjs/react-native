import { parse } from './acornParser';
import { InspectionResult, InspectionType } from './types';

export function inspectValue(value: string): InspectionResult {
  try {
    const parsingResult = parse(value);

    return { ...parsingResult };
  } catch (e) {
    // do nothing.
  }

  return { inferedType: { type: InspectionType.UNKNOWN } };
}
