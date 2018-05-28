import Vue from 'vue'
import Vuex from 'vuex'

import UI from './store-modules/UI'
import YouTubeMusicPlayer from './store-modules/YouTubeMusicPlayer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    UI, YouTubeMusicPlayer
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
    }
  }
})
