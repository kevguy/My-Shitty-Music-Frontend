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

  },
  mutations: {

  },
  actions: {

  }
})
