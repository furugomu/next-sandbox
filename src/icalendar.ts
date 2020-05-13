// https://tools.ietf.org/html/rfc2445
import { format, addMinutes } from "date-fns";

export const calendar = (events: Event[]) =>
  component(
    "vcalendar",
    { prodid: "-//u//n//ko", version: "2.0" },
    events.map(event)
  ) + "\n";

export type Event = {
  start: Date;
  end: Date;
  summary: string;
  description?: string;
};
export const event = ({ start, end, summary, description }: Event) =>
  component("vevent", {
    dtstart: start,
    dtend: end,
    summary,
    description,
  });

type Props = { [key: string]: string | Date | undefined };
const component = (name: string, props: Props, children?: string[]) => {
  const lines = ["BEGIN:" + name.toUpperCase()];
  for (const [k, v] of Object.entries(props)) {
    if (v == null) continue;
    lines.push(k.toUpperCase() + ":" + value(v));
  }
  if (children) children.forEach((x) => lines.push(x));
  lines.push("END:" + name.toUpperCase());
  return lines.join("\n");
};

// https://tools.ietf.org/html/rfc2445#section-4.3
type Value = string | Date; // 他は省略
const value = (v: Value) => {
  if (v instanceof Date) {
    return format(addMinutes(v, v.getTimezoneOffset()), "yyyyMMdd'T'HHmmss'Z'");
  } else {
    return v;
  }
};
