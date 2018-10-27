import Vue from 'vue'
import App from './App.vue'

const vm = new Vue({
  el: '#app',
  render: h => h(App),
})

Vue.config.productionTip = false
if (process.env.NODE_ENV === 'development') window.vm = vm
