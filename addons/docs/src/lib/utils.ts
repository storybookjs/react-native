import { PropSummaryValue } from '@storybook/components';

export const MAX_TYPE_SUMMARY_LENGTH = 90;
export const MAX_DEFALUT_VALUE_SUMMARY_LENGTH = 50;

export function isTooLongForTypeSummary(value: string): boolean {
  return value.length > MAX_TYPE_SUMMARY_LENGTH;
}

export function isTooLongForDefaultValueSummary(value: string): boolean {
  return value.length > MAX_DEFALUT_VALUE_SUMMARY_LENGTH;
}

export function createSummaryValue(summary: string, detail?: string): PropSummaryValue {
  return { summary, detail };
}
