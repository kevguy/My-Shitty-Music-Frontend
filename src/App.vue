<template>
  <div id="app" v-on:click.stop="closeDrawer()">
    <Toolbar />
    <Drawer />
    <transition name="fade" mode="out-in">
      <router-view class="view mdc-top-app-bar--prominent-fixed-adjust"></router-view>
    </transition>
    ROOT_BACKEND_URL
    <YouTubeMusicPlayer />
    <Snackbar />
  </div>
</template>

<script>
  import Drawer from './components/UI/Drawer.vue'
  import Toolbar from './components/UI/Toolbar.vue'
  import YouTubeMusicPlayer from '@/components/YouTubeMusicPlayer.vue'
  import Snackbar from '@/components/UI/Snackbar.vue'
  import firebase from '@firebase/app'
  import '@firebase/messaging'

  export default {
    components: { Drawer, Toolbar, YouTubeMusicPlayer, Snackbar },
    data() {
      return {
        ws: undefined
      }
    },
    async created() {},
    computed: {
      sendWebsocketMsg() { return this.$store.state.Websocket.sendWebsocketMsg }
    },
    watch: {
      sendWebsocketMsg(val) {
        if (val) {
          console.log('hihi')
          console.log(this.$store.state.Websocket.websocketMsg)
          this.ws.send(this.$store.state.Websocket.websocketMsg)
          this.$store.commit('updateWebsocketMsg', '')
          this.$store.commit('toggleSendWebsocketMsg', false)
        }
      }
    },
    async mounted () {
      this.connectToWebSocket()
      const messaging = firebase.messaging()
      messaging.usePublicVapidKey('BJvhLia-szgnA5EUiD71RT_ffEwG1d3E9mcK2poaMSWlzZAkhM-WAmfqBLlwDmf4WGO1MX7PWno7PCHGERj8Grc')

      try {
        // navigator.serviceWorker.register('/service-worker.js');
        const registration = await navigator.serviceWorker.register(`${process.env.BASE_URL}firebase-messaging-sw.js`)
        messaging.useServiceWorker(registration)

        const result = await messaging.requestPermission()
        // permission granted (don't need to check `result`)
        // Retrieve an Instance ID token for use with FCM.
        const currentToken = await messaging.getToken()
        if (currentToken) {
          // subscribe token to
          if (this.$store.state.isLogin) {
            this.$store.dispatch('UPDATE_FCM_TOKEN', currentToken)
          }
          // handle token refresh
          messaging.onTokenRefresh(async () => {
            try {
              const currentToken = await messaging.getToken()
              if (this.$store.state.isLogin) {
                this.$store.dispatch('UPDATE_FCM_TOKEN', currentToken)
              }
            } catch (e) {
              console.error('Unable to refresh token', e)
            }
          })
        }
      } catch (e) {
        // unable to get permission to notify
        console.log('Unable to get permission to notify.', e);
      }
    },
    methods: {
      closeDrawer() {
        this.$store.commit("toggleDrawer", false)
      },
      connectToWebSocket() {
        this.ws = new WebSocket(this.$store.state.wsUrl)
        this.ws.onopen = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('websocket connected')
            this.$store.commit('updateSnackBarMsg', 'websocket connected')
            this.$store.commit('toggleSnackBar', true)
            this.ws.send(JSON.stringify({
              type: 'text',
              content: 'ping'
            }))
          }
        }

        this.ws.onmessage = (evt) => {
          console.log('websocket content')
          console.log(evt.data)
          const data = JSON.parse(evt.data)
          if (data.type === 'text') {
            this.$store.commit('updateSnackBarMsg', JSON.stringify(data.content))
            this.$store.commit('toggleSnackBar', true)
          } else if (data.type === 'play') {
            const result = data.content.split(":")
            this.$store.commit('updatePlay', {
              id: result[0],
              plays: result[1]
            })
          } else {
            const result = JSON.parse(data.content)
            // if ($this.$store.state.isLogin && result.userid === this.$store.state.userId) {
            // use this when deploy
            // }
            const msg = `${result.username} upvoted ${result.song}`
            this.$store.commit('updateSnackBarMsg', msg)
            this.$store.commit('toggleSnackBar', true)

            this.$store.commit('updateUpvote', {
              songId: result.songid,
              upvotes: result.upvotes,
              userId: result.userid
            })
          }
        }
      }
    }
  }
</script>

<style lang="scss">
// #app {
//   font-family: 'Avenir', Helvetica, Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   text-align: center;
//   color: #2c3e50;
// }
// #nav {
//   padding: 30px;
//   a {
//     font-weight: bold;
//     color: #2c3e50;
//     &.router-link-exact-active {
//       color: #42b983;
//     }
//   }
// }
@import "~material-components-web/dist/material-components-web.css";
@import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

body {
  margin: 0px;
}

.view {
  // so the youtube music player won't cover the content
  margin-bottom: 135px;
}
</style>
