// プッシュ通知された
self.addEventListener("push", event => {
  console.log("[Service Worker] Push Received.");
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

  const title = "私はプッシュ通知です";
  const options = {
    body: event.data.text(),
    icon: "/static/kuma.png",
    badge: "/static/risu.png"
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知をクリックされた
self.addEventListener("notificationclick", event => {
  console.log("[Service Worker] Notification click Received.");

  event.notification.close();

  event.waitUntil(clients.openWindow("https://next-webpush-f2igo5y3d.now.sh/"));
});
