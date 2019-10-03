import React from "react";
import Link from "next/link";
import { title as mousechaserTitle } from "./mousechaser";

const Home = () => (
  <div>
    <p>Hello こんにちは</p>
    <ul>
      <li>
        <Link href="/mousechaser">
          <a>{mousechaserTitle}</a>
        </Link>
      </li>
    </ul>
  </div>
);
export default Home;
