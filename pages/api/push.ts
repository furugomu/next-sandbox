import webpush from "web-push";
import { NextApiRequest, NextApiResponse } from "next";
import { PUBLIC_KEY, PRIVATE_KEY } from "../../src/webpush-keys";

webpush.setVapidDetails("https://example.com", PUBLIC_KEY, PRIVATE_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { subscription, message } = JSON.parse(req.body);
  try {
    await webpush.sendNotification(subscription, message);
    res.status(200);
    res.end("ok");
  } catch (e) {
    res.status(500);
    res.json(e.message);
  }
};
