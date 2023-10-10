import "./CalendarCell.scss";

import { useRef } from "react";
import cx from "classnames";
import { type RangeCalendarState } from "react-stately";
import {
  useCalendarCell,
  useLocale,
  useFocusRing,
  mergeProps,
} from "react-aria";
import {
  isSameDay,
  getDayOfWeek,
  type CalendarDate,
  isSameMonth,
} from "@internationalized/date";

interface CalendarCellProps {
  state: RangeCalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
}

export function CalendarCell({ state, date, currentMonth }: CalendarCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    isDisabled,
    formattedDate,
    isInvalid,
  } = useCalendarCell({ date }, state, ref);

  const isOutsideMonth = !isSameMonth(currentMonth, date);

  // The start and end date of the selected range will have
  // an emphasized appearance.
  const isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  const isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;

  // We add rounded corners on the left for the first day of the month,
  // the first day of each week, and the start date of the selection.
  // We add rounded corners on the right for the last day of the month,
  // the last day of each week, and the end date of the selection.
  const { locale } = useLocale();
  const dayOfWeek = getDayOfWeek(date, locale);
  const isRoundedLeft =
    isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
  const isRoundedRight =
    isSelected &&
    (isSelectionEnd ||
      dayOfWeek === 6 ||
      date.day === date.calendar.getDaysInMonth(date));

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <td {...cellProps} className="calendar-cell-td">
      <div
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        hidden={isOutsideMonth || isOutsideVisibleRange}
        className={cx("calendar-cell", {
          "rounded-left": isRoundedLeft,
          "rounded-right": isRoundedRight,
          selected: isSelected && !isInvalid,
          "selected-invalid": isSelected && isInvalid,
          disabled: isDisabled,
        })}
      >
        <div
          className={cx("calendar-cell-inner", {
            disabled: isDisabled && !isInvalid,
            "focus-visible": isFocusVisible,
            start: isSelectionStart && !isInvalid,
            end: isSelectionEnd && !isInvalid,
            invalid: isInvalid,
            middle:
              isSelected &&
              !isDisabled &&
              !(isSelectionStart || isSelectionEnd),
            unselected: !isSelected && !isDisabled,
          })}
        >
          {formattedDate}
        </div>
      </div>
    </td>
  );
}
