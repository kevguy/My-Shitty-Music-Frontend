export default {
  // namespaced: true,
  state: {
    drawerOpen: false,
    showSnackBar: false,
    snackBarMsg: '',
    imageDialogOpen: false,
    messageDialogOpen: false,
    chosenImage: { name: '', url: '' }
  },
  mutations: {
    toggleDrawer (state, payload) { state.drawerOpen = payload },
    toggleSnackBar (state, payload) { state.showSnackBar = payload },
    updateSnackBarMsg (state, payload) { state.snackBarMsg = payload },
    toggleImageDialog (state, payload) { state.imageDialogOpen = payload },
    updateChosenImage (state, payload) { state.chosenImage = payload },
    toggleMessageDialog (state, payload) { state.messageDialogOpen = payload }
  }
}
