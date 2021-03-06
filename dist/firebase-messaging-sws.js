importScripts("/precache-manifest.7b82f3d293585e9db39c6262add13d15.js", "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
const config = {
  messagingSenderId: '69625964474'
}
firebase.initializeApp(config)
const messaging = firebase.messaging()

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  // Customize notification here
  const notificationTitle = 'Background Message Title'
  const notificationOptions = {
    body: 'Background Message body.',
    icon: 'https://raw.githubusercontent.com/kevguy/My-Shitty-Music-Frontend/master/public/img/icons/icon-72x72.png'
  }

  return self.registration.showNotification(notificationTitle,
    notificationOptions)
})

