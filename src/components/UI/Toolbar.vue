<template lang="html">
  <header class="mdc-top-app-bar mdc-top-app-bar--prominent">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-toolbar__section--align-start">
        <button
          class="material-icons mdc-top-app-bar__navigation-icon"
          @click.stop="toggleDrawer(true)"
          >menu</button>


        <span class="mdc-top-app-bar__title">My Shitty Music</span>
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Download"
          >file_download</button>
        <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Download"
          v-on:click="login()">print</button>
        <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Logout"
          v-if="isLogin"
          v-on:click="logout()">exit_to_app</button>
        <GoogleSignInBtn />
      </section>
    </div>
  </header>
  <!-- <header class="mdc-toolbar mdc-top-app-bar--fixed mdc-top-app-bar mdc-top-app-bar--prominent">
    <div class="mdc-toolbar__row">
      <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
        <a href="#" class="material-icons mdc-toolbar__menu-icon" @click.stop="toggleDrawer(true)">menu</a>
        <span class="mdc-toolbar__title">My Shitty Music ({{workingEnvironment}})</span>
      </section>
      <section class="mdc-toolbar__section mdc-toolbar__section--align-end" role="toolbar">
        <a href="#" class="material-icons mdc-toolbar__icon demo-toolbar__icon--custom" aria-label="Download" alt="Download">file_download</a>
        <a
          href="#"
          class="material-icons mdc-toolbar__icon demo-toolbar__icon--custom"
          aria-label="Print this page"
          alt="Print this page"
          v-on:click="login()">print</a>
      </section>
    </div>
  </header> -->

</template>

<script>
import { mapMutations, mapState } from 'vuex'
import {MDCTopAppBar} from '@material/top-app-bar/index';
import GoogleSignInBtn from './GoogleSignInBtn.vue'

export default {
  components: { GoogleSignInBtn },
  computed: {
    workingEnvironment() { return this.$store.state.environment },
    ...mapState({
      isLogin: state => state.isLogin
    })
  },
  mounted() {
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer',
      // logout: 'logout'
    }),
    logout() {
      this.$store.commit('logout')
      localStorage.setItem('userInfo', '')
    //   this.$router.push({
    //     path: '/'
    //   })
      window.location.href = this.$store.state.baseUrl
    }

  }
}
</script>

<style lang="scss" scoped>
.mdc-top-app-bar {
  z-index: 1;
}
</style>
