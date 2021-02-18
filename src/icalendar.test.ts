import assert from "assert";
import "jest";
import { calendar } from "./icalendar";

describe("calendar", () => {
  test("returns ical", () => {
    const cal = calendar([
      { start: new Date(), end: new Date(), summary: "yotei" },
    ]);
    assert(cal);
  });
});
