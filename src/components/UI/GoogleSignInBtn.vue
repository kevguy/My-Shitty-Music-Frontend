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
    signIn() {
      this.auth2.grantOfflineAccess()
        .then((result) => {
          console.log(result)
          return result.code
        })
        .then((code) => {
          fetch('http://localhost:3000/authenticate', {
            method: 'POST',
            mode: 'cors',
            // headers: {
            //   'Accept': 'application/json',
            //   'Content-Type': 'application/json'
            // },
            body: JSON.stringify({
              type: 'google',
              code
            })
          })
          .then((result) => result.json())
          .then(result => console.log(result))
        })
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
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
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
  padding-left: 42px;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  /* Use the Roboto font that is loaded in the <head> */
  font-family: 'Roboto', sans-serif;
}
</style>
