<template lang="html">
  <div id="notification--snack-bar" class="mdc-snackbar mdc-snackbar--align-start"
     aria-live="assertive"
     aria-atomic="true"
     aria-hidden="true">
  <div class="mdc-snackbar__text"></div>
  <div class="mdc-snackbar__action-wrapper">
    <button type="button" class="mdc-snackbar__action-button"></button>
  </div>
</div>
</template>

<script>
import { MDCSnackbar } from '@material/snackbar';

export default {
  data() {
    return {
      snackbar: undefined
    }
  },
  computed: {
    showSnackBar() { return this.$store.state.UI.showSnackBar },
    snackBarMsg() { return this.$store.state.UI.snackBarMsg },
  },
  watch: {
    showSnackBar(val) {
      if (val) {
        console.log(this.snackBarMsg)
        const dataObj = {
          message: this.snackBarMsg,
          actionText: 'Undo',
          actionHandler: () => {
            console.log(this.snackBarMsg)
          }
        }
        this.snackbar.show(dataObj)
        this.$store.commit('toggleSnackBar', false)
        this.$store.commit('updateSnackBarMsg', '')
      }
    }
  },
  mounted() {
    this.snackbar = new MDCSnackbar(document.querySelector('#notification--snack-bar'))
  }
}
</script>

<style lang="css">
</style>
