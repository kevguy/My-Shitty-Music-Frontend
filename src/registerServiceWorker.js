/* eslint-disable no-console */

import { register } from 'register-service-worker'
// import firebase from '@firebase/app'
// import '@firebase/messaging'
import store from './store'

// if (process.env.NODE_ENV === 'production') {
register(`${process.env.BASE_URL}firebase-messaging-sws.js`, {
  ready () {
    console.log(
      'App is being served from cache by a service worker.\n' +
      'For more details, visit https://goo.gl/AFskqB'
    )
  },
  registered (registration) {
    alert('Service worker has been registered.')
    console.log('Service worker has been registered.')
    store.state.serviceWorkerRegistration = registration
    /*
    // await store.dispatch('SETUP_FCM', registration)
    const config = {
      apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
      authDomain: process.env.VUE_APP_AUTH_DOMAIN,
      databaseURL: process.env.VUE_APP_DATABASE_URL,
      projectId: process.env.VUE_APP_PROJECT_ID,
      storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
    }

    firebase.initializeApp(config)
    firebase.messaging().usePublicVapidKey('BJvhLia-szgnA5EUiD71RT_ffEwG1d3E9mcK2poaMSWlzZAkhM-WAmfqBLlwDmf4WGO1MX7PWno7PCHGERj8Grc')
    firebase.messaging().useServiceWorker(registration)

    // const registration = await navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`)
    // console.log(registration)

    const messaging = firebase.messaging()
    // messaging.usePublicVapidKey('BJvhLia-szgnA5EUiD71RT_ffEwG1d3E9mcK2poaMSWlzZAkhM-WAmfqBLlwDmf4WGO1MX7PWno7PCHGERj8Grc')
    // messaging.useServiceWorker(registration)
    // console.log('shithead')
    // console.log(localStorage)
    // alert('fuck')
    // store.dispatch('SETUP_FCM', messaging)
    await messaging.requestPermission()
    // permission granted (don't need to check result of messaging.requestPermission())
    // Retrieve an Instance ID token for use with FCM.
    const currentToken = await messaging.getToken()
    if (currentToken) {
      // subscribe token to
      console.log(currentToken)
      // if (store.state.isLogin) {
      //   store.dispatch('UPDATE_FCM_TOKEN', currentToken)
      // }
      // handle token refresh
      messaging.onTokenRefresh(async () => {
        try {
          const currentToken = await messaging.getToken()
          console.log(currentToken)
          // if (store.state.isLogin) {
          //   store.dispatch('UPDATE_FCM_TOKEN', currentToken)
          // }
        } catch (e) {
          console.error('Unable to refresh token', e)
        }
      })

      messaging.onMessage((payload) => {
        console.log(`Message received. ${payload}`)
        // alert(payload)
      })
    }
    */
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
