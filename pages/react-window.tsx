import Head from "next/head";
import { CSSProperties, FC, useCallback, useMemo } from "react";
import { FixedSizeList as List, ListOnItemsRenderedProps } from "react-window";
import { useSWRInfinite } from "swr";

export const title = "react-window と useSWRInfinite で無限スクロール";

const Page = () => (
  <>
    <Head>
      <title>{title}</title>
    </Head>
    <div>
      <h1>{title}</h1>
      <InfiniteList />
    </div>
  </>
);
export default Page;

type ListItem = {
  name: string;
  createdAt: Date;
};

// 1 秒後に何かを返す
const pseudoFetch = ({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}): Promise<ListItem[]> => {
  console.log("fetch", offset);
  return new Promise((resolve) => {
    const now = new Date();
    const items = [...range(limit)].map((i) => ({
      name: `Item ${offset + i}`,
      createdAt: now,
    }));
    setTimeout(() => resolve(items), 1000);
  });
};

const InfiniteList = () => {
  const perPage = 10;
  // URL は無いので offset だけ返す
  const getKey = (pageIndex: number) => `${pageIndex * perPage}`;
  const fetcher = (key: string) => {
    return pseudoFetch({ offset: Number(key), limit: perPage });
  };
  const { data, size, setSize } = useSWRInfinite(getKey, fetcher);
  const items = useMemo(() => (data || []).flat(), [data]);

  // 末尾に辿り着いたら次のページへ
  const handleOnItemRendered = useCallback(
    (props: ListOnItemsRenderedProps) => {
      console.log("onItemRendered", props, size, size * perPage);
      const { overscanStopIndex } = props;
      if (overscanStopIndex >= perPage * size) {
        console.log("setSize", size + 1);
        setSize(size + 1);
      }
    },
    [size]
  );

  return (
    <List
      height={400}
      itemCount={items.length + 1}
      itemSize={60}
      width="80vw"
      itemData={items}
      onItemsRendered={handleOnItemRendered}
    >
      {Row}
    </List>
  );
};

const Row = ({
  data,
  index,
  style,
}: {
  data: ListItem[];
  index: number;
  style: CSSProperties;
}) => {
  if (index >= data.length) {
    return <div style={style}>loading...</div>;
  }
  const item = data[index];
  return (
    <div style={{ ...style, borderBottom: "dotted 1px grey" }}>
      <div>{item.name}</div>
      <div>{item.createdAt.toISOString()}</div>
    </div>
  );
};

function* range(n: number) {
  for (let i = 0; i < n; ++i) yield i;
}
