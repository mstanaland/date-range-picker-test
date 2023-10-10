import "./ToggleCalendarButton.scss";

import * as React from "react";
import { useButton, type AriaButtonOptions } from "react-aria";
import { CalendarIcon } from "@heroicons/react/20/solid";

interface ToggleCalendarButtonProps extends AriaButtonOptions<"button"> {
  // isOpen: boolean;
  // close: () => void;
}

export const ToggleCalendarButton = React.forwardRef<
  HTMLButtonElement,
  ToggleCalendarButtonProps
>((props, forwardedRef) => {
  const { buttonProps } = useButton(
    props,
    forwardedRef as React.RefObject<Element>
  );

  return (
    <button
      {...buttonProps}
      ref={forwardedRef}
      className="toggle-calendar-button"
    >
      <CalendarIcon className="button-icon calendar-icon" />
    </button>
  );
});
