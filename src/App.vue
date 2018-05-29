<template>
  <!-- <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div> -->
  <div id="app" v-on:click.stop="closeDrawer()">
    <Toolbar />
    <Drawer />
    <!-- <header class="header">
      <nav class="inner">
        <router-link to="/" exact>
          <img class="logo" src="~public/logo-48.png" alt="logo">
        </router-link>
        <router-link to="/top">Top</router-link>
        <router-link to="/new">New</router-link>
        <router-link to="/show">Show</router-link>
        <router-link to="/ask">Ask</router-link>
        <router-link to="/job">Jobs</router-link>
        <a class="github" href="https://github.com/vuejs/vue-hackernews-2.0" target="_blank" rel="noopener">
          Built with Vue.js
        </a>
      </nav>
    </header> -->
    <transition name="fade" mode="out-in">
      <router-view class="view mdc-top-app-bar--prominent-fixed-adjust"></router-view>
    </transition>
    <YouTubeMusicPlayer />
    <Snackbar />
  </div>
</template>

<script>
  import Drawer from './components/UI/Drawer.vue'
  import Toolbar from './components/UI/Toolbar.vue'
  import YouTubeMusicPlayer from '@/components/YouTubeMusicPlayer.vue'
  import Snackbar from '@/components/UI/Snackbar.vue'

  export default {
    components: { Drawer, Toolbar, YouTubeMusicPlayer, Snackbar },
    data() {
      return {
        ws: undefined
      }
    },
    async created() {
      // const res = await fetch(`/api/environment`)
      // const result = await res.json()
      // this.$store.commit('SET_ENVIRONMENT', result.message)
    },
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
    mounted () {
      this.connectToWebSocket()
    },
    methods: {
      closeDrawer() {
        this.$store.commit("toggleDrawer", false)
      },
      connectToWebSocket() {
        this.ws = new WebSocket("ws://localhost:3000/websocket")
        this.ws.onopen = () => {
          console.log('websocket connected')
          this.$store.commit('updateSnackBarMsg', 'websocket connected')
          this.$store.commit('toggleSnackBar', true)

          this.ws.send(JSON.stringify({
            type: 'text',
            content: 'ping'
          }))
        }

        this.ws.onmessage = (evt) => {
          // const myTextArea = document.getElementById("textarea1");
          // myTextArea.value = myTextArea.value + "\n" + evt.data;
          //
          // if (evt.data == "pong") {
          //   setTimeout(function() { ws.send("ping"); }, 2000)
          // }
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

.view {
  // so the youtube music player won't cover the content
  margin-bottom: 135px;
}
</style>
