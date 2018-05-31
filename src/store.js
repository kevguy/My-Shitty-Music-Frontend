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
    // baseUrl: 'http://localhost:3000',
    baseUrl: 'https://my-shitty-music-backend.herokuapp.com',
    // rootUrl: 'http://localhost:8080',
    rootUrl: 'https://my-shitty-music.herokuapp.com',
    wsUrl: 'ws://my-shitty-music-backend.herokuapp.com/websocket',
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
    }
  },
  actions: {
    async UPDATE_LOGIN_STATE ({ state, commit, dispatch }, info) {
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

          await dispatch('FETCH_USER_UPVOTES')
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
      let result = await res.json()
      result = result.map((song) => ({
        ...song,
        isHeart: false
      }))
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
        console.error(e)
      }
    }
  }
})
