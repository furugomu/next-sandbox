import React, { useEffect, useState } from "react";
import Head from "next/head";

const TEXT =
  "親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談に、いくら威張っても、そこから飛び降りる事は出来まい。弱虫やーい。と囃したからである。小使に負ぶさって帰って来た時、おやじが大きな眼をして二階ぐらいから飛び降りて腰を抜かす奴があるかと云ったから、この次は抜かさずに飛んで見せますと答えた。";

export const title = "文字を徐々に表示する";

export default function Eroge() {
  const duration = durationForString(TEXT);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing || t >= duration) return;
    const timer = setTimeout(() => setT(t + 66), 66);
    return () => clearTimeout(timer);
  }, [playing, t, duration]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <div>
        <button onClick={() => setPlaying(true)}>再生</button>
        <button onClick={() => setPlaying(false)}>停止</button>
        <input
          type="range"
          min={0}
          max={duration}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
        />
        {t}
      </div>
      <p>{substringUntil(TEXT, t)}</p>
    </>
  );
}

const waitAfterChar = (c: string) => {
  if (c === "。") {
    return 500;
  } else {
    return 100;
  }
};

const durationForString = (s: string) =>
  [...s].reduce((n, c) => waitAfterChar(c) + n, 0);

const substringUntil = (s: string, duration: number) => {
  let n = 0;
  for (let i = 0; i < s.length; ++i) {
    if (duration < n) {
      return s.substring(0, i);
    }
    n += waitAfterChar(s.charAt(i));
  }
  return s;
};
