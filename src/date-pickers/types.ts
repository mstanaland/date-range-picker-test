import { type DateValue } from "@internationalized/date";

export interface RangeValue<T> {
  /** The start value of the range. */
  start: T;
  /** The end value of the range. */
  end: T;
}

export type ValueType = RangeValue<DateValue> | null;
