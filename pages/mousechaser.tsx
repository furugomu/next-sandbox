import React, { FC, useState, useEffect, useCallback } from "react";
import Head from "next/head";

export const title = "マウスをおいかける奴";
const Page = () => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <div style={{ width: "4000px", height: "4000px" }}>
      <h1>{title}</h1>
      <button style={{ position: "absolute", left: "400px", top: "200px" }}>
        ボタンを押す時じゃまにならない
      </button>
      <MouseChaser delay={100}>う</MouseChaser>
      <MouseChaser delay={200}>ん</MouseChaser>
      <MouseChaser delay={300}>こ</MouseChaser>
      <MouseChaser delay={400}>💩</MouseChaser>
    </div>
  </>
);
export default Page;

const MouseChaser: FC<{ delay: number }> = ({ delay, children }) => {
  const [x, setX] = useState(-1);
  const [y, setY] = useState(-1);
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (delay === 0) {
        setX(e.clientX);
        setY(e.clientY);
        return;
      }
      setTimeout(() => {
        setX(e.clientX);
        setY(e.clientY);
      }, delay);
    },
    [delay]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  if (x < 0) return null;
  return (
    <Hoge x={x} y={y}>
      {children}
    </Hoge>
  );
};

const Hoge: FC<{ x: number; y: number }> = ({ x, y, children }) => (
  <div
    style={{
      pointerEvents: "none",
      userSelect: "none",
      position: "fixed",
      left: 0,
      top: 0,
      transform: `translate(${x}px, ${y}px)`
    }}
  >
    <div style={{ transform: "translate(-50%, -50%)" }}>{children}</div>
  </div>
);
