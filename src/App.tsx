import "./App.css";

import * as React from "react";
import { DateRangePicker } from "./date-pickers/DateRangePicker";
import { parseDate } from "@internationalized/date";

import { useDateRangePickerValidation } from "./date-pickers/useDateRangePickerValidation";

function App() {
  const [value, setValue] = React.useState({
    start: parseDate("2020-02-03"),
    end: parseDate("2020-02-08"),
  });

  const { validate, dateRangePickerProps } = useDateRangePickerValidation({
    label: "With Validation",
    isRequired: true,
    // onChange: (x) => {
    //   console.log("onChange", x);
    // },
    validator: ({ start, end }) => {
      if (start && end) {
        const isInvalid = end.compare(start) <= 2;
        const errorMessage = isInvalid
          ? "Minimum reservation length is 4 days"
          : undefined;
        return { isInvalid, errorMessage };
      }

      return {
        isInvalid: false,
        errorMessage: undefined,
      };
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(Object.fromEntries(data.entries()));
  }

  return (
    <div>
      <button>Hello</button>

      <div className="spacer" />

      <div>
        Sit consetetur duo duo sit justo accusam dolore, nonumy sea et dolores
        voluptua et takimata, dolore sed et sit lorem sed voluptua, amet diam
        stet gubergren sed. Labore stet takimata diam labore dolor at dolor
        ipsum at. Sea sed takimata invidunt at amet, dolore diam lorem aliquyam
        consetetur. Vero et justo stet et no tempor elitr dolores labore,
        invidunt eos nonumy rebum et clita eos duo eos, no amet sed gubergren
        amet dolor dolore sed et, justo at amet sadipscing amet kasd dolores
        nonumy, amet et dolore labore et consetetur dolor. Dolor invidunt kasd
        sit ipsum. Rebum gubergren voluptua ut lorem dolor est ipsum et sanctus.
        Lorem tempor sit eirmod ea duo ea, et erat et sanctus invidunt eirmod
        accusam voluptua eos aliquyam, et dolore no dolores sea ut dolore clita.
        Amet magna dolor sed et aliquyam ipsum et. Stet diam lorem erat sanctus
        at, et vero elitr sit ipsum tempor, vero dolor et elitr clita ipsum diam
        dolores no duo, lorem accusam ut et dolor vero takimata stet, sed
        sadipscing ut ut tempor nonumy aliquyam sanctus, dolore diam magna erat
        diam diam et. Sed duo tempor elitr amet sed amet sanctus sadipscing
        rebum, no diam magna vero magna eirmod.
      </div>

      <div className="spacer" />

      <form onSubmit={onSubmit}>
        <label>
          <div>A field</div> <input type="text" name="my-input" />
        </label>

        <DateRangePicker label="Plain Jane" name="plainJane" />
        <div className="spacer" />
        <DateRangePicker {...dateRangePickerProps} name="withValidation" />

        <div className="spacer" />
        <label>
          <div>Something</div> <input type="text" name="something" />
        </label>

        <div className="spacer" />
        <button type="submit">Submit</button>
      </form>

      <button onClick={() => validate()}>Run validate</button>

      <div className="spacer" />

      <DateRangePicker
        label="Controlled date picker"
        value={value}
        onChange={setValue}
      />

      <div className="spacer" />

      <div>
        Sit consetetur duo duo sit justo accusam dolore, nonumy sea et dolores
        voluptua et takimata, dolore sed et sit lorem sed voluptua, amet diam
        stet gubergren sed. Labore stet takimata diam labore dolor at dolor
        ipsum at. Sea sed takimata invidunt at amet, dolore diam lorem aliquyam
        consetetur. Vero et justo stet et no tempor elitr dolores labore,
        invidunt eos nonumy rebum et clita eos duo eos, no amet sed gubergren
        amet dolor dolore sed et, justo at amet sadipscing amet kasd dolores
        nonumy, amet et dolore labore et consetetur dolor. Dolor invidunt kasd
        sit ipsum. Rebum gubergren voluptua ut lorem dolor est ipsum et sanctus.
        Lorem tempor sit eirmod ea duo ea, et erat et sanctus invidunt eirmod
        accusam voluptua eos aliquyam, et dolore no dolores sea ut dolore clita.
        Amet magna dolor sed et aliquyam ipsum et. Stet diam lorem erat sanctus
        at, et vero elitr sit ipsum tempor, vero dolor et elitr clita ipsum diam
        dolores no duo, lorem accusam ut et dolor vero takimata stet, sed
        sadipscing ut ut tempor nonumy aliquyam sanctus, dolore diam magna erat
        diam diam et. Sed duo tempor elitr amet sed amet sanctus sadipscing
        rebum, no diam magna vero magna eirmod.
      </div>

      <div className="spacer" />

      <button onClick={() => console.log("Hello yourself")}>Hello</button>
    </div>
  );
}

export default App;
