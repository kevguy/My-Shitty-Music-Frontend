export default {
  // namespaced: true,
  state: {
    websocketMsg: undefined,
    sendWebsocketMsg: false
  },
  mutations: {
    toggleSendWebsocketMsg (state, payload) { state.sendWebsocketMsg = payload },
    updateWebsocketMsg (state, payload) { state.websocketMsg = payload }
  }
}
