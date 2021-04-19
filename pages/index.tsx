import fs from "fs/promises";
import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import React from "react";

type Page = { url: string; title: string };

type Props = { pages: Page[] };

export const getStaticProps: GetStaticProps<Props> = async () => {
  const pages: Page[] = [];
  const pagesDirectory = path.join(process.cwd(), "pages");
  const entries = await fs.readdir(pagesDirectory);
  for (const filename of entries) {
    if (!filename.endsWith(".tsx")) continue;
    const name = path.basename(filename, ".tsx");
    const mod = await import(`./${name}`);
    if (mod.title) pages.push({ url: `/${name}`, title: mod.title });
  }
  return { props: { pages } };
};

const Home = ({ pages }: Props) => (
  <>
    <Head>
      <title>こんにちは</title>
    </Head>
    <div>
      <p>Hello こんにちは</p>
      <p>
        <a href="https://github.com/furugomu/next-sandbox">ソース</a>
      </p>
      <ul>
        {pages.map(({ url, title }) => (
          <li key={url}>
            <Link href={url}>
              <a>{title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </>
);
export default Home;
