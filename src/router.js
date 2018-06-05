import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Home from './views/Home.vue'
import About from './views/About.vue'


import Songs from './views/Songs.vue'
import AddSong from './views/AddSong.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   component: About
    // },
    {
      path: '/',
      component: Songs
    },
    {
      path: '/songs',
      name: 'songs',
      component: Songs
    },
    {
      path: '/add-song',
      name: 'add song',
      component: AddSong,
      meta: {
        requiresAuth: true
      }
    },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach(async (to, form, next) => {
  // https://medium.com/@anas.mammeri/vue-2-firebase-how-to-build-a-vue-app-with-firebase-authentication-system-in-15-minutes-fdce6f289c3c
  console.log('beforeEach')
  console.log(to)

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // if accessing home page/ song page, fetch songs
  if (to.path === '/' || to.path === '/songs') {
    await store.dispatch('FETCH_SONGS')
  }

  // check if user is logged in
  if (window && window.localStorage) {
    console.log(`checking if user's logged in`)
    let data = localStorage.getItem('userInfo')
    if (data) {
      console.log('shit')
      console.log(data)
      data = JSON.parse(data)
      console.log(data)
      console.log(`i'm logging in`)
      await store.dispatch('UPDATE_LOGIN_STATE', {
        user_id: data.userId,
        token: data.token,
        display_name: data.userDisplayName
      })
    }
    if (!store.state.isLogin && requiresAuth) {
      next('/')
      return
    }
    // if (store.state.isLogin) {
    //   await store.dispatch('FETCH_USER_UPVOTES')
    // } else if (requiresAuth) {
    //   next('/')
    //   return
    // }
    next()
  }
})

export default router
