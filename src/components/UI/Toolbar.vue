<template lang="html">
  <header class="mdc-top-app-bar mdc-top-app-bar--prominent">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-toolbar__section--align-start">
        <button
          class="material-icons mdc-top-app-bar__navigation-icon"
          @click.stop="toggleDrawer(true)"
          >menu</button>


        <span class="mdc-top-app-bar__title">My Shitty Music ({{workingEnvironment}})</span>
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
import { mapMutations } from 'vuex'
import {MDCTopAppBar} from '@material/top-app-bar/index';
import GoogleSignInBtn from './GoogleSignInBtn.vue'

export default {
  components: { GoogleSignInBtn },
  computed: {
    workingEnvironment() { return this.$store.state.environment }
  },
  mounted() {
    const topAppBarElement = document.querySelector('.mdc-top-app-bar');
    const topAppBar = new MDCTopAppBar(topAppBarElement);
  },
  methods: {
    ...mapMutations({
      toggleDrawer: 'toggleDrawer'
    }),
    // toggleDrawer(val) {
    //   this.$store.commit('toggleDrawer', val)
    // }
    login() {
      fetch(`http://localhost:3000/googleauth/loginurl?redirect=http://localhost:8081${this.$route.fullPath}`, {
          method: 'GET',
          mode: 'cors',
        })
        .then(res => res.json())
        .then((result) => {
          console.log(result)
          console.log("fuck")
          window.location.href = result
          // "https://accounts.google.com/o/oauth2/auth?client_id=138866895643-s1ujmhe4bt35gbhht9p53st8rusqh2s2.apps.googleusercontent.com\u0026redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fgoogleauth%2Fauth\u0026response_type=code\u0026scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email\u0026state=JPtpS7XXz9d%2BZ1IMohq%2FMzt4suJ32LhrJL9ePvjemIg%3D"
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.mdc-top-app-bar {
  z-index: 1;
}
</style>
