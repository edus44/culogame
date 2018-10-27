import Vue from 'vue'
import App from './App.vue'
import store from './store'

const vm = new Vue({
  el: '#app',
  store,
  render: h => h(App),
})

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') window.vm = vm
