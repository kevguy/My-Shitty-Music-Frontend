<template lang="html">
  <div id="customBtn" class="customGPlusSignIn" v-on:click="signIn()">
    <span class="icon"></span>
    <span class="buttonText">Google</span>
  </div>
</template>

<script>
// const google = ;
// import * as google from 'googleapis'



export default {
  mounted() {
    // console.log(require('googleapis'))
    let gapiScript = document.createElement('script')
    gapiScript.setAttribute('src', 'https://apis.google.com/js/client:platform.js')
    gapiScript.async = true
    gapiScript.onload = () => {
      window.gapi.load('auth2', () => {
        console.log(window.gapi.auth2)
        this.auth2 = window.gapi.auth2.init({
          client_id: "138866895643-s1ujmhe4bt35gbhht9p53st8rusqh2s2.apps.googleusercontent.com",
          // Scopes to request in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        })
      })
    }
    document.head.appendChild(gapiScript)
    // gapi.load('auth2', function() {
    //   auth2 = gapi.auth2.init({
    //     client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
    //     // Scopes to request in addition to 'profile' and 'email'
    //     //scope: 'additional_scope'
    //   });
    // });

    // const oauth2Client = new google.auth.OAuth2(
    //   // YOUR_CLIENT_ID,
    //   "138866895643-s1ujmhe4bt35gbhht9p53st8rusqh2s2.apps.googleusercontent.com",
    //   // YOUR_CLIENT_SECRET,
    //   "iOoQnyf-tHxv1IcwyYs8u1BQ",
    //   // YOUR_REDIRECT_URL
    //   ""
    // );
    //
    // // generate a url that asks permissions for Google+ and Google Calendar scopes
    // const scopes = [
    //   'https://www.googleapis.com/auth/plus.me',
    //   'https://www.googleapis.com/auth/calendar'
    // ];
    //
    // const url = oauth2Client.generateAuthUrl({
    //   // 'online' (default) or 'offline' (gets refresh_token)
    //   access_type: 'offline',
    //
    //   // If you only need one scope you can pass it as a string
    //   scope: scopes
    // });
    // console.log(google)
  },
  methods: {
    async signIn() {
      try {
        const googleLoginResult = await this.auth2.grantOfflineAccess()
        if (googleLoginResult) {
          const code = googleLoginResult.code
          console.log(code)
          const result = await this.$store.dispatch('GOOGLE_LOGIN', code)
          // console.log(result)
          // if (result.error) {
          //   console.warn(result);
          //   return;
          // }
          if (this.$store.state.isLogin) {
            localStorage.setItem('userInfo', JSON.stringify({
              userId: this.$store.state.userId,
              userDisplayName: this.$store.state.userDisplayName,
              token: this.$store.state.token
            }))
          }

          let data = localStorage.getItem('userInfo')
          if (data) {
            data = JSON.parse(data)
          } else {
            this.$store.commit('logout')
          }
          const hihi = await this.$store.dispatch('UPDATE_LOGIN_STATE', {
            user_id: data.userId,
            token: data.token,
            display_name: data.userDisplayName
          })
        } else {
          // update login state
          this.$store.commit('logout')
        }
      } catch (e) {
        console.error(e)
        this.$store.commit('logout')
      }
    }
  }
}
</script>

<style lang="css">
#customBtn {
  align-self: flex-start;
  // display: inline-block;
  background: white;
  color: #444;
  // width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
  padding-right: 4px;
}
#customBtn:hover {
  cursor: pointer;
}
span.label {
  font-family: serif;
  font-weight: normal;
}
span.icon {
  background: url('https://developers.google.com/identity/sign-in/g-normal.png') transparent 5px 50% no-repeat;
  display: inline-block;
  vertical-align: middle;
  width: 42px;
  height: 42px;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  // padding-left: 42px;
  // padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
}
</style>
