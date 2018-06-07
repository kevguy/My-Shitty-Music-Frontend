import Vue from 'vue'
import Vuex from 'vuex'

import firebase from '@firebase/app'
import '@firebase/messaging'

import UI from './store-modules/UI'
import Websocket from './store-modules/Websocket'
import YouTubeMusicPlayer from './store-modules/YouTubeMusicPlayer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UI, Websocket, YouTubeMusicPlayer
  },
  state: {
    baseUrl: process.env.VUE_APP_BACKEND_URL,
    rootUrl: process.env.VUE_APP_BASE_URL,
    wsUrl: process.env.VUE_APP_WEB_SOCKET,
    isLogin: false,
    isFCMSetup: false,
    userDisplayName: '',
    userId: '',
    token: '',
    songs: [],
    isServiceWorkerRegistered: false
  },
  mutations: {
    updateSongs (state, payload) { state.songs = payload },
    updatePlay (state, { id, plays }) {
      const songs = state.songs.map((song) => {
        if (song.id === id) {
          return {
            ...song,
            plays
          }
        }
        return song
      })
      state.songs = songs
    },
    updateUpvote (state, { songId, upvotes, userId }) {
      const songs = state.songs.map((song) => {
        if (song.id === songId) {
          const payload = {
            ...song,
            upvotes
          }
          if (userId === state.userId) {
            payload.isHeart = true
          }
          return payload
        }
        return song
      })
      state.songs = songs
    },
    addHeartsToSongs (state, payload) {
      const songs = state.songs.map((song) => {
        if (payload.indexOf(song.id) >= 0) {
          return {
            ...song,
            isHeart: true
          }
        } else {
          return {
            ...song,
            isHeart: false
          }
        }
      })
      state.songs = songs
    },
    updateLoginInfo (state, payload) {
      state.isLogin = payload.isLogin
      state.userDisplayName = payload.userDisplayName
      state.userId = payload.userId
      state.token = payload.token
    },
    logout (state) {
      state.isLogin = false
      state.userDisplayName = ''
      state.userId = ''
      state.token = ''

      if (window && window.localStorage) {
        localStorage.setItem('userInfo', '')
        // window.location.href = state.rootUrl
      }
    },
    updateFCMStatus (state, payload) {
      state.isFCMSetup = payload
    },
    updateServiceWorkerStatus (state, payload) {
      state.isServiceWorkerRegistered = payload
    }
  },
  actions: {
    async UPDATE_LOGIN_STATE ({ state, commit, dispatch }, info) {
      try {
        const res = await fetch(`${state.baseUrl}/check-login`, {
          method: 'POST',
          mode: 'cors',
          // headers: {
          //   'Accept': 'application/json',
          //   'Content-Type': 'application/json'
          // },
          body: JSON.stringify({
            user_id: info.user_id,
            token: info.token
          })
        })
        const result = await res.json()
        if (result.status) {
          commit('updateLoginInfo', {
            isLogin: true,
            userDisplayName: info.display_name,
            userId: info.user_id,
            token: info.token
          })

          await dispatch('FETCH_USER_UPVOTES')
          // if (window && navigator) {
          //   await dispatch('SETUP_FCM')
          // }
          if (localStorage) {
            const token = localStorage.getItem('FCM_TOKEN')
            if (token) {
              console.log(token)
              await dispatch('UPDATE_FCM_TOKEN', token)
            }
          }
        } else {
          commit('logout')
        }
      } catch (e) {
        console.error(e)
        commit('logout')
      }
    },
    async GOOGLE_LOGIN ({ state, commit }, googleCode) {
      try {
        const res = await fetch(`${state.baseUrl}/authenticate`, {
          method: 'POST',
          mode: 'cors',
          // headers: {
          //   'Accept': 'application/json',
          //   'Content-Type': 'application/json'
          // },
          body: JSON.stringify({
            type: 'google',
            code: googleCode
          })
        })
        const result = await res.json()
        const payload = {
          isLogin: true,
          userId: result.user_id,
          token: result.token,
          userDisplayName: result.user_name
        }
        commit('updateLoginInfo', payload)
      } catch (e) {
        console.error('GOOGLE_LOGIN', e)
        commit('logout')
      }
    },
    async FETCH_SONGS ({ commit, state, dispatch }) {
      const res = await fetch(`${state.baseUrl}/songs`)
      let result = await res.json()
      let isUpdate = state.songs.length > 0
      result = result.map((song) => ({
        ...song,
        isHeart: false
      }))
      if (isUpdate && state.isLogin) {
        // already fetched songs before this time,
        // so need to fetch user upvotes again
        await dispatch('FETCH_USER_UPVOTES')
      }
      commit('updateSongs', result)
    },
    async FETCH_PLAYS ({ commit, state }) {
      try {
        const res = await fetch(`${state.baseUrl}/songs/plays`)
        const result = await res.json()
        const lookup = {}
        // for (let item of result) {
        //   console.log(item)
        // }
        result.forEach(item => {
          lookup[item.SongID] = item.Plays
        })
        const songs = state.songs.map(song => ({
          ...song,
          plays: lookup[song.id]
        }))
        commit('updateSongs', songs)
      } catch (e) {
        console.error('FETCH_PLAYS failed', e)
      }
    },
    async FETCH_USER_UPVOTES ({ commit, state }) {
      try {
        const res = await fetch(`${state.baseUrl}/users/upvotes/${state.userId}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': state.token
          }
        })
        const result = await res.json()
        commit('addHeartsToSongs', result.upvotes)
      } catch (e) {
        console.error('FETCH_USER_UPVOTES failed', e)
      }
    },
    async UPDATE_FCM_TOKEN ({ commit, state }, token) {
      try {
        console.log(`before doing UPDATE_FCM_TOKEN`)
        // let token
        // if (localStorage) {
        //   token = localStorage.getItem('FCM_TOKEN')
        // }
        console.info(`login status is ${state.isLogin}`)
        await fetch(`${state.baseUrl}/update-fcm-token`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-access-token': state.token
          },
          body: JSON.stringify({
            token
          })
        })
        commit('updateFCMStatus', true)
      } catch (e) {
        console.error('Failed to UPDATE_FCM_TOKEN', e)
      }
    },
    async SETUP_FCM ({ commit, state, dispatch }) {
      console.log('SETUP_FCM')
      const messaging = firebase.messaging()
      console.log('use public vapid key')

      // console.log(state.serviceWorkerRegistration)
      if (!state.isServiceWorkerRegistered) {
        try {
          messaging.usePublicVapidKey('BJvhLia-szgnA5EUiD71RT_ffEwG1d3E9mcK2poaMSWlzZAkhM-WAmfqBLlwDmf4WGO1MX7PWno7PCHGERj8Grc')
          console.log('trying to register')
          const registration = await navigator.serviceWorker.register(`${process.env.BASE_URL}firebase-messaging-sws.js`)
          console.log(registration)
          messaging.useServiceWorker(registration)
          commit('updateServiceWorkerStatus', true)
          // messaging.useServiceWorker(state.serviceWorkerRegistration)
          console.log('start await request permission')
          await messaging.requestPermission()
          console.log('after await request permission')
          // permission granted (don't need to check result of messaging.requestPermission())
          // Retrieve an Instance ID token for use with FCM.
          console.log('start awaiting token')
          const currentToken = await messaging.getToken()
          console.log('after awaiting token')
          if (currentToken) {
            // subscribe token to
            if (localStorage) {
              localStorage.setItem('FCM_TOKEN', currentToken)
            }
            console.log(currentToken)
            if (localStorage) {
              localStorage.setItem('FCM_TOKEN', currentToken)
            }
            // if (state.isLogin) {
            //   dispatch('UPDATE_FCM_TOKEN', currentToken)
            // }
            // handle token refresh
            messaging.onTokenRefresh(async () => {
              try {
                const currentToken = await messaging.getToken()
                console.log(currentToken)
                // if (state.isLogin) {
                //   dispatch('UPDATE_FCM_TOKEN', currentToken)
                // }
                if (localStorage) {
                  localStorage.setItem('FCM_TOKEN', currentToken)
                }
              } catch (e) {
                console.error('Unable to refresh token', e)
              }
            })

            messaging.onMessage((payload) => {
              console.log(`Message received. ${payload}`)
              // alert(payload)
            })
          }
        } catch (e) {
          // unable to get permission to notify
          console.error('Unable to get permission to notify.', e)
        }
      }
    }
  }
})
