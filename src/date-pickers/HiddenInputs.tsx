/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import { type DateRangePickerState } from "react-stately";

interface HiddenInputsProps {
  name: string;
  value: DateRangePickerState["value"];
  startInputRef?: React.RefObject<HTMLInputElement>;
  endInputRef?: React.RefObject<HTMLInputElement>;
}

export function HiddenInputs({
  name,
  value,
  startInputRef,
  endInputRef,
}: HiddenInputsProps) {
  const startValue = value?.start?.toString() || "";
  const endValue = value?.end?.toString() || "";

  return (
    <>
      <input
        name={`${name}Start`}
        type="hidden"
        value={startValue}
        ref={startInputRef}
      />
      <input
        name={`${name}End`}
        type="hidden"
        value={endValue}
        ref={endInputRef}
      />
    </>
  );
}
