import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

store.dispatch('SETUP_FCM')

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
