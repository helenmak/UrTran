import Vue from 'vue'
import App from './App'
// import store from './store/store'
import eventBus from './plugins/eventBus'


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // store,
  data: {
    eventBus
  },
  components: { App },
  render: h => h(App)
})
