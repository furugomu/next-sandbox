import React, { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import urlB64ToUint8Array from "../src/url-b64-to-uint8-array";
import { PUBLIC_KEY } from "../src/webpush-keys";

export const title = 'プッシュ通知'

const applicationServerKey = urlB64ToUint8Array(PUBLIC_KEY);

const Page = () => {
  const [sw, setSw] = useState<ServiceWorkerRegistration | null>(null);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("こんにちは");

  // service worker を登録する
  useEffect(() => {
    (async () => {
      const sw = await navigator.serviceWorker.register("/sw.js");
      setSw(sw);
      const subscription = await sw.pushManager.getSubscription();
      setSubscription(subscription);
    })();
  }, []);

  // 通知を登録する
  const subscribe = useCallback(async () => {
    if (!sw) return;
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey
    });
    setSubscription(subscription);
  }, [sw]);

  // プッシュ通知する
  const push = useCallback(async () => {
    if (!subscription) return;
    const res = await fetch("/api/push", {
      method: "POST",
      body: JSON.stringify({ message, subscription })
    });
    console.log("やったか！？", res);
  }, [subscription, message]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="shortcut icon" href="/static/buta.png"></link>
      </Head>

      <section>
        <h1>{title}</h1>
        <p>登録済み？ {subscription ? "はい" : "いいえ"}</p>
        <p>
          <button disabled={!sw || !!subscription} onClick={subscribe}>
            プッシュ通知を有効にする
          </button>
        </p>
        <p>
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            size={60}
          ></input>
          <button disabled={!subscription} onClick={() => push()}>
            通知する
          </button>
        </p>
        <pre style={{ whiteSpace: "pre-wrap" }}>
          {JSON.stringify(subscription, null, 2)}
        </pre>
      </section>
    </>
  );
};
export default Page;
