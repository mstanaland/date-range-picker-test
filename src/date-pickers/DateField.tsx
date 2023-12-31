import "./DateField.scss";

import * as React from "react";
import cx from "classnames";
import {
  useDateFieldState,
  type DateSegment,
  type DateFieldState,
  type DateRangePickerState,
} from "react-stately";
import {
  useDateField,
  useDateSegment,
  useLocale,
  type AriaDatePickerProps,
  type DateValue,
} from "react-aria";
import { createCalendar } from "@internationalized/date";

interface DateSegmentProps {
  segment: DateSegment;
  state: DateFieldState;
  className?: string;
}

function DateSegment({ segment, state, className }: DateSegmentProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
      }}
      className={cx("date-segment", className, {
        slash: !segment.isEditable,
      })}
    >
      {segment.isPlaceholder ? segment.placeholder : segment.text}
    </div>
  );
}

interface DateFieldProps extends AriaDatePickerProps<DateValue> {
  className?: string;
  rangePickerState: DateRangePickerState;
  setAutoFocus: React.Dispatch<React.SetStateAction<boolean>>;
  close?: () => void;
  isOpen?: boolean;
}

export function DateField({
  className,
  rangePickerState,
  setAutoFocus,
  close,
  isOpen,
  ...rest
}: DateFieldProps) {
  const { isDisabled } = rest;
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...rest,
    locale,
    createCalendar,
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const { fieldProps } = useDateField(rest, state, ref);

  const { onKeyDown, ...otherFieldProps } = fieldProps;

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (close && isOpen && event.key === "Tab") {
        close();
      }
      if (onKeyDown) {
        onKeyDown(event);
      }
    },
    [close, isOpen, onKeyDown]
  );

  return (
    <div
      {...otherFieldProps}
      onKeyDown={handleKeyDown}
      ref={ref}
      className={cx("date-field", className)}
      onClick={() => {
        if (!isDisabled) {
          setAutoFocus(false);
          rangePickerState.open();
        }
      }}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state} />
      ))}
    </div>
  );
}
