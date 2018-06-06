/* eslint-disable no-console */

import { register } from 'register-service-worker'
import firebase from '@firebase/app'
import '@firebase/messaging'
import store from './store'

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
}

firebase.initializeApp(config)

// if (process.env.NODE_ENV === 'production') {
register(`${process.env.BASE_URL}firebase-messaging-sw.js`, {
  ready () {
    console.log(
      'App is being served from cache by a service worker.\n' +
      'For more details, visit https://goo.gl/AFskqB'
    )
  },
  registered (registration) {
    console.log('Service worker has been registered.')
    // const registration = await navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`)
    // console.log(registration)
    const messaging = firebase.messaging()
    messaging.usePublicVapidKey('BJvhLia-szgnA5EUiD71RT_ffEwG1d3E9mcK2poaMSWlzZAkhM-WAmfqBLlwDmf4WGO1MX7PWno7PCHGERj8Grc')
    messaging.useServiceWorker(registration)
    console.log('shithead')
    console.log(localStorage)
    alert('fuck')
    store.dispatch('SETUP_FCM', messaging)
  },
  cached () {
    console.log('Content has been cached for offline use.')
  },
  updated () {
    console.log('New content is available; please refresh.')
  },
  offline () {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    console.error('Error during service worker registration:', error)
  }
})
// }
