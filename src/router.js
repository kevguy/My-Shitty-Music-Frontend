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
      name: 'songs',
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
      component: AddSong
    },
    { path: '*', redirect: '/' }
  ]
})

router.beforeEach(async (to, form, next) => {
  console.log('beforeEach')
  console.log(to)
  await store.dispatch('FETCH_SONGS')
  if (window && window.localStorage && (to.path !== '/songs')) {
    console.log('conducting checking')
    let data = localStorage.getItem('userInfo')
    if (data) {
      data = JSON.parse(data)
    } else {
      next('/')
      return
    }
    const hihi = await store.dispatch('UPDATE_LOGIN_STATE', {
      user_id: data.userId,
      token: data.token,
      display_name: data.userDisplayName
    })
    console.log('hihi')
    console.log(hihi)
    if (!store.state.isLogin) {
      await store.dispatch('FETCH_USER_UPVOTES')
      next('/')
      return
    }
  }
  next()
})

export default router
