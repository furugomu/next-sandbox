import Head from "next/head";
import React, {
  DependencyList,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export const title = "数字がドゥルルッと増える奴";
const Page = () => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <h1>{title}</h1>
    <div>
      <Foo />
    </div>
  </>
);
export default Page;

const Foo = () => {
  const [number, setNumber] = useState(0);
  const [additive, setAdditive] = useState(10000);
  const increment = useCallback(() => setNumber(number + additive), [
    number,
    additive,
  ]);
  const vvv = useAnimatedNumber(number);
  return (
    <div>
      <p style={{ fontSize: "3em", fontWeight: "bold" }}>{vvv | 0}</p>
      <div>
        <div>{number}</div>
        <button onClick={() => increment()}>add</button>
        <input
          type="number"
          value={additive}
          onChange={(e) => setAdditive(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

const useAnimationFrame = (
  callback: (t: DOMHighResTimeStamp) => void,
  deps?: DependencyList
) => {
  useEffect(() => {
    let id: number = requestAnimationFrame(tick);
    let done = false;
    const stop = () => {
      cancelAnimationFrame(id);
      done = true;
    };
    function tick(t: DOMHighResTimeStamp) {
      if (done) return;
      callback(t);
      id = requestAnimationFrame(tick);
    }
    return stop;
  }, [...(deps ?? []), callback]);
};

const useAnimatedNumber = (value: number) => {
  const previous = useRef(value);
  const [display, setDisplay] = useState(value);
  // 時間をかけてあたらしい数になる
  const startedAt = useRef(-1);
  const duration = 2000;
  useAnimationFrame(
    (t) => {
      if (value === previous.current) return;
      if (startedAt.current < 0) startedAt.current = t;
      const start = startedAt.current;
      const p = Math.min((t - start) / duration, 1);
      setDisplay(previous.current + (value - previous.current) * p);
      if (p >= 1) {
        previous.current = value;
        startedAt.current = -1;
      }
    },
    [value]
  );
  return display;
};
