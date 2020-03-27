import React, {
  FC,
  useEffect,
  useMemo,
  useCallback,
  useState,
  useReducer
} from "react";
import Head from "next/head";

export const title = "rtc";
const Page: FC = () => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Rtc></Rtc>
    </>
  );
};
export default Page;

const Rtc: FC = () => {
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const handleOffer = useCallback(
    (offer: RTCSessionDescriptionInit) => {
      setOffer(offer);
    },
    [setOffer]
  );

  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const handleAnswer = useCallback(
    (answer: RTCSessionDescriptionInit) => {
      setAnswer(answer);
    },
    [setAnswer]
  );

  // SSR 時は RTCPeerConnection 等が無いため終わるのを待つ
  const [rendered, setRendered] = useState(false);
  useEffect(() => {
    setRendered(true);
  }, []);

  if (!rendered) return <div>now SSRing ...</div>;
  return (
    <div style={{ display: "flex" }}>
      <Alice onOffer={handleOffer} answer={answer} />
      <Bob offer={offer} onAnswer={handleAnswer} />
    </div>
  );
};

const useMesssages = () => {
  type State = string[];
  type Action = { type: "receive"; payload: string };
  const reducer = (state: State, action: Action) => {
    switch (action.type) {
      case "receive":
        return [...state, action.payload];
    }
  };
  const [messages, dispatch] = useReducer(reducer, []);
  return {
    messages,
    receiveMessage: (payload: string) => dispatch({ type: "receive", payload })
  };
};

// 接続する人
const Alice: FC<{
  onOffer: (offer: RTCSessionDescriptionInit) => void;
  answer: RTCSessionDescriptionInit | null;
}> = ({ onOffer, answer }) => {
  const peer = useMemo(() => {
    const peer = new RTCPeerConnection({ iceServers: [] });
    peer.onsignalingstatechange = () =>
      console.log("alice signalingstatechange", peer.signalingState);
    peer.onicecandidate = e => console.log("alice icecandidate", e.candidate);
    return peer;
  }, []);
  (window as any).alice = peer;

  const { messages, receiveMessage } = useMesssages();

  const dataChannel = useMemo(() => {
    const dc = peer.createDataChannel("foo");
    dc.onmessage = e => {
      console.log("alice message", e);
      receiveMessage(e.data);
    };
    return dc;
  }, [peer, receiveMessage]);

  // 1. offer をつくる
  const [offer, setOffer] = useState<RTCSessionDescriptionInit | null>(null);
  const createOffer = useCallback(async () => {
    if (offer) return;
    const o = await peer.createOffer();
    await peer.setLocalDescription(o);
    setOffer(o);
    peer.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
      if (!e.candidate) return;
      if (!peer.localDescription) return;
      setOffer(peer.localDescription);
      onOffer(peer.localDescription);
    };
  }, [peer, offer, setOffer, onOffer]);
  useEffect(() => {
    createOffer();
  }, [createOffer]);

  // 3. answer を受け取る
  useEffect(() => {
    if (!answer) return;
    if (peer.remoteDescription) return;
    peer.setRemoteDescription(answer).then(() => {
      console.log("できたが？");
    });
  }, [peer, answer]);

  return (
    <div>
      <h3>ア</h3>
      <details>
        <summary>sdp</summary>
        <p>offer sdp {offer ? offer.sdp : "まだ"}</p>
        <p>answer sdp {answer ? answer.sdp : "まだ"}</p>
      </details>
      <DataChannelInput dataChannel={dataChannel} />
      <ul>
        {messages.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

// 接続される人
const Bob: FC<{
  offer: RTCSessionDescriptionInit | null;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
}> = ({ offer, onAnswer }) => {
  const { messages, receiveMessage } = useMesssages();
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peer = useMemo(() => {
    const peer = new RTCPeerConnection({ iceServers: [] });
    peer.onsignalingstatechange = () =>
      console.log("bob signalingstatechange", peer.signalingState);
    peer.ondatachannel = e => {
      const dc = e.channel;
      setDataChannel(dc);
      dc.onmessage = e => {
        console.log("bob message", e);
        receiveMessage(e.data);
      };
    };

    peer.onicecandidate = e => console.log("bob icecandidate", e.candidate);
    return peer;
  }, [receiveMessage]);
  (window as any).bob = peer;

  // 2. offer を受け取って answer を作る
  const [answer, setAnswer] = useState<RTCSessionDescriptionInit | null>(null);
  const createAnswer = useCallback(async () => {
    if (!offer) return;
    if (answer) return;
    peer.setRemoteDescription(offer);
    const a = await peer.createAnswer();
    await peer.setLocalDescription(a);
    setAnswer(a);

    peer.onicecandidate = e => {
      if (!e.candidate) return;
      if (!peer.localDescription) return;
      setAnswer(peer.localDescription);
      onAnswer(peer.localDescription);
    };
  }, [peer, offer, answer, setAnswer, onAnswer]);
  useEffect(() => {
    createAnswer();
  }, [createAnswer]);

  return (
    <div>
      <h3>ボ</h3>
      <details>
        <summary>sdp</summary>
        <p>offer sdp {offer ? offer.sdp : "まだ"}</p>
        <p>answer sdp {answer ? answer.sdp : "まだ"}</p>
      </details>
      <DataChannelInput dataChannel={dataChannel} />
      <ul>
        {messages.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
};

// 入力した文字列を dataChannel に送る
const DataChannelInput: FC<{ dataChannel: RTCDataChannel | null }> = ({
  dataChannel
}) => {
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const send = useCallback(() => {
    if (!dataChannel) return;
    dataChannel.send(message);
    setMessage("");
  }, [dataChannel, message, setMessage]);
  useEffect(() => {
    if (!dataChannel) {
      setReady(false);
      return;
    }
    setReady(dataChannel.readyState === "open");
    dataChannel.onopen = () => {
      setReady(true);
    };
    dataChannel.onclose = () => {
      setReady(false);
    };
  }, [dataChannel]);
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        send();
      }}
    >
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        disabled={!ready}
      />
      <button disabled={!ready}>send</button>
    </form>
  );
};
