import "./DateRangePicker.scss";

import * as React from "react";
import cx from "classnames";
import { useDateRangePickerState } from "react-stately";
import {
  type DateValue,
  useDateRangePicker,
  AriaDateRangePickerProps,
} from "react-aria";
import {
  // ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/20/solid";

import type { RangeValue } from "./types";

import { ClearDatesButton } from "./Button";
import { ToggleCalendarButton } from "./ToggleCalendarButton";
import { TabFocusGuard } from "./TabFocusGuard";
import { RangeCalendar } from "./RangeCalendar";
import { DateField } from "./DateField";
import { InlinePopup } from "./InlinePopup";
import { HiddenInputs } from "./HiddenInputs";
import { ErrorMessage } from "./ErrorMessage";

interface DateRangePickerProps<T extends DateValue>
  extends AriaDateRangePickerProps<T> {
  label?: string;
  startName?: string;
  endName?: string;
  pageBehavior?: "single" | "visible";
  minValue?: DateValue;
  maxValue?: DateValue;
  name?: string;
  startInputRef?: React.RefObject<HTMLInputElement>;
  endInputRef?: React.RefObject<HTMLInputElement>;
}

export function DateRangePicker<T extends DateValue>({
  name = "dateRangePicker",
  startInputRef,
  endInputRef,
  ...rest
}: DateRangePickerProps<T>) {
  //
  const { label, errorMessage, isRequired, description } = rest;

  const state = useDateRangePickerState(rest);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const ref = React.useRef<HTMLDivElement>(null);
  // autoFocus does double-duty: When true, the calendar
  const [autoFocus, setAutoFocus] = React.useState(false);

  const {
    buttonProps,
    calendarProps,
    descriptionProps,
    dialogProps,
    endFieldProps,
    errorMessageProps,
    groupProps,
    labelProps,
    startFieldProps,
  } = useDateRangePicker(rest, state, ref);

  const resetFocus = React.useCallback(() => {
    window.setTimeout(() => {
      triggerRef.current?.focus();
    }, 0);
  }, []);

  function onChangeOverride(range: RangeValue<DateValue>) {
    if (calendarProps.onChange) {
      calendarProps.onChange(range);
    }
    resetFocus();
  }

  buttonProps.onPress = () => {
    setAutoFocus(true);
    state.toggle();
  };

  // React.useEffect(() => {
  //   if (!state.isOpen && document.activeElement?.tagName === "BODY") {
  //     resetFocus();
  //   }
  // }, [state.isOpen, resetFocus]);

  // There doesn't seem to be a way of updating the calendar position manually without setting
  // focus, so we're using this key to force re-render the RangeCalendar when the user
  // changes the segments. The value will be null until the user picks a full range, so
  // the initial check for the start and end value is necessary even through the end value
  // is not used. Note this key has nothing to do with determining the calendar's position;
  // the re-render causes the calendar to be re-drawn using the current state
  const rangeCalendarKey =
    state.value?.start && state.value?.end
      ? state?.value?.start.month + state?.value?.start.year
      : undefined;

  // Using 'as' here because this function's type wants the click event as a param,
  // but it isn't actually used
  const focusFirst = labelProps.onClick as () => void;

  // console.log("groupProps", groupProps);

  return (
    <div className="sarsa--date-range-picker">
      <TabFocusGuard isOpen={state.isOpen} close={state.close}>
        <div {...labelProps} className="label">
          {label}
          {isRequired ? "*" : null}
        </div>
        <div
          {...groupProps}
          // onClick={(e) => {
          //   console.log("click");
          //   groupProps.onClick(e);
          // }}
          ref={ref}
          className={cx("inputs-group", { invalid: state.isInvalid })}
        >
          <DateField
            {...startFieldProps}
            rangePickerState={state}
            className="start"
            setAutoFocus={setAutoFocus}
            close={state.close}
            isOpen={state.isOpen}
          />

          <span aria-hidden="true" className="arrow-wrap">
            <ArrowRightIcon />
          </span>

          <DateField
            {...endFieldProps}
            rangePickerState={state}
            className="end"
            setAutoFocus={setAutoFocus}
            close={state.close}
            isOpen={state.isOpen}
          />
          {/* {state.isInvalid && (
            <div className="invalid-indicator">
              <ExclamationTriangleIcon />
            </div>
          )} */}

          {state?.value?.start && state?.value?.end ? (
            <ClearDatesButton
              onPress={() => {
                state.setValue(null);
                if (focusFirst) {
                  focusFirst();
                }
              }}
            />
          ) : null}

          <ToggleCalendarButton {...buttonProps} ref={triggerRef} />
          <HiddenInputs
            name={name}
            value={state.value}
            startInputRef={startInputRef}
            endInputRef={endInputRef}
          />
        </div>

        <InlinePopup
          isOpen={state.isOpen}
          close={state.close}
          resetFocus={resetFocus}
          shouldTrapFocus={autoFocus}
        >
          <div className="popup" {...dialogProps}>
            <RangeCalendar
              {...calendarProps}
              onChange={onChangeOverride}
              autoFocus={autoFocus}
              key={rangeCalendarKey}
              pageBehavior="single"
            />

            <ErrorMessage className="popup-error-message">
              {errorMessage}
            </ErrorMessage>
          </div>
        </InlinePopup>

        <div className="description" {...descriptionProps}>
          {description}
        </div>
        <ErrorMessage {...errorMessageProps} role="alert">
          {errorMessage}
        </ErrorMessage>
      </TabFocusGuard>
    </div>
  );
}
