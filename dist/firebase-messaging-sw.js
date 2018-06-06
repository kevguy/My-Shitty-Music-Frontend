importScripts("/precache-manifest.52acd9cfdcd48a51789787f01070eff6.js", "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
var config = {
  messagingSenderId: "69625964474"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
  }

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
});

