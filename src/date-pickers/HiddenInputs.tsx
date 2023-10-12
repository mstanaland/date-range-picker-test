/* © 2017-2023 Booz Allen Hamilton Inc. All Rights Reserved. */

import { type DateRangePickerState } from "react-stately";

interface HiddenInputsProps {
  startName: string;
  endName: string;
  value: DateRangePickerState["value"];
  startRef?: React.RefObject<HTMLInputElement>;
  endRef?: React.RefObject<HTMLInputElement>;
}

export function HiddenInputs({
  startName,
  endName,
  value,
  startRef,
  endRef,
}: HiddenInputsProps) {
  const startValue = value?.start?.toString() || "";
  const endValue = value?.end?.toString() || "";

  return (
    <>
      <input name={startName} type="hidden" value={startValue} ref={startRef} />
      <input name={endName} type="hidden" value={endValue} ref={endRef} />
    </>
  );
}
