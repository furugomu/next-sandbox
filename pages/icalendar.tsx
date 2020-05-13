// ics ファイルへのリンクをアレするとスマホで予定を登録できる件について
import React, { FC, useState, useEffect } from "react";
import { calendar, Event as VEvent } from "../src/icalendar";
import { addHours, format, parseISO } from "date-fns";
import Head from "next/head";

export const title = "予定を登録するやつ";

const Page: FC = () => {
  const [url, setUrl] = useState("");
  const handleChange = (e: VEvent) => {
    const ics = calendar([e]);
    setUrl(`data:text/calendar,${encodeURIComponent(ics)}`);
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <h1>{title}</h1>
        <EventForm onChange={handleChange} />
        <p>
          <a href={url}>予定を登録する</a>
        </p>
        <figure>
          <img src="/icalendar-ios.jpg" width="320" />
          <figcaption>iOS の Safari だとこうなる</figcaption>
        </figure>
      </div>
    </>
  );
};
export default Page;

const formatDate = (d: Date) => format(d, "yyyy-MM-dd'T'HH:mm");

const EventForm = ({ onChange }: { onChange: (event: VEvent) => void }) => {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(addHours(new Date(), 1));
  const [summary, setSummary] = useState("予定");
  const [description, setDescription] = useState("予定がございます");
  useEffect(() => {
    onChange({ start, end, summary, description });
  }, [start, end, summary, description]);

  return (
    <div>
      <p>
        <label>
          開始
          <input
            type="datetime-local"
            value={formatDate(start)}
            onChange={(e) => setStart(parseISO(e.target.value))}
          />
        </label>
      </p>
      <p>
        <label>
          終了
          <input
            type="datetime-local"
            value={formatDate(end)}
            onChange={(e) => setEnd(parseISO(e.target.value))}
          />
        </label>
      </p>
      <p>
        <label>
          <input
            type="string"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
      </p>
      <p>
        <label>
          <input
            type="string"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </p>
    </div>
  );
};
