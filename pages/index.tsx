import React from "react";
import Link from "next/link";
import { title as mousechaserTitle } from "./mousechaser";
import { title as webpushTitle } from "./webpush";

const Home = () => (
  <div>
    <p>Hello こんにちは</p>
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
    </ul>
  </div>
);
export default Home;
