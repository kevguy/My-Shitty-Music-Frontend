import Vue from 'vue'
import Vuex from 'vuex'

import UI from './store-modules/UI'
import Websocket from './store-modules/Websocket'
import YouTubeMusicPlayer from './store-modules/YouTubeMusicPlayer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UI, Websocket, YouTubeMusicPlayer
  },
  state: {
    baseUrl: 'http://localhost:3000',
    rootUrl: 'http://localhost:8080',
    isLogin: false,
    userDisplayName: '',
    userId: '',
    token: '',
    songs: []
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
    }
  },
  actions: {
    async UPDATE_LOGIN_STATE ({ state, commit }, info) {
      console.log(info)
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
        console.error(e)
        commit('logout')
      }
    },
    async FETCH_SONGS ({ commit, state }) {
      const res = await fetch(`${state.baseUrl}/songs`)
      const result = await res.json()
      commit('updateSongs', result)
    },
    async FETCH_PLAYS ({ commit, state }) {
      const res = await fetch(`${state.baseUrl}/songs/plays`)
      const result = await res.json()
      const lookup = {}
      for (let item of result) {
        console.log(item)
      }
      result.forEach(item => {
        lookup[item.SongID] = item.Plays
      })
      const songs = state.songs.map(song => ({
        ...song,
        plays: lookup[song.id]
      }))
      commit('updateSongs', songs)
    }
  }
})
