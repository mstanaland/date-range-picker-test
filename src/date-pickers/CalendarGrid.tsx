import "./CalendarGrid.scss";

import { useCalendarGrid, useLocale } from "react-aria";
import { type RangeCalendarState } from "react-stately";
import { getWeeksInMonth, endOfMonth } from "@internationalized/date";
import { CalendarCell } from "./CalendarCell";

interface CalendarGridProps {
  state: RangeCalendarState;
  offset?: { months?: number };
}

export function CalendarGrid({ state, offset = {} }: CalendarGridProps) {
  const { locale } = useLocale();
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  const { gridProps, headerProps, weekDays } = useCalendarGrid(
    { startDate, endDate },
    state
  );

  // Get the number of weeks in the month so we can render the proper number of rows.
  const weeksInMonth = getWeeksInMonth(startDate, locale);

  return (
    <table {...gridProps} cellPadding="0" className="calendar-table">
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index}>{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
