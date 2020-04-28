import React from "react";
import Link from "next/link";
import { title as mousechaserTitle } from "./mousechaser";
import { title as webpushTitle } from "./webpush";
import { title as gqsTitle } from "./graphql-subscription";
import Head from "next/head";

const Home = () => (
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
        <li>
          <Link href="/mousechaser">
            <a>{mousechaserTitle}</a>
          </Link>
        </li>
        <li>
          <Link href="/webpush">
            <a>{webpushTitle}</a>
          </Link>
        </li>
        <li>
          <Link href="/graphql-subscription">
            <a>{gqsTitle}</a>
          </Link>
        </li>
      </ul>
    </div>
  </>
);
export default Home;
