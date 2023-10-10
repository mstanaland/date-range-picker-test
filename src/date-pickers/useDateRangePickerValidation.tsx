import * as React from "react";

import { type DateValue, parseDate } from "@internationalized/date";

import type { ValueType, RangeValue } from "./types";

interface useDateRangePickerValidationProps {
  label: string;
  onChange?: (value: ValueType) => void;
  isRequired?: boolean;
  validator?: (value: RangeValue<DateValue>) => {
    isInvalid: boolean;
    errorMessage?: string;
  };
}

type ValidationState = {
  isInvalid: boolean;
  errorMessage: string | undefined;
};

export function useDateRangePickerValidation({
  label,
  onChange: onChangeParam,
  isRequired,
  validator,
}: useDateRangePickerValidationProps) {
  const [validation, setValidation] = React.useState<ValidationState>({
    isInvalid: false,
    errorMessage: undefined,
  });
  const startInputRef = React.useRef<HTMLInputElement>(null);
  const endInputRef = React.useRef<HTMLInputElement>(null);

  const validateValue = React.useCallback(
    (value: ValueType) => {
      const newValidation: ValidationState = {
        isInvalid: false,
        errorMessage: undefined,
      };

      // If there's not a complete range
      if (!value || !value.start || !value.end) {
        if (isRequired) {
          newValidation.isInvalid = true;
          newValidation.errorMessage = `${label} is required`;

          setValidation(newValidation);
          return newValidation;
        }

        setValidation(newValidation);
        return newValidation;
      }

      const { start, end } = value;

      if (start.compare(end) > 0) {
        newValidation.isInvalid = true;
        newValidation.errorMessage = "End date is before start date";

        setValidation(newValidation);
        return newValidation;
      }

      if (validator) {
        const result = validator({ start, end });
        newValidation.isInvalid = result.isInvalid;
        newValidation.errorMessage = result.errorMessage;

        setValidation(newValidation);
        return newValidation;
      }

      // default case
      setValidation(newValidation);
      return newValidation;
    },
    [isRequired, label, validator]
  );

  function onChange(value: ValueType) {
    console.log("onChange in validator", value);
    validateValue(value);

    if (onChangeParam) {
      onChangeParam(value);
    }
  }

  const validate = React.useCallback(() => {
    if (startInputRef.current && endInputRef.current) {
      const startValue = startInputRef.current.value;
      const endValue = endInputRef.current.value;
      const start = startValue ? parseDate(startValue) : null;
      const end = endValue ? parseDate(endValue) : null;

      const value = start && end ? { start, end } : null;

      const validation = validateValue(value);

      console.log({ startValue, endValue, start, end, ...validation });
    }
  }, [validateValue]);

  const dateRangePickerProps = {
    label,
    onChange,
    isInvalid: validation.isInvalid,
    errorMessage: validation.errorMessage,
    startInputRef,
    endInputRef,
  };

  return {
    validate,
    isInvalid: validation.isInvalid,
    errorMessage: validation.errorMessage,
    dateRangePickerProps,
  };
}
