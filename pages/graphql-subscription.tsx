import React, { FC, useState, useCallback, useReducer } from "react";
import { subscribe, parse, buildSchema, graphql } from "graphql";
import Head from "next/head";

export const title = "GraphQL Subscription";

const schema = buildSchema(`
  type Subscription {
    # 毎秒現在時刻を返す
    tick: String!
  }
  # Query が無いとだめらしい
  type Query {
    hello: String!
  }
`);

const query = `
  subscription mySub {
    tick
  }
`;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const rootValue = {
  // 毎秒現在時刻を返す
  async *tick() {
    for (let i = 0; i < 10; ++i) {
      yield { tick: new Date().toISOString() };
      await sleep(1000);
    }
  },
};

const url =
  "https://github.com/furugomu/next-sandbox/blob/master/pages/graphql-subscription.tsx";

const Page: FC = () => {
  const [list, append] = useReducer(
    (state: string[], payload: string) => [...state, payload],
    []
  );
  const start = useCallback(async () => {
    const iter = await subscribe({ schema, document: parse(query), rootValue });
    if (Symbol.asyncIterator in iter) {
      for await (const x of iter as any) {
        append(x.data.tick);
      }
    }
  }, []);
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <h1>{title}</h1>
      <p>
        source: <a href={url}>{url}</a>
      </p>
      <p>
        <button onClick={() => start()}>押すと開始</button>
      </p>
      <ul>
        {list.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    </div>
  );
};
export default Page;
