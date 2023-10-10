import "./RangeCalendar.scss";

import * as React from "react";
import { useRangeCalendarState } from "react-stately";
import {
  useRangeCalendar,
  useLocale,
  type RangeCalendarProps,
} from "react-aria";
import { createCalendar, type DateValue } from "@internationalized/date";
import { NextPreviousButton } from "./Button";
import { CalendarGrid } from "./CalendarGrid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export function RangeCalendar(props: RangeCalendarProps<DateValue>) {
  const { locale } = useLocale();
  const state = useRangeCalendarState({
    ...props,
    visibleDuration: { months: 2 },
    locale,
    createCalendar,
  });

  const ref = React.useRef<HTMLDivElement>(null);
  const { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar({ ...props }, state, ref);

  return (
    <div {...calendarProps} ref={ref} className="range-calendar">
      <div className="calendar-header-group">
        <h2 className="heading">{title}</h2>
        <div className="buttons">
          <NextPreviousButton {...prevButtonProps}>
            <ChevronLeftIcon />
          </NextPreviousButton>
          <NextPreviousButton {...nextButtonProps}>
            <ChevronRightIcon />
          </NextPreviousButton>
        </div>
      </div>
      <div className="calendar-grids-container">
        <CalendarGrid state={state} />
        <CalendarGrid state={state} offset={{ months: 1 }} />
      </div>
    </div>
  );
}
