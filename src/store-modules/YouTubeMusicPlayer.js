export default {
  namespaced: true,
  state: {
    currentVideoId: '',
    currentVideoDuration: 0,
    currentVideoCurrentTime: 0,
    userInputState: true
  },
  mutations: {
    updateCurrentVideoId (state, payload) { state.currentVideoId = payload },
    updateCurrentVideoDuration (state, payload) {
      state.currentVideoDuration = payload
    },
    updateCurrentVideoCurrentTime (state, payload) {
      state.currentVideoCurrentTime = payload
    },
    updateUserInputState (state, payload) { state.userInputState = payload }
  },
  actions: {}
}
