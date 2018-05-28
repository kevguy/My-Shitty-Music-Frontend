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
    songs: []
  },
  mutations: {
    updateSongs (state, payload) { state.songs = payload }
  },
  actions: {
    async FETCH_SONGS ({ commit }) {
      const res = await fetch('http://localhost:3000/songs')
      const result = await res.json()
      commit('updateSongs', result)
    },
    async FETCH_PLAYS ({ commit, state }) {
      const res = await fetch('http://localhost:3000/songs/plays')
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
