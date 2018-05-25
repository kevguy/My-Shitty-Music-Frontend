import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'


import Songs from './views/Songs.vue'

Vue.use(Router)

export default new Router({
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
      path: '/songs',
      name: 'songs',
      component: Songs
    },
    { path: '/', redirect: '/songs' }
  ]
})
