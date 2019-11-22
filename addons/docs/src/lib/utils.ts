import { PropSummaryValue } from '@storybook/components';

export const MAX_TYPE_SUMMARY_LENGTH = 70;
export const MAX_DEFALUT_VALUE_SUMMARY_LENGTH = 50;
export const MAX_EXPANDABLE_LENGTH = 25;

export function isTooLongForTypeSummary(value: string): boolean {
  return value.length > MAX_TYPE_SUMMARY_LENGTH;
}

export function isTooLongForDefaultValueSummary(value: string): boolean {
  return value.length > MAX_DEFALUT_VALUE_SUMMARY_LENGTH;
}

export function isTooLongForExpandable(value: string): boolean {
  return value.length > MAX_EXPANDABLE_LENGTH;
}

export function createSummaryValue(summary: string, detail?: string): PropSummaryValue {
  return { summary, detail };
}
