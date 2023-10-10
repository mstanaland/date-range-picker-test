import * as React from "react";
import cx from "classnames";
import {
  useButton,
  useFocusRing,
  mergeProps,
  type AriaButtonOptions,
} from "react-aria";
import { XMarkIcon } from "@heroicons/react/20/solid";

export function NextPreviousButton(props) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <button
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
      className={cx(
        "next-prev-button",
        `p-2 rounded-full ${props.isDisabled ? "text-gray-400" : ""} ${
          !props.isDisabled ? "hover:bg-violet-100 active:bg-violet-200" : ""
        } outline-none ${
          isFocusVisible ? "ring-2 ring-offset-2 ring-purple-600" : ""
        }`
      )}
    >
      {props.children}
    </button>
  );
}

export function ClearDatesButton(props: AriaButtonOptions<"button">) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button
      {...buttonProps}
      ref={ref}
      className="clear-dates-button"
      aria-label="Clear dates"
    >
      <XMarkIcon className="button-icon x-icon" />
    </button>
  );
}
