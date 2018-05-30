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
        <span class="mdc-top-app-bar__action-item mdc-typography--body3 display-name">{{displayName}}</span>
        <!-- <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Download"
          >file_download</button>
        <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Download"
          v-on:click="login()">print</button> -->
        <button
          class="material-icons mdc-top-app-bar__action-item"
          aria-label="Logout"
          v-if="isLogin"
          v-on:click="logout()">exit_to_app</button>
        <GoogleSignInBtn v-if="!isLogin"/>

      </section>
    </div>
  </header>
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
      isLogin: state => state.isLogin,
      displayName: state => state.userDisplayName
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
      window.location.href = this.$store.state.rootUrl
    }

  }
}
</script>

<style lang="scss" scoped>
.mdc-top-app-bar {
  z-index: 1;
}
.display-name {
  width: unset;
  padding-bottom: 12px;

  font-family: Roboto, sans-serif;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: 1.25rem;
  line-height: 2rem;
  font-weight: 500;
  letter-spacing: 0.0125em;
  text-decoration: inherit;
  text-transform: inherit;
  padding-left: 20px;
  padding-right: 0;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  z-index: 1;
}
</style>
